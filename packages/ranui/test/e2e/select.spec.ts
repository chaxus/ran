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

// ── open state ──────────────────────────────────────────────────────────────

// Reported from the demo's header: hover the trigger, then click without moving
// the pointer. Open. Click again: closes. Click again: it flashes open and shuts
// itself, and from there the menu is stuck.
//
// The trigger used to run both transitions on every click -- close, then open --
// and which one survived depended on which 300ms animation timer happened to be
// in flight, since each read `style.display` to decide whether it had anything
// to do. `display` lags the intent by the length of the exit animation, so
// during that window every read answers about the frame instead of the state.
// `aria-expanded` came apart from the panel in the same window: at one point the
// panel was `display: none` while the combobox still announced itself expanded.
//
// Clicks here are dispatched faster than the animation on purpose. That is the
// whole bug: at a slow enough cadence the old code looks fine.
test('select — clicking the trigger toggles, however fast the clicks arrive', async ({ page }) => {
  await mount(
    page,
    `
    <r-select id="sel" style="width: 200px" defaultValue="lucy" trigger="click">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
    </r-select>
  `,
  );
  const el = page.locator('#sel');
  await page.waitForTimeout(50);

  const readings: { open: boolean; aria: string | null }[] = [];
  for (let i = 0; i < 6; i++) {
    await el.click();
    await page.waitForTimeout(30); // well inside the 300ms animation window
    readings.push(
      await el.evaluate((node) => ({ open: node.hasAttribute('open'), aria: node.getAttribute('aria-expanded') })),
    );
  }

  // Strict alternation from closed: open, closed, open, ...
  expect(readings.map((r) => r.open)).toEqual([true, false, true, false, true, false]);
  // And the announced state never disagrees with the real one.
  for (const r of readings) expect(r.aria).toBe(String(r.open));

  // Not wedged: it still opens after the run.
  await page.waitForTimeout(400);
  await el.click();
  await page.waitForTimeout(400);
  await expect(el).toHaveAttribute('open', '');
  await expect(page.locator('r-dropdown-item').first()).toBeVisible();
});

// `open` is the state, so setting it is a supported way to drive the component —
// that is the point of reflecting it rather than keeping it in a private field.
test('select — the open attribute drives the panel both ways', async ({ page }) => {
  await mount(
    page,
    `
    <r-select id="sel" style="width: 200px" defaultValue="lucy" trigger="click">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
    </r-select>
  `,
  );
  const el = page.locator('#sel');
  await page.waitForTimeout(50);

  await el.evaluate((node: HTMLElement & { open: boolean }) => {
    node.open = true;
  });
  await page.waitForTimeout(400);
  await expect(page.locator('r-dropdown-item').first()).toBeVisible();
  await expect(el).toHaveAttribute('aria-expanded', 'true');

  await el.evaluate((node: HTMLElement & { open: boolean }) => {
    node.open = false;
  });
  await page.waitForTimeout(400);
  await expect(page.locator('r-dropdown-item').first()).toBeHidden();
  await expect(el).toHaveAttribute('aria-expanded', 'false');
});

// The exit used to be a hardcoded 300ms in JS, matched by hand against the
// stylesheet's own duration. Now the code asks the element what it is
// animating, so a panel with nothing to animate finishes immediately — and
// `prefers-reduced-motion` is the case where that is not a micro-optimisation
// but the whole point: a reader who asked for less motion should not be made to
// wait out the motion they are not getting.
test('select — with reduced motion the panel has no animation to wait for', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mount(
    page,
    `
    <r-select id="sel" style="width: 200px" defaultValue="lucy" trigger="click">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
    </r-select>
  `,
  );
  const el = page.locator('#sel');
  await page.waitForTimeout(50);

  await el.click();
  await page.waitForTimeout(60);
  const running = await el.evaluate((node: HTMLElement & { _selectionDropdown?: HTMLElement }) =>
    node._selectionDropdown ? node._selectionDropdown.getAnimations().length : -1,
  );
  expect(running).toBe(0);

  // Closed well inside the 300ms the old timer would have insisted on.
  await el.click();
  await page.waitForTimeout(60);
  const display = await el.evaluate((node: HTMLElement & { _selectionDropdown?: HTMLElement }) =>
    node._selectionDropdown ? node._selectionDropdown.style.display : '',
  );
  expect(display).toBe('none');
});

// `show`/`hide` fire on the intent, `after-show`/`after-hide` once the panel has
// actually arrived. A consumer that has to clean up after a panel closes needs
// the second pair, and before these existed there was nothing to listen to.
test('select — emits show/after-show and hide/after-hide around the transition', async ({ page }) => {
  await mount(
    page,
    `
    <r-select id="sel" style="width: 200px" defaultValue="lucy" trigger="click">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
    </r-select>
  `,
  );
  const el = page.locator('#sel');
  await page.waitForTimeout(50);

  await el.evaluate((node) => {
    (window as unknown as { seen: string[] }).seen = [];
    for (const name of ['show', 'after-show', 'hide', 'after-hide']) {
      node.addEventListener(name, () => (window as unknown as { seen: string[] }).seen.push(name));
    }
  });

  await el.click();
  await page.waitForTimeout(500);
  await el.click();
  await page.waitForTimeout(500);

  const seen = await page.evaluate(() => (window as unknown as { seen: string[] }).seen);
  expect(seen).toEqual(['show', 'after-show', 'hide', 'after-hide']);
});
