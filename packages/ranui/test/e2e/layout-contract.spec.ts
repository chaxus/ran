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
  await composition(page);
  await page.locator('#title').evaluate((node) => {
    (node as HTMLElement).style.flex = '1 1 0%';
  });
  await expect(page.locator('#title')).toHaveCSS('flex-grow', '1');
  const expanded = await geometry(page, '#title');
  const label = await geometry(page, '#label', 'text');
  expect(() => compactHitZone(expanded.width, label.width, 0)).toThrow(/hug label content/);
  await page.locator('#title').evaluate((node) => node.removeAttribute('style'));
  await composition(page);
  await page.locator('#empty-label').evaluate((node) => {
    (node as HTMLElement).style.paddingInlineStart = '8px';
  });
  await expect(page.locator('#empty-label')).toHaveCSS('padding-left', '8px');
  const shifted = await geometry(page, '#empty-label', 'text');
  expect(() => sameSpine(shifted.left, spine.left)).toThrow(/named spine/);
  await page.locator('#empty-label').evaluate((node) => node.removeAttribute('style'));
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
