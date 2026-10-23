import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const RANUI = resolve(__dirname, '../..');

/** Exercise the real CLI in a disposable package; never rewrite checked-in generated docs. */
function generate(sources: Record<string, string>): string {
  const temporary = mkdtempSync(join(tmpdir(), 'ranui-component-api-'));
  const root = join(temporary, 'ranui');
  try {
    mkdirSync(join(root, 'utils'), { recursive: true });
    for (const [owner, source] of Object.entries(sources)) {
      const directory = join(root, 'components', owner);
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, 'index.ts'), source);
    }
    execFileSync(process.execPath, [join(RANUI, 'bin/generate-component-api.ts')], {
      cwd: root,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return readFileSync(join(root, 'docs/COMPONENTS.md'), 'utf8');
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

function attributes(document: string, tag: string): string[] {
  const section = document.split(`## \`<${tag}>\``)[1]?.split('\n## ')[0];
  expect(section, `missing generated section for ${tag}`).toBeDefined();
  const line = section!.match(/^- \*\*Attributes\*\*: (.+)$/m)?.[1] ?? '';
  return [...line.matchAll(/`([^`:]+)(?::[^`]*)?`/g)].map((match) => match[1]);
}

describe('component API source extraction', () => {
  let document: string;
  beforeAll(() => {
    const sources = Object.fromEntries(
      ['image', 'select/option', 'tabpane', 'progress', 'icon'].map((owner) => [
        owner.replaceAll('/', '-'),
        readFileSync(join(RANUI, 'components', owner, 'index.ts'), 'utf8'),
      ]),
    );
    document = generate({
      ...sources,
      typed: `class Typed {
        static get observedAttributes(): string[] {
          // 'comment-only' is not an observed attribute, even with a closing ] bracket.
          return ['value', /* 'also-comment-only' */ 'sheet', 'value'];
        }
      }
      defineSSR('r-typed', Typed);`,
      constant: `const attributes: string[] = ['open', 'sheet'];
      class Constant {
        static get observedAttributes(): string[] { return attributes; }
        render() { return ['not-an-attribute']; }
      }
      defineSSR('r-constant', Constant);`,
      readonly: `const attributes = ['open', 'sheet'] as const;
      class Readonly {
        static get observedAttributes(): readonly string[] { return attributes; }
      }
      defineSSR('r-readonly', Readonly);`,
      absent: `class Absent { render() { return ['not-an-attribute']; } }
      defineSSR('r-absent', Absent);`,
    });
  });

  it.each([
    ['r-img', ['alt', 'fallback', 'sheet', 'src']],
    ['r-option', ['disabled', 'sheet', 'value']],
    ['r-tab', ['disabled', 'effect', 'icon', 'iconsize', 'key', 'label', 'sheet']],
    ['r-progress', ['dot', 'percent', 'sheet', 'total', 'type']],
  ])('documents the real %s observed attributes', (tag, expected) => {
    expect(attributes(document, tag as string)).toEqual(expected);
  });

  it('preserves typed inline arrays without treating comments as attributes', () => {
    expect(attributes(document, 'r-typed')).toEqual(['sheet', 'value']);
  });

  it('resolves a same-file array constant instead of an unrelated later return array', () => {
    expect(attributes(document, 'r-constant')).toEqual(['open', 'sheet']);
  });

  it('supports readonly array annotations and const assertions', () => {
    expect(attributes(document, 'r-readonly')).toEqual(['open', 'sheet']);
  });

  it('does not invent observed attributes when the accessor is absent', () => {
    expect(attributes(document, 'r-absent')).toEqual([]);
  });

  it.each([`return makeAttributes('not-an-attribute');`, `return ['sheet', dynamicAttribute];`])(
    'rejects attributes that require runtime evaluation: %s',
    (body) => {
      expect(() =>
        generate({
          computed: `class Computed { static get observedAttributes() { ${body} } }
        defineSSR('r-computed', Computed);`,
        }),
      ).toThrow(/observedAttributes/);
    },
  );

  it('describes lazy bundled icons and optional eager or custom registration', () => {
    const section = document.split('## `<r-icon>`')[1].split('\n## ')[0];
    expect(section).toContain('loaded on demand');
    expect(section).not.toContain('Requires registration');
    expect(section).not.toContain('has no built-in icon set');
    expect(section).toContain('registerBuiltinIcons');
    expect(section).toContain('registerIcon(name, svgString)');
  });
});
