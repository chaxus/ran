import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import 'ranui/button';
import 'ranui/card';
import 'ranui/conversation';
import 'ranui/input';
import 'ranui/reasoning';
import 'ranui/theme-switch';

let html = '';

describe('the page server-renders without a framework', () => {
  beforeAll(async () => {
    const { renderHTMLToString } = await import('ranui/ssr-stream');
    html = await renderHTMLToString(readFileSync(resolve(process.cwd(), 'views/index.html'), 'utf8'));
  });

  it('paints the shell as Declarative Shadow DOM, before any script runs', () => {
    // The point of dropping React was not fewer dependencies for their own sake: the same
    // element implementation renders on the server and upgrades in the browser, so there is
    // no second component tree to keep in step with the first.
    for (const tag of ['r-conversation', 'r-input', 'r-button', 'r-theme-switch']) {
      const at = html.indexOf(`<${tag}`);
      expect(at, `${tag} is missing from the page`).toBeGreaterThan(-1);
      expect(html.slice(at, at + 400), `${tag} did not render`).toContain('shadowrootmode');
    }
  });

  it('keeps the composer in the conversation footer slot', () => {
    // The footer is a sticky seat the follower observes, so a growing composer does not
    // silently push the latest message out of view.
    expect(html).toMatch(/<form[^>]*slot="footer"/);
  });

  it('ships no framework runtime', () => {
    expect(html).not.toMatch(/react|__NEXT|data-reactroot/i);
  });
});
