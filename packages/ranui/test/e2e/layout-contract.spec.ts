import { expect, test, type Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';
import { compactHitZone, geometry, sameSpine } from './layout-geometry';

// These aliases illustrate a host composition. They are not library size/padding requirements.
async function fixture(page: Page, label = 'Settings', zoom = 1) {
  await isolatedSetup(page, DEV_SERVER, 'r-button');
  await page.evaluate(() => {
    document.body.style.padding = '0';
  });
  await mount(
    page,
    `
    <style>
      body { padding: 0; font-family: Arial, sans-serif; }
      .surface { margin: 0; max-width: none; --app-inset: var(--ran-space-4); --app-target: var(--ran-size-7);
        padding: var(--app-inset); zoom: ${zoom}; color: var(--ran-color-text); background: var(--ran-color-bg); }
      .header { display: flex; align-items: center; gap: var(--ran-space-2); }
      button { font: inherit; color: inherit; background: transparent; border: 0;
        min-height: var(--app-target); cursor: pointer; }
      #title { flex: 0 1 auto; min-width: 0; padding: 0; text-align: start; overflow-wrap: anywhere; }
      #label { display: inline-block; max-width: 100%; }
      #title:hover, #title:focus-visible { background: var(--ran-color-bg-hover); }
      #filler { flex: 1; min-width: var(--ran-space-4); align-self: stretch; }
      #back { width: var(--app-target); flex-shrink: 0; padding: 0; }
      #back svg { width: var(--ran-size-1); height: var(--ran-size-1); vertical-align: middle; }
      .subpage { display: grid; grid-template-columns: var(--app-target) minmax(0, 1fr); gap: var(--ran-space-2); align-items: center; }
      h2, p { margin: 0; padding: 0; }
      #fields { padding-block: var(--ran-space-4); }
      #empty { padding-block: var(--ran-space-8); }
      r-button { --ran-btn-padding: var(--ran-space-2) var(--ran-space-4); }
      @media (pointer: coarse) { .surface { --app-target: var(--ran-space-10); } }
    </style>
    <main class="surface">
      <header class="header"><button id="title"><span id="label">${label}</span></button><div id="filler"></div><button id="close" aria-label="Close">×</button></header>
      <p id="intro">Manage your workspace</p>
      <section id="fields"><p id="field-label">Connection</p></section>
      <section id="empty"><p id="empty-label">No accounts connected</p></section>
      <div class="subpage"><button id="back" aria-label="Back"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3-5 5 5 5" fill="none" stroke="currentColor" /></svg></button><h2 id="subheading">Account details</h2></div>
      <r-button id="component" effect="false"><span id="component-label">Connect account</span></r-button>
    </main>`,
  );
}

async function composition(page: Page) {
  const intro = await geometry(page, '#intro', 'text');
  const surface = await geometry(page, '.surface');
  const inset = await page.locator('.surface').evaluate((node) => {
    const style = getComputedStyle(node);
    return parseFloat(style.getPropertyValue('--app-inset')) * parseFloat(style.zoom);
  });
  // Independent baseline: shared siblings alone would miss every region drifting together.
  sameSpine(intro.left, surface.left + inset);
  for (const selector of ['#label', '#field-label', '#empty-label']) {
    sameSpine((await geometry(page, selector, 'text')).left, intro.left);
  }
  const hit = await geometry(page, '#title');
  // Wrapped text can leave a fractional line-end gap; bound the hit zone by its content box.
  // Alignment still uses the actual text Range above.
  compactHitZone(hit.width, (await geometry(page, '#label')).width, 0);
  const navigation = await geometry(page, '#back');
  const heading = await geometry(page, '#subheading', 'text');
  const columns = await page.locator('.surface').evaluate((node) => {
    const style = getComputedStyle(node);
    const scale = parseFloat(style.zoom);
    return {
      target: parseFloat(style.getPropertyValue('--app-target')) * scale,
      gap: parseFloat(style.getPropertyValue('--ran-space-2')) * scale,
    };
  });
  sameSpine(navigation.width, columns.target);
  sameSpine(heading.left, intro.left + columns.target + columns.gap); // intentional title column
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const variant of [
  { width: 360, theme: 'light' as const, zoom: 1, label: 'Settings' },
  { width: 1100, theme: 'dark' as const, zoom: 1, label: '工作区设置与账户连接' },
  {
    width: 360,
    theme: 'dark' as const,
    zoom: 1.25,
    label: 'Arbeitsbereichseinstellungen und Kontoverbindungen verwalten',
  },
]) {
  test(`composition at ${variant.width}px, ${variant.theme}, CSS zoom ${variant.zoom}`, async ({ page }) => {
    await page.setViewportSize({ width: variant.width, height: 900 });
    await page.emulateMedia({ colorScheme: variant.theme });
    await fixture(page, variant.label, variant.zoom);
    await composition(page);
    await page.setViewportSize({ width: variant.width === 360 ? 1100 : 360, height: 900 });
    await composition(page);
  });
}

test('reverse checks reject text-only drift, filler-sized hit zones and sibling drift', async ({ page }) => {
  await fixture(page);
  await composition(page);
  const frame = await geometry(page, '#title');
  await page.locator('#label').evaluate((node) => {
    (node as HTMLElement).style.transform = 'translateX(8px)';
  });
  await expect(page.locator('#label')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 8, 0)');
  expect(await geometry(page, '#title')).toEqual(frame);
  const drift = await geometry(page, '#label', 'text');
  const spine = await geometry(page, '#intro', 'text');
  expect(() => sameSpine(drift.left, spine.left)).toThrow(/named spine/);
  await page.locator('#label').evaluate((node) => node.removeAttribute('style'));
  await expect(page.locator('#label')).toHaveCSS('transform', 'none');
  await composition(page);
  await page.locator('#title').evaluate((node) => {
    (node as HTMLElement).style.flex = '1 1 0%';
  });
  await expect(page.locator('#title')).toHaveCSS('flex-grow', '1');
  const expanded = await geometry(page, '#title');
  const label = await geometry(page, '#label', 'text');
  expect(() => compactHitZone(expanded.width, label.width, 0)).toThrow(/hug label content/);
  await page.locator('#title').evaluate((node) => node.removeAttribute('style'));
  await expect(page.locator('#title')).toHaveCSS('flex-grow', '0');
  await composition(page);
  await page.locator('#empty-label').evaluate((node) => {
    (node as HTMLElement).style.paddingInlineStart = '8px';
  });
  await expect(page.locator('#empty-label')).toHaveCSS('padding-left', '8px');
  const shifted = await geometry(page, '#empty-label', 'text');
  expect(() => sameSpine(shifted.left, spine.left)).toThrow(/named spine/);
  await page.locator('#empty-label').evaluate((node) => node.removeAttribute('style'));
  await expect(page.locator('#empty-label')).toHaveCSS('padding-left', '0px');
  await composition(page);
});

test('shadow content inset, icon viewport and actual hit surface are measured separately', async ({ page }) => {
  await fixture(page);
  const label = await geometry(page, '#component-label', 'text');
  const host = await geometry(page, '#component');
  const part = await insideShadow(page, '#component', (root) => {
    const target = root.querySelector<HTMLElement>('[part="button"]')!;
    const content = root.querySelector<HTMLElement>('[part="content"]')!;
    const rect = content.getBoundingClientRect();
    const style = getComputedStyle(content);
    return {
      left: rect.left,
      contentLeft: rect.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft),
      hitWidth: target.getBoundingClientRect().width,
    };
  });
  sameSpine(label.left, part.contentLeft);
  expect(label.left).toBeGreaterThan(host.left);
  expect(part.hitWidth).toBeGreaterThan(label.width);
  expect((await geometry(page, '#back svg')).width).toBeLessThan((await geometry(page, '#back')).width);
  await page.locator('#title').evaluate((node) => {
    node.addEventListener('click', () => node.setAttribute('data-clicked', 'true'));
  });
  const title = await geometry(page, '#title');
  await page.mouse.click(title.left + 1, title.top + title.height / 2);
  await expect(page.locator('#title')).toHaveAttribute('data-clicked', 'true');
  await page.locator('#title').evaluate((node) => node.removeAttribute('data-clicked'));
  const filler = await geometry(page, '#filler');
  await page.mouse.click(filler.left + filler.width / 2, filler.top + filler.height / 2);
  await expect(page.locator('#title')).not.toHaveAttribute('data-clicked');
  await page.locator('#title').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#title')).toHaveAttribute('data-clicked', 'true');
});

test('missing and empty text targets fail instead of silently accepting zero geometry', async ({ page }) => {
  await fixture(page);
  await expect(geometry(page, '#missing')).rejects.toThrow(/Missing geometry target/);
  await expect(geometry(page, '#filler', 'text')).rejects.toThrow(/Empty geometry target/);
});

// Vertical relationships are host composition too; these are not component defaults.
async function verticalFixture(page: Page) {
  await isolatedSetup(page, DEV_SERVER, 'r-button');
  await page.evaluate(() => {
    document.body.style.cssText = 'margin: 0; padding: 0; background: var(--ran-color-bg);';
  });
  await mount(
    page,
    `<style>
      body { margin: 0; padding: 0; background: var(--ran-color-bg); }
      .vertical-surface { box-sizing: border-box; width: 100%; max-width: 432px; margin: 0;
        padding: var(--ran-space-4); font-family: var(--ran-font-family);
        color: var(--ran-color-text); background: var(--ran-color-bg);
        display: flex; flex-direction: column; gap: var(--ran-space-6); }
      .vertical-flow { display: flex; flex-direction: column; align-items: stretch; gap: var(--ran-space-4); }
      .vertical-group { display: flex; flex-direction: column; gap: var(--ran-space-2); }
      .vertical-surface :is(h2, h3, p, section) { margin: 0; padding: 0; }
      .vertical-surface h2 { font-size: var(--ran-text-heading-4); line-height: 1.3; }
      .vertical-surface :is(p, label) { font-size: var(--ran-text-label-2); line-height: var(--ran-line-height); }
      .vertical-surface :is(input, textarea) { box-sizing: border-box; width: 100%; min-width: 0;
        min-height: var(--ran-size-7); padding: var(--ran-space-1) var(--ran-space-2);
        border: 1px solid var(--ran-color-border); border-radius: var(--ran-radius-sm);
        font: inherit; color: inherit; background: var(--ran-color-bg); }
      #vertical-copy { display: block; }
      .vertical-surface [hidden] { display: none; }
    </style>
    <main class="vertical-surface">
      <div class="vertical-flow" id="vertical-flow">
        <header class="vertical-group" id="vertical-heading">
          <h2 id="vertical-title">Connection settings / 接続設定</h2>
          <p id="vertical-description"><span id="vertical-copy">Choose the account used for this workspace. A longer translated description can wrap naturally without reserving the same number of lines in every view.</span></p>
        </header>
        <div class="vertical-group" id="vertical-field">
          <label id="vertical-label" for="vertical-input">Account name</label>
          <input id="vertical-input" value="Workspace account">
          <p id="vertical-hint">Stored on this device</p>
        </div>
        <div class="vertical-group" id="vertical-notes">
          <label for="vertical-textarea">Notes</label>
          <textarea id="vertical-textarea" rows="2"></textarea>
          <p id="vertical-error" role="status" hidden></p>
        </div>
        <r-button id="vertical-save" effect="false">Connect account</r-button>
      </div>
      <section id="vertical-section"><h3>Advanced settings</h3></section>
    </main>`,
  );
}

function declaredVerticalGap(actual: number, expected: number) {
  expect(Math.abs(actual - expected), 'vertical gap must match its declared relationship').toBeLessThanOrEqual(0.5);
}

async function verticalGap(page: Page, before: string, after: string, expected: number) {
  const previous = await geometry(page, before);
  const next = await geometry(page, after);
  declaredVerticalGap(next.top - previous.bottom, expected);
}

async function verticalComposition(page: Page, errorVisible = false) {
  const error = page.locator('#vertical-error');
  expect(await error.isVisible(), 'helper visibility must match the declared state').toBe(errorVisible);
  if (errorVisible) expect((await error.textContent())?.trim(), 'a visible error needs its message').toBeTruthy();
  const surface = await geometry(page, '.vertical-surface');
  const title = await geometry(page, '#vertical-title');
  declaredVerticalGap(title.top - surface.top, 16);
  for (const [before, after, gap] of [
    ['#vertical-title', '#vertical-description', 8],
    ['#vertical-heading', '#vertical-field', 16],
    ['#vertical-label', '#vertical-input', 8],
    ['#vertical-input', '#vertical-hint', 8],
    ['#vertical-field', '#vertical-notes', 16],
    ['#vertical-notes', '#vertical-save', 16],
    ['#vertical-flow', '#vertical-section', 24],
  ] as const)
    await verticalGap(page, before, after, gap);
  const notes = await geometry(page, '#vertical-notes');
  const last = await geometry(page, errorVisible ? '#vertical-error' : '#vertical-textarea');
  // A hidden hint must not leave a phantom row, margin or flex gap after the control.
  declaredVerticalGap(notes.bottom - last.bottom, 0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const variant of [
  { width: 320, theme: 'light' as const },
  { width: 1100, theme: 'dark' as const },
]) {
  test(`vertical rhythm survives wrapping, resizing and helper visibility at ${variant.width}px, ${variant.theme}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width: variant.width, height: 1000 });
    await page.emulateMedia({ colorScheme: variant.theme });
    await page.addInitScript((theme) => localStorage.setItem('ran-theme', theme), variant.theme);
    await verticalFixture(page);
    await expect(page.locator('html')).toHaveAttribute('data-ran-theme', variant.theme);
    await verticalComposition(page);
    await page.locator('.vertical-surface').screenshot({ path: info.outputPath('vertical-rhythm.png') });
    const copyHeight = (await geometry(page, '#vertical-description')).height;
    await page.setViewportSize({ width: variant.width === 320 ? 1100 : 320, height: 1000 });
    await verticalComposition(page);
    const resizedHeight = (await geometry(page, '#vertical-description')).height;
    expect(variant.width === 320 ? copyHeight > resizedHeight : copyHeight < resizedHeight).toBe(true);
    await page.locator('#vertical-error').evaluate((node) => {
      node.textContent = 'A longer validation message grows with its content instead of leaving a fixed empty row.';
      (node as HTMLElement).hidden = false;
    });
    await verticalGap(page, '#vertical-textarea', '#vertical-error', 8);
    await verticalComposition(page, true);
    await page.locator('#vertical-error').evaluate((node) => ((node as HTMLElement).hidden = true));
    await verticalComposition(page);
  });
}

test('vertical reverse checks reject doubled margins, phantom helper space and text-only drift', async ({ page }) => {
  await verticalFixture(page);
  await verticalComposition(page);
  const title = await geometry(page, '#vertical-title');
  await page.locator('#vertical-description').evaluate((node) => {
    (node as HTMLElement).style.marginBlockStart = '8px';
  });
  await expect(page.locator('#vertical-description')).toHaveCSS('margin-top', '8px');
  expect(await geometry(page, '#vertical-title')).toEqual(title);
  await expect(verticalGap(page, '#vertical-title', '#vertical-description', 8)).rejects.toThrow(/vertical gap/);
  await page.locator('#vertical-description').evaluate((node) => node.removeAttribute('style'));
  await verticalComposition(page);

  await page.locator('#vertical-error').evaluate((node) => {
    (node as HTMLElement).hidden = false;
    (node as HTMLElement).style.minHeight = '24px';
  });
  // The empty node now reserves a row, even though it has no text.
  expect((await geometry(page, '#vertical-error')).height).toBe(24);
  await expect(verticalComposition(page)).rejects.toThrow(/helper visibility/);
  await page.locator('#vertical-error').evaluate((node) => {
    (node as HTMLElement).hidden = true;
    node.removeAttribute('style');
  });
  await verticalComposition(page);

  const frame = await geometry(page, '#vertical-description');
  const text = await geometry(page, '#vertical-copy', 'text');
  await page.locator('#vertical-copy').evaluate((node) => {
    (node as HTMLElement).style.transform = 'translateY(8px)';
  });
  await expect(page.locator('#vertical-copy')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 8)');
  expect(await geometry(page, '#vertical-description')).toEqual(frame);
  // Frame relationships still pass; the Range must reject the separate visible-text defect.
  await verticalComposition(page);
  const shifted = await geometry(page, '#vertical-copy', 'text');
  expect(() => declaredVerticalGap(shifted.top - text.top, 0)).toThrow(/vertical gap/);
  await page.locator('#vertical-copy').evaluate((node) => node.removeAttribute('style'));
  await expect(page.locator('#vertical-copy')).toHaveCSS('transform', 'none');
  declaredVerticalGap((await geometry(page, '#vertical-copy', 'text')).top - text.top, 0);
  await verticalComposition(page);
});
