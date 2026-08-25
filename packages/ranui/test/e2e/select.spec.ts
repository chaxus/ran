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

  const runningAnimations = async () =>
    el.evaluate(async (node: HTMLElement & { open: boolean; _selectionDropdown?: HTMLElement }) => {
      const panel = node._selectionDropdown as HTMLElement & { getAnimationTarget?: () => Element };
      const target = panel.getAnimationTarget?.() ?? panel;
      let peak = 0;
      node.open = true;
      for (let i = 0; i < 8; i++) {
        peak = Math.max(peak, target.getAnimations().length);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      node.open = false;
      return peak;
    });

  // Both halves, because Playwright reports `reduce` by default: asserting only
  // that the reduced case has no animation would pass against a suite that
  // never animates at all, which is exactly what this file did before.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  expect(await runningAnimations()).toBeGreaterThan(0);
  await page.waitForTimeout(600);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await runningAnimations()).toBe(0);

  // And with nothing to wait for, the panel is closed well inside the 300ms the
  // old hardcoded timer would have insisted on.
  await page.waitForTimeout(600);
  await el.evaluate((node: HTMLElement & { open: boolean }) => {
    node.open = true;
  });
  await page.waitForTimeout(100);
  await el.evaluate((node: HTMLElement & { open: boolean }) => {
    node.open = false;
  });
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

// The alignment suffix on r-select, which needs a shape to be visible in at all:
// the panel host tracks the trigger's width, so with a panel the same width as
// its trigger every alignment computes the same position. It only differs once a
// consumer widens the panel past the trigger — and then it also exercises the
// part that made this awkward, that the extra width overflows the panel *host*
// and is invisible to a measurement taken on it. Alignment and flip both have to
// use what is actually painted.
test('select — the placement suffix aligns the panel that is painted, not the host box', async ({ page }) => {
  // Stacked, and kept well clear of both viewport edges: the boundary shift
  // outranks the alignment (as it should — a correctly aligned panel off-screen
  // is worse than a nudged one), so a trigger near an edge measures the clamp
  // instead of what this is about. The first draft put them in a row 120px
  // apart at 600px wide and the centred one came back 15px out, shifted.
  await page.setViewportSize({ width: 1000, height: 600 });
  await mount(
    page,
    `
    <style>r-dropdown.wide::part(dropdown) { min-width: 220px; }</style>
    <div style="padding: 40px 0 40px 420px; display: flex; flex-direction: column; gap: 24px;">
      <r-select id="start" placement="bottom" trigger="click" defaultValue="a" dropdownclass="wide" style="width: 80px">
        <r-option value="a">A</r-option>
      </r-select>
      <r-select id="end" placement="bottom-end" trigger="click" defaultValue="a" dropdownclass="wide" style="width: 80px">
        <r-option value="a">A</r-option>
      </r-select>
      <r-select id="centre" placement="bottom-center" trigger="click" defaultValue="a" dropdownclass="wide" style="width: 80px">
        <r-option value="a">A</r-option>
      </r-select>
    </div>
  `,
  );
  await page.waitForTimeout(50);

  const read = async (id: string) => {
    const el = page.locator(`#${id}`);
    await el.evaluate((node: HTMLElement & { open: boolean }) => {
      node.open = true;
    });
    await page.waitForTimeout(400);
    const box = await el.evaluate((node: HTMLElement & { _selectionDropdown?: HTMLElement }) => {
      const trigger = node.getBoundingClientRect();
      const host = node._selectionDropdown as HTMLElement & { _shadowDom?: ShadowRoot };
      const painted = host._shadowDom?.querySelector('.ranui-dropdown')?.getBoundingClientRect();
      return {
        triggerLeft: trigger.left,
        triggerRight: trigger.right,
        panelLeft: painted?.left ?? 0,
        panelRight: painted?.right ?? 0,
        panelWidth: painted?.width ?? 0,
      };
    });
    await el.evaluate((node: HTMLElement & { open: boolean }) => {
      node.open = false;
    });
    await page.waitForTimeout(400);
    return box;
  };

  const start = await read('start');
  const end = await read('end');
  const centre = await read('centre');

  // The panel really is wider than its trigger, or this proves nothing.
  expect(start.panelWidth).toBeGreaterThan(start.triggerRight - start.triggerLeft);

  expect(Math.abs(start.panelLeft - start.triggerLeft)).toBeLessThanOrEqual(1);
  expect(Math.abs(end.panelRight - end.triggerRight)).toBeLessThanOrEqual(1);
  const centreDelta = (centre.panelLeft + centre.panelRight) / 2 - (centre.triggerLeft + centre.triggerRight) / 2;
  expect(Math.abs(centreDelta)).toBeLessThanOrEqual(1);
});

// The entrance animation, which a refactor switched off entirely while every
// other case kept passing: the panel appeared, correctly placed, with `open`
// and `aria-expanded` right — it just did not slide.
//
// The wait for the animation was looking at the panel host, and r-dropdown runs
// its animations on an element inside its shadow root. `getAnimations()` on the
// host reports nothing, and `{ subtree: true }` does not cross a shadow
// boundary, so the wait concluded there was no animation, declared it finished
// and stripped the class — cancelling the animation a frame after it started.
test('select — the entrance animation actually plays', async ({ page }) => {
  // Playwright reports `prefers-reduced-motion: reduce` by default, and the
  // stylesheet honours that with `animation: none` — so without this the panel
  // correctly has nothing to animate and the case would pass on an empty set,
  // proving nothing.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
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

  const result = await el.evaluate(async (node: HTMLElement & { open: boolean; _selectionDropdown?: HTMLElement }) => {
    const panel = node._selectionDropdown as HTMLElement & { getAnimationTarget?: () => Element };
    // The animation runs inside the panel's shadow root; `getAnimations()` on
    // the host reports nothing, and `{ subtree: true }` does not cross a shadow
    // boundary. The panel says where to look.
    const target = panel.getAnimationTarget?.() ?? panel;
    // Waiting for `animationend`, not just for an animation to appear. Stripping
    // the class mid-flight cancels the animation, which fires `cancel` and never
    // `animationend` — but it does leave a frame or two where one was running,
    // so anything that merely samples for a running animation calls an
    // interrupted entrance a success. That is how the first version of this case
    // passed against the very bug it was written for.
    return new Promise<string | null>((resolve) => {
      target.addEventListener('animationend', (event) => resolve((event as AnimationEvent).animationName), {
        once: true,
      });
      setTimeout(() => resolve(null), 2000);
      node.open = true;
    });
  });

  expect(result).toBe('ranui-dropdown-down-in');

  // And it is cleaned up once finished: the class does not outlive the animation.
  await page.waitForTimeout(600);
  const settled = await el.evaluate((node: HTMLElement & { _selectionDropdown?: HTMLElement }) => {
    const panel = node._selectionDropdown as HTMLElement & { getAnimationTarget?: () => Element };
    const target = panel.getAnimationTarget?.() ?? panel;
    return {
      transit: panel.getAttribute('transit'),
      classes: target.className,
      running: target.getAnimations().length,
    };
  });
  expect(settled.transit).toBeNull();
  expect(settled.running).toBe(0);
  // Both direction classes stacking up was its own bug: r-dropdown removed the
  // class named by whatever `transit` said at the time its timer fired, not the
  // one it had added, so reversing direction inside that window left the first
  // one on forever.
  expect(settled.classes).not.toContain('ran-dropdown-down-in');
  expect(settled.classes).not.toContain('ran-dropdown-down-out');
});
