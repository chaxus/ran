import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 400 } });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-select');
});

// ── with value ──────────────────────────────────────────────────────────────

test('select — with value', async ({ page }) => {
  await mount(
    page,
    `
    <div id="popup-root"></div>
    <r-select id="sel" style="width: 200px" defaultValue="lucy"
      getPopupContainerId="popup-root" trigger="click">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
      <r-option value="tom">Tom</r-option>
    </r-select>
  `,
  );
  const el = page.locator('#sel');
  await expect(el).toBeVisible();
  await page.waitForTimeout(50);

  await expect(el).toHaveScreenshot('select-with-value.png');

  // Selected text must be vertically centred inside the trigger.
  // This assertion fails when selection-item lacks align-items/line-height centering.
  // Screenshots above are created first so baseline generation always works.
  const centering = await page.evaluate(() => {
    const host = document.querySelector('#sel') as (HTMLElement & { _shadowDom?: ShadowRoot }) | null;
    // `host.shadowRoot` is always null — ranui attaches **closed** shadow roots, so this
    // assertion silently degraded to `centering === null` and could never pass. Components
    // expose the root as `_shadowDom`.
    const root = host?._shadowDom;
    const container = root?.querySelector('.selection') as HTMLElement | null;
    const item = root?.querySelector('.selection-item') as HTMLElement | null;
    if (!container || !item) return null;
    const range = document.createRange();
    range.selectNodeContents(item);
    const textBox = range.getBoundingClientRect();
    const cBox = container.getBoundingClientRect();
    const textMid = textBox.top + textBox.height / 2;
    const containerMid = cBox.top + cBox.height / 2;
    return { diff: Math.abs(textMid - containerMid) };
  });

  expect(centering).not.toBeNull();
  expect(centering!.diff).toBeLessThanOrEqual(3);
});

// ── placeholder (no value) ──────────────────────────────────────────────────

test('select — placeholder', async ({ page }) => {
  await mount(
    page,
    `
    <div id="popup-root"></div>
    <r-select style="width: 200px" getPopupContainerId="popup-root" trigger="click">
      <r-option value="apple">Apple</r-option>
      <r-option value="banana">Banana</r-option>
    </r-select>
  `,
  );
  const el = page.locator('r-select');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('select-placeholder.png');
});

// ── showSearch ───────────────────────────────────────────────────────────────

test('select — showSearch', async ({ page }) => {
  await mount(
    page,
    `
    <div id="popup-root"></div>
    <r-select style="width: 200px" showSearch getPopupContainerId="popup-root" trigger="click">
      <r-option value="apple">Apple</r-option>
      <r-option value="banana">Banana</r-option>
      <r-option value="grape">Grape</r-option>
    </r-select>
  `,
  );
  const el = page.locator('r-select');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('select-show-search.png');
});

// ── disabled ─────────────────────────────────────────────────────────────────

test('select — disabled', async ({ page }) => {
  await mount(
    page,
    `
    <r-select style="width: 200px" disabled defaultValue="lucy">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
    </r-select>
  `,
  );
  const el = page.locator('r-select');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('select-disabled.png');
});

// ── open dropdown ─────────────────────────────────────────────────────────────

test('select — selecting an option with the mouse keeps focus on the host', async ({ page }) => {
  // The clicked option is portaled to <body> and isn't itself focusable, so the browser's
  // default mousedown-focus-shift behavior used to move focus to <body> — unlike
  // keyboard-driven selection, which never left the host.
  await mount(
    page,
    `
    <r-select id="sel" style="width: 200px">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
    </r-select>
  `,
  );
  await page.locator('#sel').click();
  await page.waitForTimeout(350);
  await page.getByRole('option', { name: 'Lucy' }).click();
  await expect(page.locator('#sel')).toBeFocused();
});

test('select — open dropdown', async ({ page }) => {
  await mount(
    page,
    `
    <div id="popup-root" style="position: relative; min-height: 4px;"></div>
    <r-select style="width: 200px" defaultValue="lucy"
      getPopupContainerId="popup-root" trigger="click">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
      <r-option value="tom">Tom</r-option>
    </r-select>
  `,
  );
  await page.locator('r-select').click();
  await page.waitForTimeout(350);
  await expect(page).toHaveScreenshot('select-open.png');
});

// ── vertical rhythm ─────────────────────────────────────────────────────────

// The host is an inline-block wrapping an inline-block, so it used to reserve
// descender space no child ever painted: 38px of host around a 32px field, with
// the label riding 3px above the host's own centre. Nothing in jsdom can see
// that -- it lays nothing out -- and a screenshot of the select alone looks
// perfectly fine, because the phantom row is transparent. It only shows up as a
// sibling being "misaligned" once the select shares a centred row with one,
// which is exactly how it was found: a globe icon beside a language menu.
test('select — the label sits on the host centre, so a centred sibling lines up', async ({ page }) => {
  await mount(
    page,
    `
    <div id="row" style="display: flex; align-items: center; gap: 8px;">
      <span id="mark" style="width: 16px; height: 16px; background: #000;"></span>
      <r-select id="sel" style="width: 200px" defaultValue="lucy" trigger="click">
        <r-option value="jack">Jack</r-option>
        <r-option value="lucy">Lucy</r-option>
      </r-select>
    </div>
  `,
  );
  await page.waitForTimeout(50);

  const centres = await page.evaluate(() => {
    const sel = document.getElementById('sel') as HTMLElement & { _text?: HTMLElement };
    const mark = document.getElementById('mark') as HTMLElement;
    const mid = (el: Element) => {
      const r = el.getBoundingClientRect();
      return (r.top + r.bottom) / 2;
    };
    return {
      host: mid(sel),
      label: mid(sel._text as HTMLElement),
      sibling: mid(mark),
      hostHeight: sel.getBoundingClientRect().height,
    };
  });

  // The field is 32px tall and nothing else is in the host, so that is what the
  // host must measure -- 38 means the phantom row is back.
  expect(centres.hostHeight).toBe(32);
  expect(Math.abs(centres.label - centres.host)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(centres.label - centres.sibling)).toBeLessThanOrEqual(0.5);
});
