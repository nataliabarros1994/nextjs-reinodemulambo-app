import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");

function resolveAlias(specifier) {
  if (!specifier.startsWith("@/")) return null;
  const rest = specifier.slice(2);
  const base = path.join(SRC, rest);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.mjs`,
    path.join(base, "index.ts"),
    path.join(base, "index.js"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return pathToFileURL(candidate).href;
    }
  }
  return pathToFileURL(base).href;
}

export async function resolve(specifier, context, nextResolve) {
  const mapped = resolveAlias(specifier);
  if (mapped) return nextResolve(mapped, context);
  return nextResolve(specifier, context);
}
