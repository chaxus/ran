import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../dist');

/**
 * Every element `renderHTMLToString` serializes to closed Declarative Shadow DOM.
 *
 * On upgrade `ensureShadowRoot` hands the constructor that painted root, children and all
 * (docs/CODING.md). A constructor that appends instead of replacing or binding leaves two
 * trees in one root, and the stale copy above the live one shifts it out of place.
 */
const SERVER_RENDERED = [
  'attachments',
  'button',
  'card',
  'checkbox',
  'colorpicker',
  'conversation',
  'disclosure-row',
  'dropdown',
  'fan-gallery',
  'glass',
  'icon',
  'input',
  'loading',
  'markdown',
  'math',
  'menubar',
  'mermaid',
  'message',
  'player',
  'popover',
  'progress',
  'route',
  'router',
  'scratch',
  'section',
  'select',
  'skeleton',
  'state-dot',
  'surface-switch',
  'theme-switch',
  'token-meter',
  'tool-card',
  'voice-button',
];

test.describe('a server-rendered element upgrades in place', () => {
  for (const tag of SERVER_RENDERED) {
    test(`r-${tag} holds one copy of its tree`, async ({ page }) => {
      await import(path.join(dist, `${tag}.js`));
      const { renderHTMLToString } = await import(path.join(dist, 'ssr-stream.js'));
      const html: string = await renderHTMLToString(`<r-${tag} id="painted">内容</r-${tag}>`);
      expect(html).toContain('shadowrootmode="closed"');

      await page.setContent(`<!doctype html><meta charset="utf-8"><body>${html}</body>`);
      await page.addScriptTag({ content: readFileSync(path.join(dist, 'iife', `${tag}.iife.js`), 'utf8') });

      // The same element built on the client alone is the reference: an upgrade from
      // server-rendered markup must end with the tree a fresh element has, not more.
      const trees = await page.evaluate((name) => {
        type Host = HTMLElement & { _shadowDom?: ShadowRoot };
        const count = (host: Host) =>
          [...(host._shadowDom?.children ?? [])].filter((child) => child.tagName !== 'STYLE').length;
        const fresh = document.createElement(`r-${name}`) as Host;
        fresh.textContent = '内容';
        document.body.appendChild(fresh);
        return { upgraded: count(document.getElementById('painted') as Host), fresh: count(fresh) };
      }, tag);
      expect(trees.fresh).toBeGreaterThan(0);
      expect(trees.upgraded).toBe(trees.fresh);
    });
  }
});
