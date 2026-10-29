import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { posix, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const RANUI = resolve(__dirname, '../..');
const read = (file: string): string => readFileSync(resolve(RANUI, file), 'utf8');
const declared = new Set([...read('theme/tokens.less').matchAll(/(--ran-[\w-]+)\s*:/g)].map((match) => match[1]));
const references = (text: string): string[] => [
  ...new Set([...text.matchAll(/--ran-[\w-]+/g)].map((match) => match[0])),
];
const missing = (text: string): string[] => references(text).filter((token) => !declared.has(token));
const cssExamples = (text: string): string[] =>
  [...text.matchAll(/^```css\r?\n([\s\S]*?)^```/gm)].map((match) => match[1]);

const proseWithoutFences = (text: string): string => {
  let fence = '';
  return text
    .split(/\r?\n/)
    .filter((line) => {
      const boundary = line.match(/^ {0,3}(`{3,}|~{3,})/);
      if (boundary) {
        if (!fence) fence = boundary[1];
        else if (boundary[1][0] === fence[0] && boundary[1].length >= fence.length) fence = '';
        return false;
      }
      return !fence;
    })
    .join('\n');
};
const localReadingDependencies = (text: string, owner: string): string[] => {
  const links = proseWithoutFences(text).matchAll(/\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+["'][^)]*)?\)/g);
  return [
    ...new Set(
      [...links].flatMap((match) => {
        const target = match[1] || match[2];
        if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(target)) return [];
        const path = target.split(/[?#]/)[0];
        return path ? [posix.normalize(posix.join(posix.dirname(owner), path))] : [];
      }),
    ),
  ];
};
const exampleImports = (text: string): string[] => {
  // Read executable fenced/inline examples, not surrounding source-path prose.
  const fenced = [...text.matchAll(/^```[^\r\n]*\r?\n([\s\S]*?)^```/gm)].map((match) => match[1]);
  const inline = [...proseWithoutFences(text).matchAll(/`([^`\r\n]+)`/g)].map((match) => match[1]);
  const examples = [...fenced, ...inline].join('\n');
  return [...examples.matchAll(/\bimport\s+(?:(?:type\s+)?[^;'"\n]*?\s+from\s*)?['"](ranui(?:\/[^'"]+)?)['"]/g)].map(
    (match) => match[1],
  );
};
const packageExports = Object.keys(JSON.parse(read('package.json')).exports) as string[];
const isPublicImport = (specifier: string): boolean => {
  const subpath = specifier === 'ranui' ? '.' : `.${specifier.slice('ranui'.length)}`;
  return packageExports.some(
    (entry) =>
      entry === subpath ||
      (entry.includes('*') && subpath.startsWith(entry.split('*')[0]) && subpath.endsWith(entry.split('*')[1])),
  );
};

describe('executable interface guidance', () => {
  it.each(['\n', '\r\n'])('checks CSS examples with %j line endings', (newline) => {
    const css = 'padding: var(--ran-space-5, var(--ran-space-6));';
    const examples = cssExamples(['```css', css, '```'].join(newline));
    expect(examples).toEqual([`${css}${newline}`]);
    expect(missing(examples[0])).toEqual(['--ran-space-5']);
  });

  it('uses declared foundation tokens in every CSS example, including fallbacks', () => {
    const examples = ['DESIGN'].flatMap((owner) => cssExamples(read(`docs/${owner}.md`)));
    expect(examples.length).toBeGreaterThan(0);
    expect(references(examples.join('\n')).length).toBeGreaterThanOrEqual(6);
    for (const example of examples) {
      expect(missing(example)).toEqual([]);
    }
  });

  it('keeps the authoritative spacing relationship table on the real scale', () => {
    const table = read('docs/adapters/DESIGN.md')
      .split('\n## ranui spacing\n')[1]
      ?.split('\n## ')[0]
      ?.split('\n')
      .filter((line) => line.startsWith('|'))
      .join('\n');
    expect(table, 'the spacing relationship table must remain discoverable').toBeDefined();
    expect(references(table!).length).toBeGreaterThanOrEqual(6);
    expect(missing(table!)).toEqual([]);
  });

  it('detects invented names even when a valid fallback masks them', () => {
    expect(missing('padding: var(--ran-space-5, var(--ran-space-6));')).toEqual(['--ran-space-5']);
    expect(missing('height: var(--ran-size-8, var(--ran-size-7));')).toEqual(['--ran-size-8']);
  });

  it.each(['\n', '\r\n'])('resolves installed reading links with %j line endings', (newline) => {
    const markdown = [
      '[bare](docs/DESIGN.md#visual)',
      '[sibling](./INTERACTION.md)',
      '[parent](../CLAUDE.md)',
      '[normalized](../docs/../docs/CODING.md)',
      '[external](https://example.com/guide)',
      '[section](#feedback)',
      '```md',
      '[example](./not-a-reading-dependency.md)',
      '```',
      '~~~md',
      '[example](./also-not-a-dependency.md)',
      '~~~',
    ].join(newline);
    expect(localReadingDependencies(markdown, 'docs/INDEX.md')).toEqual([
      'docs/docs/DESIGN.md',
      'docs/INTERACTION.md',
      'CLAUDE.md',
      'docs/CODING.md',
    ]);
    expect(localReadingDependencies('[bare](docs/DESIGN.md)', 'CLAUDE.md')).toEqual(['docs/DESIGN.md']);
  });

  it('checks executable plugin imports against public package exports', () => {
    expect(
      exampleImports(
        "Source registration lives at `@/utils/ssr-registry`. `import { defineSSR } from 'ranui/ssr-registry'`",
      ),
    ).toEqual(['ranui/ssr-registry']);
    expect(isPublicImport('ranui/ssr-registry')).toBe(false);
    expect(isPublicImport('ranui/ssr')).toBe(true);
    const imports = exampleImports(read('../../plugins/ran/skills/ranui/SKILL.md'));
    expect(imports).toContain('ranui/button');
    expect(imports).toContain('ranui/builder');
    expect(imports.filter((specifier) => !isPublicImport(specifier))).toEqual([]);
  });

  it('ships canonical docs and all their local reading dependencies in the actual npm package', () => {
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
    for (const owner of ['DESIGN']) {
      expect(files.has(`docs/${owner}.md`), `package omits docs/${owner}.md`).toBe(true);
    }
    const canonical = [...files].filter(
      (path) => path === 'CLAUDE.md' || /^README(?:\.[^/]+)?\.md$/.test(path) || /^docs\/.+\.md$/.test(path),
    );
    const omitted = canonical.flatMap((owner) =>
      localReadingDependencies(read(owner), owner)
        .filter((target) => !files.has(target))
        .map((target) => `${owner} -> ${target}`),
    );
    expect(omitted).toEqual([]);
    expect(files.has('CLAUDE.md')).toBe(true);
    const plugin = read('../../plugins/ran/skills/ranui/SKILL.md');
    const targets = new Set([...plugin.matchAll(/`((?:docs\/[^`]+\.md|CLAUDE\.md))`/g)].map((match) => match[1]));
    expect(
      targets.size,
      'the installed reference table must be exercised, not silently skipped',
    ).toBeGreaterThanOrEqual(4);
    for (const target of targets) {
      expect(files.has(target), `installed plugin routes to missing ${target}`).toBe(true);
    }
  }, 35_000);
});
