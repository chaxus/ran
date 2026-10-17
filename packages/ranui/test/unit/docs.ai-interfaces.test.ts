import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const RANUI = resolve(__dirname, '../..');
const read = (file: string): string => readFileSync(resolve(RANUI, file), 'utf8');
const declared = new Set([...read('theme/tokens.less').matchAll(/(--ran-[\w-]+)\s*:/g)].map((match) => match[1]));
const references = (text: string): string[] => [
  ...new Set([...text.matchAll(/--ran-[\w-]+/g)].map((match) => match[0])),
];
const missing = (text: string): string[] => references(text).filter((token) => !declared.has(token));

describe('executable AI interface guidance', () => {
  it('uses declared foundation tokens in every CSS example, including fallbacks', () => {
    const examples = [...read('docs/AI_INTERFACES.md').matchAll(/^```css\n([\s\S]*?)^```/gm)].map((match) => match[1]);
    expect(examples.length).toBeGreaterThan(0);
    for (const example of examples) {
      expect(references(example).length).toBeGreaterThan(0);
      expect(missing(example)).toEqual([]);
    }
  });

  it('keeps the authoritative spacing relationship table on the real scale', () => {
    const table = read('docs/DESIGN.md')
      .split('### Spacing carries meaning')[1]
      ?.split('**Inside before outside:**')[0];
    expect(table, 'the spacing relationship table must remain discoverable').toBeDefined();
    expect(references(table!).length).toBeGreaterThanOrEqual(6);
    expect(missing(table!)).toEqual([]);
  });

  it('detects invented names even when a valid fallback masks them', () => {
    expect(missing('padding: var(--ran-space-5, var(--ran-space-6));')).toEqual(['--ran-space-5']);
    expect(missing('height: var(--ran-size-8, var(--ran-size-7));')).toEqual(['--ran-size-8']);
  });

  it('ships the guide and its local reading dependencies in the actual npm package', () => {
    const packed = JSON.parse(
      execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json', '--workspaces=false'], {
        cwd: RANUI,
        encoding: 'utf8',
        timeout: 30_000,
        // Windows launches npm through npm.cmd; all arguments here are fixed literals.
        shell: process.platform === 'win32',
        env: { ...process.env, npm_config_update_notifier: 'false' },
      }),
    ) as Record<string, { files: Array<{ path: string }> }> | Array<{ files: Array<{ path: string }> }>;
    // npm versions return either an array or a package-name keyed object.
    const files = new Set(Object.values(packed)[0].files.map((file) => file.path));
    expect(files.has('docs/AI_INTERFACES.md')).toBe(true);
    for (const [, target] of read('docs/AI_INTERFACES.md').matchAll(/\[[^\]]+\]\((\.\.?\/[^)#]+)(?:#[^)]*)?\)/g)) {
      const relative = target.startsWith('../') ? target.slice(3) : `docs/${target.slice(2)}`;
      expect(files.has(relative), `published guide links to missing ${relative}`).toBe(true);
    }
    expect(files.has('CLAUDE.md')).toBe(true);
    const plugin = read('../../plugins/ranui/skills/ranui/SKILL.md');
    for (const [, target] of plugin.matchAll(/`node_modules\/ranui\/([^`]+)`/g)) {
      expect(files.has(target), `installed plugin routes to missing ${target}`).toBe(true);
    }
  }, 35_000);
});
