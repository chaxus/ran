import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const hash = (text: string) => createHash('sha256').update(text).digest('hex');
const bundlePath = 'plugins/ran/skills/design/references';
export function markdownFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.isSymbolicLink()) throw new Error(`Reference symlink is not portable: ${entry.name}`);
      return entry.isDirectory()
        ? markdownFiles(path.join(root, entry.name)).map((file) => `${entry.name}/${file}`)
        : entry.name.endsWith('.md')
          ? [entry.name]
          : [];
    })
    .sort();
}
export function verifyLocalLinks(root: string, files: string[]): void {
  for (const file of files) {
    const source = readFileSync(path.join(root, file), 'utf8');
    for (const match of source.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
      const link = match[1]!.replace(/^<|>$/g, '');
      if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(link)) continue;
      const target = decodeURIComponent(link.split(/[?#]/)[0]!);
      const absolute = path.resolve(root, path.dirname(file), target);
      if (path.relative(root, absolute).startsWith('..') || !existsSync(absolute))
        throw new Error(`Unresolved portable reference: ${file} -> ${link}`);
    }
  }
}
export function syncAgentPlugin(root: string, check = false): void {
  const sourceRoot = path.join(root, 'design');
  const names = markdownFiles(sourceRoot);
  if (!names.includes('README.md')) throw new Error('design/README.md must be the portable entry');
  verifyLocalLinks(sourceRoot, names);
  const expected = new Map<string, string>();
  const sources = names.map((name) => {
    const content = readFileSync(path.join(sourceRoot, name), 'utf8');
    const generated = `<!-- Generated from design/${name}; edit the source, then run sync:agent-plugin. -->\n\n${content}`;
    expected.set(name, generated);
    return { source: `design/${name}`, sha256: hash(content), output: name, outputSha256: hash(generated) };
  });
  expected.set(
    'manifest.json',
    JSON.stringify({ schema: 1, generator: 'bin/sync-agent-plugin.ts', sources }, null, 2) + '\n',
  );
  const destination = path.join(root, bundlePath);
  // The plugin is copied out of this repository on install; MIT requires the notice to travel with it.
  const license = readFileSync(path.join(root, 'LICENSE'), 'utf8');
  const pluginLicense = path.join(root, 'plugins/ran/LICENSE');
  if (check) {
    if (!existsSync(pluginLicense) || readFileSync(pluginLicense, 'utf8') !== license)
      throw new Error('Stale plugin LICENSE; run sync:agent-plugin');
    if (!existsSync(destination)) throw new Error('Missing agent reference bundle; run sync:agent-plugin');
    const actual = [...markdownFiles(destination), 'manifest.json'].sort();
    if (JSON.stringify(actual) !== JSON.stringify([...expected.keys()].sort()))
      throw new Error('Stale agent reference file set; run sync:agent-plugin');
    for (const [name, content] of expected)
      if (!existsSync(path.join(destination, name)) || readFileSync(path.join(destination, name), 'utf8') !== content)
        throw new Error(`Stale agent reference: ${name}; run sync:agent-plugin`);
    verifyLocalLinks(destination, names);
    return;
  }
  mkdirSync(path.dirname(pluginLicense), { recursive: true });
  writeFileSync(pluginLicense, license);
  rmSync(destination, { recursive: true, force: true });
  for (const [name, content] of expected) {
    mkdirSync(path.dirname(path.join(destination, name)), { recursive: true });
    writeFileSync(path.join(destination, name), content);
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.slice(2).some((arg) => arg !== '--check'))
    throw new Error('Usage: node bin/sync-agent-plugin.ts [--check]');
  syncAgentPlugin(fileURLToPath(new URL('../', import.meta.url)), process.argv.includes('--check'));
}
