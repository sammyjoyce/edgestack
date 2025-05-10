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
 *                         [--treesitter] [--dry-run]
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
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { join, extname, relative } from "path";
import ignore from "ignore";

/* ── CLI ARG PARSING ───────────────────────────────────────────────────── */
type Args = {
  _: string[];
  ext?: string;
  skip?: string;
  "dry-run"?: boolean;
  treesitter?: boolean;
  "keep-docs"?: boolean;      // preserve /** JSDoc / TSDoc blocks
};

function parseArgs(argv: string[]): Args {
  const args: Args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2) as keyof Args;
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
      (args as any)[key] = val;
    } else {
      args._.push(token);
    }
  }
  return args;
}

const parsed = parseArgs(Bun.argv.slice(2));
const projectDir = parsed._[0] ?? process.cwd();
const exts = new Set(
  (parsed.ext ?? ".ts,.tsx").split(",").map((e) => (e.startsWith(".") ? e : `.${e}`))
);
const skipDirs = new Set(
  (parsed.skip ?? "node_modules,.git").split(",").filter(Boolean)
);
const DRY_RUN = parsed["dry-run"] ?? false;
const USE_TS = parsed.treesitter ?? false;
const KEEP_DOCS = parsed["keep-docs"] ?? false;

/* ── .gitignore handling ──────────────────────────────────────────────── */
const ig = ignore();
try {
  const gitignorePath = join(projectDir, ".gitignore");
  const giContent = await readFile(gitignorePath, "utf8");
  ig.add(giContent.split(/\r?\n/));
} catch {
  /* no .gitignore present or unreadable – proceed without it */
}

/* ── TREE‑SITTER SETUP (OPTIONAL) ──────────────────────────────────────── */
let Parser: any = null;
let LANGUAGES: Record<string, any> = {};
if (USE_TS) {
  try {
    Parser = (await import("web-tree-sitter")).default;
    await Parser.init();
    // Dynamically load grammars for extensions we care about
    // Only ts/tsx/js/jsx for now; extend as needed
    if (exts.has(".ts") || exts.has(".tsx")) {
      const Lang = await Parser.Language.load(
        "https://unpkg.com/tree-sitter-typescript@0.20.2/typescript.wasm"
      );
      LANGUAGES[".ts"] = LANGUAGES[".tsx"] = Lang;
    }
    if (exts.has(".js") || exts.has(".jsx")) {
      const Lang = await Parser.Language.load(
        "https://unpkg.com/tree-sitter-javascript@0.20.2/javascript.wasm"
      );
      LANGUAGES[".js"] = LANGUAGES[".jsx"] = Lang;
    }
  } catch (err) {
    console.warn("Tree‑sitter unavailable – falling back to regex stripping.", err);
    Parser = null;
  }
}

/* ── HELPERS ───────────────────────────────────────────────────────────── */
/* Determine whether a comment node is a JSDoc/TSDoc that *precedes* a declaration */
function isDocComment(node: any, src: string): boolean {
  if (!src.startsWith("/**", node.startIndex)) return false;

  // Grab the next meaningful sibling (skip other comments)
  let sib = node.nextSibling;
  while (sib && sib.type === "comment") sib = sib.nextSibling;
  if (!sib) return false;

  // Common declaration node types in TS/JS grammars
  const declTypes = new Set([
    "function_declaration",
    "method_definition",
    "class_declaration",
    "lexical_declaration",
    "variable_declaration",
    "interface_declaration",
    "type_alias_declaration",
    "enum_declaration",
    "property_signature",
    "method_signature",
    "enum_member",
    "export_statement",
  ]);

  return declTypes.has(sib.type);
}

/* Regex‑based fallback */
function stripRegex(content: string): string {
  // remove single‑line comments (avoid URL “://”)
  let out = content.replace(/(?<!:)\/\/.*$/gm, "");

  // choose multi‑line removal strategy based on KEEP_DOCS
  out = KEEP_DOCS
    ? out.replace(/\/\*(?!\*)([\s\S]*?)\*\//g, "")   // keep /** ... */ docs
    : out.replace(/\/\*[\s\S]*?\*\//g, "");          // strip all blocks

  // remove empty JSX {}
  out = out.replace(/^\s*{\s*}\s*$/gm, "");

  // collapse blank lines
  return out.replace(/^\s*$(?:\r?\n)/gm, "");
}

/* Tree‑sitter‑based stripper (comments only, preserves code/strings) */
function stripTreeSitter(content: string, ext: string): string {
  const lang = LANGUAGES[ext];
  if (!lang || !Parser) return stripRegex(content);

  const parser = new Parser();
  parser.setLanguage(lang);
  const tree = parser.parse(content);

  const comments = tree.rootNode.descendantsOfType("comment");
  let result = "";
  let last = 0;

  for (const node of comments) {
    const startIdx = node.startIndex;
    const endIdx = node.endIndex;

    // Preserve documentation comments that actually annotate a declaration
    if (KEEP_DOCS && isDocComment(node, content)) continue;

    result += content.slice(last, startIdx);
    last = endIdx;
  }
  result += content.slice(last);

  // collapse blank lines produced by removals
  return result.replace(/^\s*$(?:\r?\n)/gm, "");
}

/* ── MAIN ──────────────────────────────────────────────────────────────── */
(async () => {
  const files = await walk(projectDir);
  if (files.length === 0) {
    console.log("No matching files.");
    return;
  }

  await Promise.all(
    files.map(async (path) => {
      try {
        const original = await readFile(path, "utf8");
        const ext = extname(path);
        const cleaned = USE_TS && Parser ? stripTreeSitter(original, ext) : stripRegex(original);
        if (original !== cleaned) {
          if (DRY_RUN) {
            console.log(`→ would change ${path}`);
          } else {
            await writeFile(path, cleaned, "utf8");
            console.log(`✓ ${path}`);
          }
        }
      } catch (err) {
        console.error(`✗ ${path}`, err);
      }
    })
  );

  console.log(
    `Comment removal ${DRY_RUN ? "preview" : "process"} completed for ${files.length} file(s).`
  );
})();