/** Normalize emitted declarations for NodeNext ESM consumers. */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const assets = /\.(?:css|less|scss|sass|styl|svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|eot|wasm|json)(?:[?#].*)?$/i;

async function declarations(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await declarations(path)));
    else if (entry.isFile() && entry.name.endsWith('.d.ts')) files.push(path);
  }
  return files;
}

function moduleReferences(source, { createScanner, SyntaxKind }) {
  const scanner = createScanner(false, undefined, source);
  const references = [];
  let previous;
  let beforePrevious;
  for (let kind = scanner.scan(); kind !== SyntaxKind.EndOfFile; kind = scanner.scan()) {
    const start = scanner.getTokenStart();
    const end = scanner.getTokenEnd();
    const text = source.slice(start, end);
    if (kind === SyntaxKind.SingleLineCommentTrivia || kind === SyntaxKind.MultiLineCommentTrivia) {
      if (/^\/\/\/\s*<reference\b/.test(text)) {
        const match = /\bpath\s*=\s*(["'])(.*?)\1/.exec(text);
        if (match) {
          const offset = match.index + match[0].indexOf(match[1]);
          references.push({
            start: start + offset,
            end: start + offset + match[2].length + 2,
            value: match[2],
            path: true,
          });
        }
      }
      continue;
    }
    if (kind >= SyntaxKind.FirstTriviaToken && kind <= SyntaxKind.LastTriviaToken) continue;
    const isModule =
      previous?.kind === SyntaxKind.FromKeyword ||
      previous?.kind === SyntaxKind.ImportKeyword ||
      (previous?.kind === SyntaxKind.ModuleKeyword && !scanner.getTokenValue().includes('*')) ||
      (previous?.kind === SyntaxKind.OpenParenToken &&
        (beforePrevious?.kind === SyntaxKind.ImportKeyword || beforePrevious?.text === 'require'));
    if (kind === SyntaxKind.StringLiteral && isModule) references.push({ start, end, value: scanner.getTokenValue() });
    beforePrevious = previous;
    previous = { kind, text, value: kind === SyntaxKind.StringLiteral ? scanner.getTokenValue() : text };
  }
  return references;
}

function relativeSpecifier(from, target) {
  const path = relative(dirname(from), target).split(sep).join('/');
  return path.startsWith('.') ? path : `./${path}`;
}

function applyEdits(source, edits) {
  for (const edit of [...edits].sort((a, b) => b.start - a.start))
    source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
  return source;
}

/** aliasRoot is an absolute path (or a path relative to cwd), defaulting to dist. */
export async function prepareDeclarations({ dist, aliasRoot = dist }) {
  dist = resolve(dist);
  aliasRoot = resolve(aliasRoot);
  // TypeScript belongs to the package invoking its build, not the repository root.
  const require = createRequire(join(process.cwd(), 'package.json'));
  const ast = require('typescript/unstable/ast');
  const files = await declarations(dist);
  const available = new Set(files);
  const outputs = [];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const references = moduleReferences(source, ast);
    const esm = [];
    for (const reference of references) {
      const { value, path } = reference;
      if (!path && ((!value.startsWith('.') && !value.startsWith('@/')) || assets.test(value))) continue;
      const base = value.startsWith('@/') ? resolve(aliasRoot, value.slice(2)) : resolve(dirname(file), value);
      const stem = base.replace(/(?:\.d)?\.(?:[cm]?[jt]s|tsx)$/, '');
      const target = [`${stem}.d.ts`, join(stem, 'index.d.ts')].find((candidate) => available.has(candidate));
      if (!target) throw new Error(`Unresolved declaration import: ${relative(dist, file)} -> ${value}`);
      const specifier = relativeSpecifier(file, target);
      esm.push({ ...reference, text: JSON.stringify(path ? specifier : specifier.replace(/\.d\.ts$/, '.js')) });
    }
    outputs.push({ file, esm: applyEdits(source, esm) });
  }
  // Resolve every reference first: a dangling import must not leave a partial tree.
  for (const output of outputs) await writeFile(output.file, output.esm);
  return { declarations: outputs.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const dist = resolve(process.argv[2] ?? 'dist');
  const result = await prepareDeclarations({ dist, aliasRoot: resolve(dist, process.argv[3] ?? '.') });
  console.log(`Prepared ${result.declarations} ESM declarations.`);
}
