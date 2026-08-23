import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

/**
 * `r-section` had no end-to-end coverage, and shipped for its whole life rendering its
 * heading *below* its body: the constructor built both trees in one factory, appended them
 * itself, and returned the header, so the mount helper's own `appendChild` moved the header
 * back to the end. Unit tests asserted the elements existed and passed throughout.
 *
 * These assertions are about order, which is the thing that was wrong, and which no
 * assertion about presence can catch.
 */
test.describe('r-section', () => {
  test.beforeEach(async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-section');
  });

  test('puts the heading above the body', async ({ page }) => {
    await mount(page, '<r-section id="s" heading="Heading" subtitle="Subtitle">Body copy.</r-section>');

    const order = await insideShadow(page, '#s', (root) =>
      [...root.children].map((child) => child.className),
    );
    expect(order).toEqual(['ran-section-header', 'ran-section-body']);
  });

  test('paints the heading above the body', async ({ page }) => {
    // The DOM order above is what broke; this is what a reader would have noticed. `:host` is
    // `display: block`, so document order is paint order and the two assertions cannot drift.
    await mount(page, '<r-section id="s" heading="Heading" subtitle="Subtitle">Body copy.</r-section>');

    const boxes = await insideShadow(page, '#s', (root) => {
      const box = (selector: string) => {
        const el = root.querySelector(selector) as HTMLElement | null;
        return el ? el.getBoundingClientRect().top : null;
      };
      return { heading: box('.ran-section-heading'), body: box('.ran-section-body') };
    });
    expect(boxes.heading).not.toBeNull();
    expect(boxes.body).not.toBeNull();
    expect(boxes.heading!).toBeLessThan(boxes.body!);
  });

  test('renders', async ({ page }) => {
    await mount(
      page,
      '<div style="width: 380px"><r-section id="s" heading="Heading" subtitle="Subtitle">Body copy.</r-section></div>',
    );
    await expect(page.locator('div').first()).toHaveScreenshot('section.png');
  });
});
