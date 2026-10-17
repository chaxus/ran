/** Resolve source aliases and emit NodeNext-compatible relative declaration imports. */
import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createScanner, SyntaxKind } from 'typescript/unstable/ast';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');

async function declarations(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await declarations(full)));
    else if (entry.name.endsWith('.d.ts')) files.push(full);
  }
  return files;
}

async function resolveImport(file, specifier) {
  if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return specifier;
  const base = specifier.startsWith('@/')
    ? resolve(dist, 'src', specifier.slice(2))
    : resolve(dirname(file), specifier);
  const stem = base.replace(/\.(?:js|ts)$/, '');
  for (const candidate of [`${stem}.d.ts`, join(stem, 'index.d.ts')]) {
    try {
      await access(candidate);
    } catch {
      continue;
    }
    let target = relative(dirname(file), candidate.replace(/\.d\.ts$/, '.js'))
      .split(sep)
      .join('/');
    if (!target.startsWith('.')) target = `./${target}`;
    return target;
  }
  throw new Error(`Unresolved declaration import: ${relative(dist, file)} -> ${specifier}`);
}

let rewritten = 0;
for (const file of await declarations(dist)) {
  const source = await readFile(file, 'utf8');
  const scanner = createScanner(true, undefined, source);
  const edits = [];
  let previous;
  let beforePrevious;
  for (let token = scanner.scan(); token !== SyntaxKind.EndOfFile; token = scanner.scan()) {
    const isImport =
      previous === SyntaxKind.FromKeyword ||
      previous === SyntaxKind.ImportKeyword ||
      (previous === SyntaxKind.OpenParenToken && beforePrevious === SyntaxKind.ImportKeyword);
    if (token === SyntaxKind.StringLiteral && isImport) {
      const specifier = scanner.getTokenValue();
      const target = await resolveImport(file, specifier);
      if (target !== specifier)
        edits.push({ start: scanner.getTokenStart(), end: scanner.getTokenEnd(), text: JSON.stringify(target) });
    }
    beforePrevious = previous;
    previous = token;
  }
  let next = source;
  for (const edit of edits.reverse()) next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
  if (edits.length) await writeFile(file, next);
  rewritten += edits.length;
}
console.log(`[dts-imports] rewrote ${rewritten} declaration import(s)`);
