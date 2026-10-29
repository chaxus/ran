import { expect, test, type Page } from './fixtures';

/**
 * The measurable items of the Ran Design checklist (`design/DESIGN.md`), run on the pages a
 * visitor is most likely to land on. What cannot be measured stays a manual item there.
 */
const PAGES = [
  '/',
  '/cn/',
  '/fa/',
  '/design/guide',
  '/ranui/',
  '/ranui/button/',
  '/ranui/select/',
  '/cn/ranui/input/',
  '/ranuts/',
  '/agents/',
  '/ranuts/choosing/',
];
const HOMES = new Set(['/', '/cn/', '/fa/']);

const ready = async (page: Page, path: string): Promise<void> => {
  await page.goto(path);
  // Not `networkidle`: the site keeps prefetching in idle time by design.
  await page.waitForFunction(() => document.readyState === 'complete' && customElements.get('r-theme-switch'));
};

for (const width of [320, 1280]) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const path of PAGES) {
      test(`${path} passes the five-second and trunk tests`, async ({ page }) => {
        await ready(page, path);
        // Which page am I on: one page heading, on the first screen.
        const heading = page.locator('h1:visible');
        await expect(heading).toHaveCount(1);
        expect(await heading.evaluate((h) => h.getBoundingClientRect().bottom)).toBeLessThanOrEqual(900);
        // Which site is this: the wordmark links home.
        await expect(page.locator('.site-header .wordmark')).toBeVisible();
        expect(await page.locator('.site-header .wordmark').getAttribute('href')).toMatch(/^\/([a-z]{2}\/)?$/);
        // What are the main sections: in the header, or one tap away in the drawer.
        const header = page.locator('.site-header .nav__link');
        if (!(await header.first().isVisible())) await expect(page.locator('.drawer__button')).toBeVisible();
        // How can I search.
        await expect(page.locator('.search-open')).toBeVisible();
        // Where am I: the current section in the header, the current page in the section's list.
        if (!HOMES.has(path))
          await expect(
            page.locator('.site-header .nav__link[aria-current], #doc-sidebar .sb__list [aria-current="page"]').first(),
          ).toBeAttached();
      });

      test(`${path} has named targets of at least 24px or spaced apart`, async ({ page }) => {
        await ready(page, path);
        const problems = await page.evaluate(() => {
          const shown = (element: Element): boolean => {
            const box = element.getBoundingClientRect();
            // A closed drawer sits off-canvas, beside the viewport.
            const onScreen = box.right > 0 && box.left < innerWidth;
            // A closed menu keeps its links laid out but transparent.
            const visible = element.checkVisibility({ opacityProperty: true, visibilityProperty: true });
            return box.width > 1 && box.height > 1 && onScreen && visible;
          };
          const targets = [
            ...document.querySelectorAll(
              'a[href], button, summary, input:not([type="hidden"]), select, [role="button"], [role="tab"]',
            ),
          ].filter(shown);
          const named = (element: Element): boolean =>
            Boolean(
              element.textContent?.trim() ||
              element.getAttribute('aria-label') ||
              element
                .getAttribute('aria-labelledby')
                ?.split(/\s+/)
                .some((id) => document.getElementById(id)?.textContent?.trim()) ||
              element.getAttribute('title') ||
              (element instanceof HTMLInputElement &&
                ['submit', 'button', 'reset'].includes(element.type) &&
                element.value) ||
              element.querySelector('img[alt]:not([alt=""])') ||
              (element as HTMLInputElement).labels?.length,
            );
          const describe = (element: Element, box: DOMRect): string =>
            `${Math.round(box.width)}x${Math.round(box.height)} <${element.tagName.toLowerCase()} class="${element.getAttribute('class') ?? ''}"> "${(element.textContent ?? '').trim().slice(0, 24)}"`;
          // WCAG 2.5.8: a target inside running text is exempt from the size rule. Running text is
          // the nearest block around it, not a flex or grid row, holding words outside any target.
          const inline = (element: Element): boolean => {
            if (getComputedStyle(element).display !== 'inline') return false;
            let block = element.parentElement;
            while (block && getComputedStyle(block).display.startsWith('inline')) block = block.parentElement;
            if (!block || /flex|grid/.test(getComputedStyle(block).display)) return false;
            const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
              const text = walker.currentNode;
              if (/[\p{L}\p{N}]/u.test(text.textContent ?? '') && !text.parentElement!.closest('a, button'))
                return true;
            }
            return false;
          };
          const boxes = targets.map((element) => element.getBoundingClientRect());
          const small = (box: DOMRect): boolean => box.width < 24 || box.height < 24;
          const centre = (box: DOMRect): [number, number] => [box.left + box.width / 2, box.top + box.height / 2];
          const found: string[] = [];
          targets.forEach((element, i) => {
            const box = boxes[i]!;
            if (!named(element)) found.push(`unnamed ${describe(element, box)}`);
            if (!small(box) || inline(element)) return;
            // The spacing exception: a 24px circle on its centre touches no other target, and no
            // other undersized target's circle.
            const [x, y] = centre(box);
            const crowded = boxes.some((other, j) => {
              // A target nested in another is one target to the pointer.
              if (j === i || element.contains(targets[j]!) || targets[j]!.contains(element)) return false;
              const [ox, oy] = centre(other);
              if (small(other) && Math.hypot(x - ox, y - oy) < 24) return true;
              const nx = Math.max(other.left, Math.min(x, other.right));
              const ny = Math.max(other.top, Math.min(y, other.bottom));
              return Math.hypot(x - nx, y - ny) < 12;
            });
            if (crowded) found.push(`crowded ${describe(element, box)}`);
          });
          return found;
        });
        expect(problems).toEqual([]);
      });

      test(`${path} sets its text to read: measure, leading, size and heading spacing`, async ({ page }) => {
        await ready(page, path);
        const problems = await page.evaluate(() => {
          const shown = (element: Element): boolean => {
            const box = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
          };
          const label = (element: Element): string =>
            `${element.tagName.toLowerCase()} "${(element.textContent ?? '').trim().slice(0, 32)}"`;
          const found: string[] = [];

          // Running text: the measure is counted in the width of its own zero, the CSS `ch`.
          const zero = document.createElement('span');
          zero.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
          document.body.append(zero);
          for (const block of document.querySelectorAll('main p, main li')) {
            if (!shown(block) || block.closest('pre, table, ran-demo, nav, .gp, [data-glass]')) continue;
            const style = getComputedStyle(block);
            const size = parseFloat(style.fontSize);
            const leading = parseFloat(style.lineHeight);
            if (block.getBoundingClientRect().height < leading * 1.5) continue; // one line: no measure, no leading
            zero.style.font = style.font;
            zero.textContent = '0000000000';
            const measure = (block as HTMLElement).clientWidth / (zero.getBoundingClientRect().width / 10);
            // "About 45–75 characters": the zero is narrower than an average letter, so allow some slack.
            if (measure > 85) found.push(`${label(block)} runs ${measure.toFixed(0)}ch wide`);
            if (leading / size < 1.5) found.push(`${label(block)} has leading ${(leading / size).toFixed(2)}`);
          }
          zero.remove();

          // Text a reader needs is at least 12px.
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          const small = new Set<Element>();
          while (walker.nextNode()) {
            const parent = walker.currentNode.parentElement;
            if (!parent || !walker.currentNode.textContent?.trim() || small.has(parent) || !shown(parent)) continue;
            if (parseFloat(getComputedStyle(parent).fontSize) < 12) small.add(parent);
          }
          for (const element of small) found.push(`${label(element)} is ${getComputedStyle(element).fontSize}`);

          // A heading binds to what it introduces: more space above it than below.
          for (const heading of document.querySelectorAll('main h2, main h3')) {
            const before = heading.previousElementSibling;
            const after = heading.nextElementSibling;
            if (!shown(heading) || !before || !after || !shown(before) || !shown(after)) continue;
            const box = heading.getBoundingClientRect();
            const above = box.top - before.getBoundingClientRect().bottom;
            const below = after.getBoundingClientRect().top - box.bottom;
            if (above <= below)
              found.push(`${label(heading)} has ${above.toFixed(0)}px above, ${below.toFixed(0)}px below`);
          }
          return found;
        });
        expect(problems).toEqual([]);
      });
    }
  });
}

test.describe('focus and stability', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const path of ['/', '/design/guide', '/ranui/button/']) {
    test(`${path} shows where keyboard focus is`, async ({ page }) => {
      await ready(page, path);
      // Pixels, not styles: ranui draws its focus ring inside closed shadow roots. Each focused
      // area is compared with the same area of a freshly loaded page at the same scroll, where
      // nothing is focused; `blur()` cannot stand in, it leaves a shadow host's inner element
      // focused in Firefox.
      type Clip = { x: number; y: number; width: number; height: number };
      const stops: Array<{ name: string; clip: Clip; scroll: number; shot: Buffer }> = [];
      for (let stop = 0; stop < 13; stop++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => {
          const element = document.activeElement;
          if (!element || element === document.body) return null;
          const box = element.getBoundingClientRect();
          if (box.width < 1 || box.top < 4 || box.bottom > innerHeight - 4) return null;
          return {
            name: `<${element.tagName.toLowerCase()} class="${element.getAttribute('class') ?? ''}">`,
            clip: { x: Math.max(0, box.left - 4), y: box.top - 4, width: box.width + 8, height: box.height + 8 },
            scroll: scrollY,
          };
        });
        if (focused)
          stops.push({ ...focused, shot: await page.screenshot({ clip: focused.clip, animations: 'disabled' }) });
      }
      expect(stops.length).toBeGreaterThan(5);
      await ready(page, path);
      const unchanged: string[] = [];
      for (const stop of stops) {
        await page.evaluate((y) => scrollTo(0, y), stop.scroll);
        const without = await page.screenshot({ clip: stop.clip, animations: 'disabled' });
        if (without.equals(stop.shot)) unchanged.push(stop.name);
      }
      expect(unchanged).toEqual([]);
    });
  }

  test('pages do not shift while they load', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Layout Instability API is Chromium-only');
    await page.addInitScript(() => {
      const record = window as unknown as { shift: number; moved: string[] };
      record.shift = 0;
      record.moved = [];
      type Shift = PerformanceEntry & {
        value: number;
        hadRecentInput: boolean;
        sources?: Array<{ node?: Node; previousRect: DOMRectReadOnly; currentRect: DOMRectReadOnly }>;
      };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Shift[]) {
          if (entry.hadRecentInput) continue;
          record.shift += entry.value;
          // Name what moved, so a failure on a runner we cannot reproduce says where to look.
          for (const source of entry.sources ?? []) {
            const node = source.node instanceof Element ? source.node : source.node?.parentElement;
            const name = node
              ? `${node.tagName.toLowerCase()}${node.className ? `.${String(node.className).split(' ')[0]}` : ''}`
              : '?';
            record.moved.push(
              `${entry.value.toFixed(4)} @${Math.round(entry.startTime)}ms ${name} y ${Math.round(source.previousRect.y)}→${Math.round(source.currentRect.y)} h ${Math.round(source.previousRect.height)}→${Math.round(source.currentRect.height)}`,
            );
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    for (const path of PAGES) {
      await ready(page, path);
      await page.waitForTimeout(500);
      const { shift, moved } = await page.evaluate(() => {
        const record = window as unknown as { shift: number; moved: string[] };
        return { shift: record.shift, moved: record.moved };
      });
      // 0.1 is the "good" Core Web Vitals line; the site measures 0.007 at worst.
      expect(shift, `${path}\n${moved.join('\n')}`).toBeLessThan(0.05);
    }
  });
});
