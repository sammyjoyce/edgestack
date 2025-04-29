#!/usr/bin/env bun
/**
 * Tao-of-React Refactor — absolute-import codemod + lint helpers
 *
 * Usage:
 *   bun codemods/update-import-alias.ts "app/**/*.{ts,tsx}"
 */

import { glob } from "bun";
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";

// ───────────────────────────────────────────────────────────────────────────
// 1️⃣  Alias configuration
// ───────────────────────────────────────────────────────────────────────────
const FALLBACK_ALIAS: Record<string, string> = {
  "@components/": "@common/ui/",
  "../../modules/": "@modules/",
  "../modules/": "@modules/",
};

// Find a file upward through directories
function findUp(name: string, start: string): string | null {
  let dir = start;
  while (dir !== dirname(dir)) {
    const candidate = join(dir, name);
    if (existsSync(candidate)) return candidate;
    dir = dirname(dir);
  }
  return null;
}

// Load compilerOptions.paths from tsconfig.json (if present)
function loadTsconfigAliases(): Record<string, string> {
  const tsconfigPath = findUp("tsconfig.json", process.cwd());
  if (!tsconfigPath) return {};
  try {
    const cfg = JSON.parse(Bun.file(tsconfigPath).text());
    const paths: Record<string, string[]> = cfg.compilerOptions?.paths ?? {};
    const map: Record<string, string> = {};
    for (const [key, [target]] of Object.entries(paths)) {
      map[key.replace(/\*$/, "")] = target
        .replace(/^\.\//, "")
        .replace(/\*$/, "");
    }
    return map;
  } catch {
    return {};
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 2️⃣  Rewriter
// ───────────────────────────────────────────────────────────────────────────
function rewrite(code: string, aliasMap: Record<string, string>): string {
  return code.replace(
    /(import\s+[^'"]+\s+from\s+|export\s+[^'"]+\s+from\s+|require\()(["'`])([^"'`]+)\2/g,
    (_m, prefix, quote, spec) => {
      for (const [from, to] of Object.entries(aliasMap)) {
        if (spec.startsWith(from)) {
          return `${prefix}${quote}${spec.replace(from, to)}${quote}`;
        }
      }
      return _m;
    },
  );
}

// ───────────────────────────────────────────────────────────────────────────
// 3️⃣  Tao-of-React lint helpers
// ───────────────────────────────────────────────────────────────────────────
type Warning = { file: string; message: string };

function crossModuleWarnings(file: string, code: string): Warning[] {
  const match = file.match(/app\/modules\/([^/]+)/);
  if (!match) return [];
  const current = match[1];
  const warnings: Warning[] = [];
  const rx = /from\s+["'`]@modules\/([^\/"'`]+)\//g;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(code))) {
    if (m[1] !== current) {
      warnings.push({
        file,
        message:
          `cross-module import of "${m[1]}" detected; duplicate until rule-of-three then move to @common/`,
      });
    }
  }
  return warnings;
}

function thirdPartyWarnings(file: string, code: string): Warning[] {
  const warnings: Warning[] = [];
  const rx = /import\s+.*?\s+from\s+["'`]([^\.@][^"'`]+)["'`]/g;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(code))) {
    warnings.push({
      file,
      message: `3rd-party package "${m[1]}" should be wrapped by adapter under @common/ui/`,
    });
  }
  return warnings;
}

function flatComponentWarnings(file: string): Warning[] {
  if (!file.endsWith(".tsx")) return [];
  if (/\/index\.tsx$/.test(file)) return [];
  const base = file.split("/").pop()!;
  if (/^[A-Z]/.test(base)) {
    return [
      {
        file,
        message:
          "component should reside in its own folder <Component>/index.tsx with tests & styles",
      },
    ];
  }
  return [];
}

// ───────────────────────────────────────────────────────────────────────────
// 4️⃣  Main
// ───────────────────────────────────────────────────────────────────────────
async function main() {
  const patterns = Bun.argv.slice(2);
  if (patterns.length === 0) {
    console.error("Supply one or more glob patterns");
    process.exit(1);
  }

  const aliasMap = { ...FALLBACK_ALIAS, ...loadTsconfigAliases() };
  const files = new Set<string>();
  patterns.forEach((p) => glob(p).forEach((f) => files.add(f)));

  for (const file of files) {
    const original = await readFile(file, "utf8");
    const updated = rewrite(original, aliasMap);

    let changed = false;
    if (updated !== original) {
      await writeFile(file, updated);
      changed = true;
    }

    const warnings = [
      ...crossModuleWarnings(file, updated),
      ...thirdPartyWarnings(file, updated),
      ...flatComponentWarnings(file),
    ];

    if (changed) console.log("✏︎", file);
    warnings.forEach((w) => console.warn("⚠︎", w.file, "-", w.message));
  }

  console.log(`✅ Analysed ${files.size} file(s).`);
}

main();
