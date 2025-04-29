#!/usr/bin/env bun
/**
 * Tao-of-React Refactor – import-alias codemod
 *
 * Run with:
 *   bun codemods/update-import-alias.js "app/**/*.{ts,tsx}"
 */


/** @type {Record<string, string>} */
const ALIAS_MAP = {
  "@components/": "@common/ui/",
  "../../modules/": "@modules/",
  "../modules/": "@modules/",
};

const transformer = (fileInfo, { jscodeshift: j }) => {
  return j(fileInfo.source)
    .find(j.ImportDeclaration)
    .forEach((path) => {
      const src = path.node.source.value;
      if (typeof src !== "string") return;

      for (const [from, to] of Object.entries(ALIAS_MAP)) {
        if (src.startsWith(from)) {
          path.node.source.value = src.replace(from, to);
          break;
        }
      }
    })
    .toSource();
};

export default transformer;
export const parser = "tsx";
