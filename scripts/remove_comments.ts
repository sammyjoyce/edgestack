#!/usr/bin/env bun
/**
 * scrub‑comments.ts
 *
 * Recursively strips comments and blank lines from source files in any project.
 *
 * Features
 * ────────────────────────────────────────────────────────────────────────────
 * • Works on any extension list (default: .ts,.tsx)
 * • Skips configurable directories (default: node_modules,.git)
 * • Optional Tree‑sitter mode for safe comment removal (`--treesitter`)
 * • Dry‑run mode (`--dry-run`) to preview changes
 * • Bun‑compile‑friendly (no external deps required for regex mode)
 *
 * Usage
 * ────────────────────────────────────────────────────────────────────────────
 *   bun scrub-comments.ts [projectDir] [--ext .ts,.tsx,.js] [--skip node_modules,.git]
 *                         [--treesitter] [--dry-run] [--keep-docs]
 *
 *   bun build scrub-comments.ts --compile --outfile scrub-comments
 *
 * Examples
 * ────────────────────────────────────────────────────────────────────────────
 *   # Strip comments from TypeScript + Zig, skipping vendor folders
 *   bun scrub-comments.ts ./my-proj --ext .ts,.tsx,.zig --skip node_modules,.zig-cache
 *
 *   # Safer stripping via Tree‑sitter when grammar is present
 *   bun scrub-comments.ts ./my-proj --treesitter
 *
 *   # Keep JSDoc/TSDoc blocks
 *   bun scrub-comments.ts ./my-proj --keep-docs
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { join, extname, relative } from "path";
import ignore from "ignore";

/* ── CONFIGURATION ─────────────────────────────────────────────────────── */

/** Configuration options for the script. */
interface ScriptConfig {
	projectDir: string;
	extensions: Set<string>;
	skipDirectories: Set<string>;
	isDryRun: boolean;
	useTreeSitter: boolean;
	keepDocs: boolean;
}

/** Type for raw string arguments parsed from the command line. */
type RawCliArgs = {
	_?: string[]; // Positional arguments
	ext?: string;
	skip?: string;
	"dry-run"?: string;
	treesitter?: string;
	"keep-docs"?: string;
	[key: string]: string | string[] | undefined; // Allow other keys from CLI
};

/**
 * Parses command-line arguments into a structured configuration object.
 * @param argv Array of command-line arguments (e.g., `Bun.argv.slice(2)`).
 * @returns A ScriptConfig object.
 */
function parseCliArguments(argv: string[]): ScriptConfig {
	const rawArgs: RawCliArgs = { _: [] };
	for (let i = 0; i < argv.length; i++) {
		const token = argv[i];
		if (token.startsWith("--")) {
			const key = token.slice(2);
			const nextToken = argv[i + 1];
			// Check if the next token is a value for the current flag, or another flag
			if (nextToken && !nextToken.startsWith("--")) {
				rawArgs[key] = nextToken;
				i++; // Consume the value token
			} else {
				// Flag is present without a value (treat as true), or is the last token
				rawArgs[key] = "true";
			}
		} else {
			// Positional argument
			// The _ property is initialized, so the non-null assertion operator is safe here.
			rawArgs._!.push(token);
		}
	}

	return {
		projectDir: rawArgs._![0] ?? process.cwd(),
		extensions: new Set(
			(rawArgs.ext ?? ".ts,.tsx")
				.split(",")
				.map((e) => (e.startsWith(".") ? e : `.${e}`)),
		),
		skipDirectories: new Set(
			(rawArgs.skip ?? "node_modules,.git").split(",").filter(Boolean),
		),
		isDryRun: rawArgs["dry-run"] === "true",
		useTreeSitter: rawArgs.treesitter === "true",
		keepDocs: rawArgs["keep-docs"] === "true",
	};
}

const config = parseCliArguments(Bun.argv.slice(2));

const PROJECT_DIR = config.projectDir;
const EXTENSIONS = config.extensions;
const SKIP_DIRECTORIES = config.skipDirectories;
const IS_DRY_RUN = config.isDryRun;
const USE_TREE_SITTER = config.useTreeSitter;
const KEEP_DOCS = config.keepDocs;

/* ── .gitignore handling ──────────────────────────────────────────────── */
const ig = ignore();
try {
	const gitignorePath = join(PROJECT_DIR, ".gitignore");
	const giContent = await readFile(gitignorePath, "utf8");
	ig.add(
		giContent
			.split(/\r?\n/)
			.filter((line) => line.trim() !== "" && !line.startsWith("#")),
	);
} catch {
	/* no .gitignore present or unreadable – proceed without it */
}

/* ── TREE‑SITTER SETUP (OPTIONAL) ──────────────────────────────────────── */
let Parser: any = null; // 'any' is acceptable here due to optional dynamic import
let LANGUAGES: Record<string, any> = {}; // 'any' for Tree-sitter language objects

if (USE_TREE_SITTER) {
	try {
		Parser = (await import("web-tree-sitter")).default;
		await Parser.init();

		const grammarMappings = [
			{
				checkExts: [".ts", ".tsx"],
				grammarUrl:
					"https://unpkg.com/tree-sitter-typescript@0.20.2/typescript.wasm",
				assignToExts: [".ts", ".tsx"],
			},
			{
				checkExts: [".js", ".jsx"],
				grammarUrl:
					"https://unpkg.com/tree-sitter-javascript@0.20.2/javascript.wasm",
				assignToExts: [".js", ".jsx"],
			},
			// Add more language grammars here as needed (e.g., .py, .go, .rs)
			// {
			//   checkExts: [".py"],
			//   grammarUrl: "https://unpkg.com/tree-sitter-python@0.20.0/tree-sitter-python.wasm",
			//   assignToExts: [".py"],
			// },
		];

		for (const mapping of grammarMappings) {
			if (mapping.checkExts.some((ext) => EXTENSIONS.has(ext))) {
				try {
					const Lang = await Parser.Language.load(mapping.grammarUrl);
					mapping.assignToExts.forEach((extKey) => {
						LANGUAGES[extKey] = Lang;
					});
					console.info(
						`Loaded Tree-sitter grammar for ${mapping.assignToExts.join(", ")}`,
					);
				} catch (langLoadErr) {
					console.warn(
						`Failed to load Tree-sitter grammar for ${mapping.checkExts.join("/")} from ${mapping.grammarUrl}:`,
						langLoadErr,
					);
				}
			}
		}
		if (Object.keys(LANGUAGES).length === 0) {
			console.warn(
				"Tree-sitter enabled, but no relevant grammars loaded for configured extensions. Falling back to regex.",
			);
			Parser = null; // Effectively disable Tree-sitter if no grammars loaded
		}
	} catch (err) {
		console.warn(
			"Tree‑sitter parser library unavailable – falling back to regex stripping.",
			err,
		);
		Parser = null; // Ensure Parser is null if main import fails
	}
}

/* ── HELPERS ───────────────────────────────────────────────────────────── */

/**
 * Recursively walks a directory to find files matching specified extensions,
 * respecting .gitignore rules and skip directories.
 * @param currentDirPath The directory path to start walking from.
 * @param rootProjectDir The root project directory, used for .gitignore path relativity.
 * @returns A promise that resolves to an array of absolute file paths.
 */
async function walk(
	currentDirPath: string,
	rootProjectDir: string,
): Promise<string[]> {
	const filesFound: string[] = [];
	try {
		const entries = await readdir(currentDirPath, { withFileTypes: true });
		for (const entry of entries) {
			const entryPath = join(currentDirPath, entry.name);
			const relativeEntryPath = relative(rootProjectDir, entryPath);

			if (entry.isDirectory()) {
				if (
					SKIP_DIRECTORIES.has(entry.name) ||
					(relativeEntryPath && ig.ignores(relativeEntryPath))
				) {
					continue;
				}
				filesFound.push(...(await walk(entryPath, rootProjectDir)));
			} else if (entry.isFile()) {
				const fileExt = extname(entry.name);
				if (
					EXTENSIONS.has(fileExt) &&
					(!relativeEntryPath || !ig.ignores(relativeEntryPath))
				) {
					filesFound.push(entryPath);
				}
			}
		}
	} catch (err) {
		console.error(`Error reading directory ${currentDirPath}:`, err);
	}
	return filesFound;
}

/**
 * Determines if a Tree-sitter comment node is a JSDoc/TSDoc block
 * that immediately precedes a recognizable declaration.
 * @param node The Tree-sitter comment node (type: any due to dynamic Tree-sitter loading).
 * @param src The source code string.
 * @returns True if the node is considered a doc comment for a declaration.
 */
function isDocComment(node: any, src: string): boolean {
	if (
		!src.startsWith("/**", node.startIndex) ||
		src.startsWith("/***", node.startIndex)
	) {
		// Standard JSDoc starts with /**, not /*** (often used for license blocks or other special comments)
		return false;
	}

	// Grab the next meaningful sibling (skip other comments, whitespace, etc.)
	let sib = node.nextSibling;
	while (
		sib &&
		(sib.type === "comment" || sib.isMissing() || sib.text.trim() === "")
	) {
		sib = sib.nextSibling;
	}
	if (!sib) return false;

	// Common declaration node types in TS/JS grammars
	// This set can be expanded based on the grammars used.
	const declTypes = new Set([
		"function_declaration",
		"method_definition",
		"class_declaration",
		"lexical_declaration", // let, const
		"variable_declaration", // var
		"interface_declaration",
		"type_alias_declaration",
		"enum_declaration",
		"property_signature", // In interfaces/types
		"method_signature", // In interfaces/types
		// "enum_member", // Decided against, as JSDoc for enum members is less common to keep vs the enum itself
		"export_statement", // Covers `export function ...`, `export class ...` etc.
		// For export statements, we might need to check the child of export_statement
		// e.g., export_statement -> function_declaration
	]);

	if (declTypes.has(sib.type)) {
		return true;
	}

	// Handle cases like `export const foo = ...` where `export_statement` wraps `lexical_declaration`
	if (
		sib.type === "export_statement" &&
		sib.firstChild &&
		declTypes.has(sib.firstChild.type)
	) {
		return true;
	}
	// Handle cases like `export default function ...`
	if (
		sib.type === "export_statement" &&
		sib.namedChildren.length > 0 &&
		declTypes.has(sib.namedChildren[0].type)
	) {
		return true;
	}

	return false;
}

/* Regex‑based fallback */
function stripRegex(content: string): string {
	// remove single‑line comments (avoid URL “://”)
	let out = content.replace(/(?<![:\/\w])\/\/.*$/gm, ""); // Improved to avoid http://, file://, etc.

	// choose multi‑line removal strategy based on KEEP_DOCS
	out = KEEP_DOCS
		? out.replace(/\/\*(?!\*+([^\/]|$))([\s\S]*?)\*\//g, "") // keep /** ... */ (and /*** ... */ etc.) docs, remove /* ... */
		: out.replace(/\/\*[\s\S]*?\*\//g, ""); // strip all blocks

	// remove empty JSX {} (usually result of removed comments in JSX)
	out = out.replace(/\{\s*\}/gm, "");

	// collapse multiple blank lines into one, and remove leading/trailing blank lines
	out = out.replace(/^\s*$(?:\r?\n)+/gm, "\n").trim(); // Results in single blank lines, then trim file
	return out;
}

/* Tree‑sitter‑based stripper (comments only, preserves code/strings) */
function stripTreeSitter(content: string, ext: string): string {
	const lang = LANGUAGES[ext];
	// Parser should already be non-null if USE_TREE_SITTER is true and grammars loaded
	if (!lang || !Parser) {
		console.warn(
			`No Tree-sitter grammar for ${ext}, or Parser not initialized. Falling back to regex for this file.`,
		);
		return stripRegex(content);
	}

	const parser = new Parser();
	parser.setLanguage(lang);
	const tree = parser.parse(content);

	let result = "";
	let lastIndex = 0;

	// Iterate over all nodes and selectively keep non-comments or kept comments
	// This is more robust than just finding comments and slicing around them,
	// especially for nested structures or complex comment scenarios.

	function traverse(node: any) {
		if (node.type === "comment") {
			if (KEEP_DOCS && isDocComment(node, content)) {
				// This JSDoc should be kept, append it.
				result += content.slice(lastIndex, node.startIndex); // Append content before this comment
				result += node.text; // Append the comment itself
				lastIndex = node.endIndex;
			} else {
				// This comment should be stripped. Append content before it.
				result += content.slice(lastIndex, node.startIndex);
				// Add a newline if the comment was on its own line and stripping it would merge lines.
				// This is a heuristic and might need refinement.
				const charBefore =
					node.startIndex > 0 ? content[node.startIndex - 1] : "\n";
				const charAfter =
					node.endIndex < content.length ? content[node.endIndex] : "\n";
				if (
					charBefore === "\n" &&
					charAfter === "\n" &&
					node.text.includes("\n")
				) {
					// Multi-line comment that was block-like
					result += "\n";
				} else if (
					charBefore === "\n" &&
					charAfter === "\n" &&
					!node.text.includes("\n")
				) {
					// Single-line comment on its own line
					result += "\n";
				}
				lastIndex = node.endIndex;
			}
		} else if (node.childCount > 0) {
			node.children.forEach(traverse);
		}
		// If it's a terminal node and not a comment, it will be handled by appending the final slice.
	}

	traverse(tree.rootNode);
	result += content.slice(lastIndex); // Append any remaining content after the last processed node

	// collapse multiple blank lines into one, and remove leading/trailing blank lines
	return result.replace(/^\s*$(?:\r?\n)+/gm, "\n").trim();
}

/* ── MAIN ──────────────────────────────────────────────────────────────── */
(async () => {
	console.info(`Starting comment removal process...`);
	console.info(`Project directory: ${PROJECT_DIR}`);
	console.info(`Extensions: ${Array.from(EXTENSIONS).join(", ")}`);
	console.info(`Skip directories: ${Array.from(SKIP_DIRECTORIES).join(", ")}`);
	console.info(`Dry run: ${IS_DRY_RUN}`);
	console.info(
		`Use Tree-sitter: ${USE_TREE_SITTER && Parser ? "Enabled" : "Disabled/Fallback"}`,
	);
	console.info(`Keep JSDoc/TSDoc: ${KEEP_DOCS}`);

	const files = await walk(PROJECT_DIR, PROJECT_DIR);
	if (files.length === 0) {
		console.log("No matching files found to process.");
		return;
	}
	console.info(`Found ${files.length} file(s) to process.`);

	let changedCount = 0;
	let unchangedCount = 0;

	await Promise.all(
		files.map(async (filePath) => {
			try {
				const originalContent = await readFile(filePath, "utf8");
				const fileExt = extname(filePath);

				const cleanedContent =
					USE_TREE_SITTER && Parser && LANGUAGES[fileExt]
						? stripTreeSitter(originalContent, fileExt)
						: stripRegex(originalContent);

				if (originalContent !== cleanedContent) {
					changedCount++;
					if (IS_DRY_RUN) {
						console.log(`→ Would change: ${relative(PROJECT_DIR, filePath)}`);
					} else {
						await writeFile(filePath, cleanedContent, "utf8");
						console.log(`✓ Cleaned: ${relative(PROJECT_DIR, filePath)}`);
					}
				} else {
					unchangedCount++;
					// console.log(`= Unchanged: ${relative(PROJECT_DIR, filePath)}`); // Optional: log unchanged files
				}
			} catch (err) {
				console.error(
					`✗ Error processing ${relative(PROJECT_DIR, filePath)}:`,
					err,
				);
			}
		}),
	);

	console.log(
		`\nComment removal ${IS_DRY_RUN ? "preview" : "process"} completed.`,
	);
	console.log(`  Processed: ${files.length} file(s)`);
	console.log(`  Changed:   ${changedCount} file(s)`);
	console.log(`  Unchanged: ${unchangedCount} file(s)`);
})();
