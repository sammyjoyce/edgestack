#!/usr/bin/env bun
//// Tao-of-React Refactor — absolute-import codemod + lint helpers
//
// Usage:
//   bun codemods/update-import-alias.ts "app/**/\\*.{ts,tsx}"
//

import { Glob } from "bun";
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { existsSync } from "node:fs";

// ────────────────────────────────────────────────────────────
// 1️⃣  Alias configuration
// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
// 2️⃣  Rewriter
// ────────────────────────────────────────────────────────────
function rewrite(code: string, aliasMap: Record<string, string>): string {
  return code.replace(
      /(import\s+[^'"]+\s+from\s+|export\s+[^'"]+\s+from\s+|require\()(["'`])([^"'`]+)\2/g,
      (m, prefix, quote, spec) => {
        for (const [from, to] of Object.entries(aliasMap)) {
          if (spec.startsWith(from)) {
            return `${prefix}${quote}${spec.replace(from, to)}${quote}`;
          }
        }
        return m;
      },
  );
}

// ────────────────────────────────────────────────────────────
// 3️⃣  Warning helpers – add new checks here
// ────────────────────────────────────────────────────────────
type Warning = { file: string; message: string };

const CHECKS: { name: string; run(file: string, code: string): Warning[] }[] = [
  // existing helpers – left untouched
  {
    name: "crossModule",
    run: crossModuleWarnings,
  },
  {
    name: "thirdParty",
    run: thirdPartyWarnings,
  },
  {
    name: "flatComponent",
    run: flatComponentWarnings,
  },
  // NEW: absolute-path enforcement
  {
    name: "relativePath",
    run: relativePathWarnings,
  },
  // NEW: forbid anonymous default exports
  {
    name: "anonymousComponent",
    run: anonymousComponentWarnings,
  },
  // NEW: PascalCase filenames
  {
    name: "pascalFile",
    run: namedFilePascalWarnings,
  },
  // NEW: deep ../../../../ imports even after rewrite
  {
    name: "deepImport",
    run: deeplyNestedImportsWarnings,
  },
  // --- New Tao rules ------------------------------------------------
  {
    name: "defaultProps",
    run: defaultPropsWarnings,
  },
  {
    name: "classComponent",
    run: classComponentWarnings,
  },
  {
    name: "spreadAttribute",
    run: spreadAttributeWarnings,
  },
];

// ——— Existing checks ————————————————————————————————
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
    const pkg = m[1];
    if (pkg === "react" || pkg.startsWith("react-router")) continue;
    warnings.push({
      file,
      message: `3rd-party package "${pkg}" should be wrapped by adapter under @common/{ui|utils|hooks}`,
    });
  }
  return warnings;
}

function flatComponentWarnings(file: string): Warning[] {
  if (!file.endsWith(".tsx")) return [];
  if (/\/index\.tsx$/.test(file)) return [];
  const base = basename(file);
  if (/^[A-Z]/.test(base)) {
    return [
      {
        file,
        message:
            "component file should reside in its own folder <Component>/index.tsx with tests & styles",
      },
    ];
  }
  return [];
}

// ——— NEW checks ————————————————————————————————
function relativePathWarnings(_file: string, code: string): Warning[] {
  const rx = /(import|require)\s*[({]?\s*["'`]((\.\.\/)+[^"'`]+)["'`]/g;
  const warnings: Warning[] = [];
  let m: RegExpExecArray | null;
  while ((m = rx.exec(code))) {
    warnings.push({
      file: _file,
      message: `relative import "${m[2]}" – use alias paths instead (Tao §1.2)`,
    });
  }
  return warnings;
}

function anonymousComponentWarnings(_file: string, code: string): Warning[] {
  if (!/\.tsx?$/.test(_file)) return [];
  if (/export\s+default\s+\(\s*[\{(]/.test(code)) {
    return [
      {
        file: _file,
        message:
            "anonymous default export – name the component (Tao §2.20)",
      },
    ];
  }
  return [];
}

function namedFilePascalWarnings(file: string): Warning[] {
  if (!file.endsWith(".tsx")) return [];
  if (/\/index\.tsx$/.test(file)) return [];
  const base = basename(file, ".tsx");
  if (!/^[A-Z][A-Za-z0-9]+$/.test(base)) {
    return [
      {
        file,
        message:
            `component file "${base}" is not PascalCase – see Tao §2.2`,
      },
    ];
  }
  return [];
}

function deeplyNestedImportsWarnings(_file: string, code: string): Warning[] {
  const rx = /(import|require)\s*[({]?\s*["'`]((\.\.\/){3,}[^"'`]+)["'`]/g;
  const warnings: Warning[] = [];
  let m: RegExpExecArray | null;
  while ((m = rx.exec(code))) {
    warnings.push({
      file: _file,
      message:
          `import climbs ${m[2].split("../").length - 1} levels – restructure modules (Tao §1.4)`,
    });
  }
  return warnings;
}

// NEW helpers
function defaultPropsWarnings(file: string, code: string): Warning[] {
  return /\.defaultProps\s*=/.test(code)
    ? [
        {
          file,
          message:
            "Avoid `defaultProps`; give defaults in the param destructuring (Tao §2.27)",
        },
      ]
    : [];
}

function classComponentWarnings(file: string, code: string): Warning[] {
  return /class\s+\w+\s+extends\s+React\.(Pure)?Component/.test(code)
    ? [
        {
          file,
          message:
            "Prefer functional components + hooks over class components (Tao §2.18)",
        },
      ]
    : [];
}

function spreadAttributeWarnings(file: string, code: string): Warning[] {
  // matches JSX spread attrs that are *not* {...rest}
  const rx = /<[^>]*\{\s*\.{3}(?!rest[\s}])/;
  return rx.test(code)
    ? [
        {
          file,
          message:
            "Props spreading leaks abstraction – pass explicit props instead (Tao §2.29)",
        },
      ]
    : [];
}

// ────────────────────────────────────────────────────────────
// 4️⃣  Main
// ────────────────────────────────────────────────────────────
async function main() {
  const patterns = Bun.argv.slice(2);
  if (patterns.length === 0) {
    console.error("Supply one or more glob patterns");
    process.exit(1);
  }

  const aliasMap = { ...FALLBACK_ALIAS, ...loadTsconfigAliases() };
  const files = new Set<string>();
  patterns.forEach((p) => {
    const g = new Glob(p);
    for (const f of g.scanSync(".")) files.add(f);
  });

  for (const file of files) {
    const original = await readFile(file, "utf8");
    const updated = rewrite(original, aliasMap);

    const changed = updated !== original;
    if (changed) await writeFile(file, updated);

    // aggregate warnings
    const warnings = CHECKS.flatMap(({ run }) => run(file, updated));

    if (changed) console.log("✏︎", file);
    warnings.forEach((w) => console.warn("⚠︎", w.file, "-", w.message));
  }

  console.log(`✅ Analysed ${files.size} file(s).`);
}

main();