import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '../../dist');
const components = path.resolve(here, '../../components');

/**
 * Every element registered for server rendering, read from the `defineSSR` calls in the
 * component sources so a new component is covered the day it lands. The entry is the
 * component's top-level directory: its ESM build registers the element for the server, its
 * IIFE build defines it in the browser.
 */
const SERVER_RENDERED = readdirSync(components, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'))
  .flatMap((file) =>
    [...readFileSync(path.join(components, file), 'utf8').matchAll(/defineSSR\(\s*['"](r-[a-z-]+)['"]/g)].map(
      ([, tag]) => ({ tag, entry: file.split(path.sep)[0] }),
    ),
  )
  .sort((a, b) => a.tag.localeCompare(b.tag));

test.describe('a server-rendered element upgrades in place', () => {
  test('finds the registered elements', () => {
    expect(SERVER_RENDERED.length).toBeGreaterThan(30);
  });

  for (const { tag, entry } of SERVER_RENDERED) {
    test(`${tag} holds one copy of its tree`, async ({ page }) => {
      await import(path.join(dist, `${entry}.js`));
      const { renderHTMLToString } = await import(path.join(dist, 'ssr-stream.js'));
      const html: string = await renderHTMLToString(`<${tag} id="painted">内容</${tag}>`);
      test.skip(!html.includes('shadowrootmode'), `${tag} renders no Declarative Shadow DOM`);

      await page.setContent(`<!doctype html><meta charset="utf-8"><body>${html}</body>`);
      await page.addScriptTag({ content: readFileSync(path.join(dist, 'iife', `${entry}.iife.js`), 'utf8') });

      // The same element built on the client alone is the reference: an upgrade from
      // server-rendered markup must end with the tree a fresh element has, not more.
      const trees = await page.evaluate((name) => {
        type Host = HTMLElement & { _shadowDom?: ShadowRoot };
        const count = (host: Host) =>
          [...(host._shadowDom?.children ?? [])].filter((child) => child.tagName !== 'STYLE').length;
        const fresh = document.createElement(name) as Host;
        fresh.textContent = '内容';
        document.body.appendChild(fresh);
        return { upgraded: count(document.getElementById('painted') as Host), fresh: count(fresh) };
      }, tag);
      expect(trees.fresh).toBeGreaterThan(0);
      expect(trees.upgraded).toBe(trees.fresh);
    });
  }
});
