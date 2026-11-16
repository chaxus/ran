import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const components = path.resolve(__dirname, '../../components');

const sources = readdirSync(components, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'))
  .map((file) => ({ file, text: readFileSync(path.join(components, file), 'utf8') }));

/** The body of every `constructor() { … }` in a source, braces matched. */
function constructorBodies(text: string): string[] {
  const bodies: string[] = [];
  for (const match of text.matchAll(/constructor\([^)]*\)\s*\{/g)) {
    let depth = 1;
    let index = (match.index ?? 0) + match[0].length;
    const start = index;
    while (depth > 0 && index < text.length) {
      if (text[index] === '{') depth += 1;
      else if (text[index] === '}') depth -= 1;
      index += 1;
    }
    bodies.push(text.slice(start, index - 1));
  }
  return bodies;
}

// A constructor gets back a server-rendered root with its Declarative Shadow DOM snapshot
// still inside (`ensureShadowRoot`). Writing into it directly puts a second tree beside the
// painted one; `mountShadowTree` and `hydrateShadowTree` replace or take it over.
describe('shadow tree mounting', () => {
  it('reads the component sources and their constructors', () => {
    expect(sources.length).toBeGreaterThan(40);
    expect(sources.flatMap(({ text }) => constructorBodies(text)).length).toBeGreaterThan(40);
  });

  it('mounts every constructor-built tree through mountShadowTree or hydrateShadowTree', () => {
    const direct =
      /\b(?:_shadowDom|shadowDom|shadowRoot)\s*[!?]?\s*\.\s*(?:(?:appendChild|append|prepend|insertBefore|replaceChildren)\s*\(|innerHTML\s*=)/;
    const offenders = sources.flatMap(({ file, text }) =>
      constructorBodies(text)
        .filter((body) => direct.test(body))
        .map(() => file),
    );
    expect(offenders).toEqual([]);
  });

  it('decides between keeping and replacing a painted tree in one place', () => {
    const offenders = sources.filter(({ text }) => /\bpaintedShadowChild\s*\(/.test(text)).map(({ file }) => file);
    expect(offenders).toEqual([]);
  });
});
