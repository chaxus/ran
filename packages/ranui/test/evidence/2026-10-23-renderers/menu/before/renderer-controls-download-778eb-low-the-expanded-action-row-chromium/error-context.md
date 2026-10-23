# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: renderer-controls.spec.ts >> download menu after wrapped copy failure (touch) >> math anchors its download menu below the expanded action row
- Location: test/e2e/renderer-controls.spec.ts:353:7

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 7.5
Received:    -45.5
```

# Test source

```ts
  279 |   });
  280 | }
  281 | 
  282 | test('mermaid hides its temporary document measurement tree without suppressing final SVG geometry', async ({
  283 |   page,
  284 | }) => {
  285 |   await page.setViewportSize({ width: 360, height: 900 });
  286 |   await isolatedSetup(page, DEV_SERVER, 'r-mermaid');
  287 |   await mount(page, '<r-mermaid id="renderer"></r-mermaid>');
  288 |   const result = await page.evaluate(async () => {
  289 |     const host = document.getElementById('renderer') as any;
  290 |     const visibility: string[] = [];
  291 |     const sample = () => {
  292 |       for (const node of document.querySelectorAll<HTMLElement>('[id^="dran-mermaid-"]')) {
  293 |         visibility.push(getComputedStyle(node).visibility);
  294 |         const svg = node.querySelector('svg');
  295 |         if (svg) visibility.push(getComputedStyle(svg).visibility);
  296 |       }
  297 |     };
  298 |     const observer = new MutationObserver(sample);
  299 |     observer.observe(document.body, { childList: true, subtree: true });
  300 |     const rendered = new Promise<void>((resolve) => host.addEventListener('render', () => resolve(), { once: true }));
  301 |     host.code = 'graph LR; A[Review]-->B[Complete];';
  302 |     await rendered;
  303 |     observer.disconnect();
  304 |     const svg = host._shadowDom.querySelector('svg') as SVGSVGElement;
  305 |     const scene = svg.querySelector('.root') as SVGGraphicsElement;
  306 |     return {
  307 |       visibility,
  308 |       finalVisibility: getComputedStyle(svg).visibility,
  309 |       viewportWidth: svg.viewBox.baseVal.width,
  310 |       contentWidth: scene.getBBox().width,
  311 |     };
  312 |   });
  313 |   expect(result.visibility.length).toBeGreaterThan(0);
  314 |   expect(result.visibility.every((value) => value === 'hidden')).toBe(true);
  315 |   expect(result.finalVisibility).toBe('visible');
  316 |   expect(result.contentWidth).toBeGreaterThan(0);
  317 |   expect(result.viewportWidth - result.contentWidth).toBeLessThanOrEqual(32);
  318 | });
  319 | 
  320 | test('mermaid fits its graph after host reduced-motion CSS affects the temporary render container', async ({
  321 |   page,
  322 | }) => {
  323 |   await page.setViewportSize({ width: 360, height: 900 });
  324 |   await page.emulateMedia({ reducedMotion: 'reduce' });
  325 |   await isolatedSetup(page, DEV_SERVER, 'r-mermaid');
  326 |   // Reproduce the host demo's actual reduced-motion rule rather than the
  327 |   // harness's faster global transition freeze. The SVG measurement is in body.
  328 |   await page.addStyleTag({
  329 |     content:
  330 |       '@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }',
  331 |   });
  332 |   await mount(page, '<r-mermaid id="renderer"></r-mermaid>');
  333 |   await page.evaluate(() => {
  334 |     (document.getElementById('renderer') as HTMLElement & { code: string }).code =
  335 |       'flowchart TD\n A[Draft proposal] --> B{Review complete?}\n B -->|Yes| C[Publish release]\n B -->|No| D[Resolve findings]\n D --> B';
  336 |   });
  337 |   await expect.poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('svg .root'))).toBe(true);
  338 |   const geometry = await insideShadow(page, '#renderer', (root) => {
  339 |     const svg = root.querySelector('svg')!;
  340 |     const scene = svg.querySelector<SVGGraphicsElement>('.root')!;
  341 |     const bounds = scene.getBBox();
  342 |     return { viewportWidth: svg.viewBox.baseVal.width, contentWidth: bounds.width };
  343 |   });
  344 |   // Mermaid's default diagram padding is 8 px per edge. Allow the surrounding
  345 |   // stroke/rounding space, but never an offscreen measurement canvas in the viewBox.
  346 |   expect(geometry.viewportWidth - geometry.contentWidth).toBeLessThanOrEqual(32);
  347 | });
  348 | 
  349 | for (const touch of [false, true]) {
  350 |   test.describe(`download menu after wrapped copy failure (${touch ? 'touch' : 'fine pointer'})`, () => {
  351 |     test.use({ hasTouch: touch, viewport: { width: 360, height: 900 } });
  352 |     for (const owner of ['math', 'mermaid'] as const) {
  353 |       test(`${owner} anchors its download menu below the expanded action row`, async ({ page }, testInfo) => {
  354 |         await isolatedSetup(page, DEV_SERVER, `r-${owner}`);
  355 |         await mount(page, `<r-${owner} id="renderer" copy download style="width: 320px"></r-${owner}>`);
  356 |         await page.evaluate((owner) => {
  357 |           const host = document.getElementById('renderer') as any;
  358 |           if (owner === 'math') host.latex = 'x^2';
  359 |           else host.code = 'graph LR; A[Draft]-->B[Review];';
  360 |           host.setAttribute('label-copy-error', 'The clipboard permission was denied. Allow clipboard access in your browser settings and try copying this content again. Your content has not changed.');
  361 |           Object.defineProperty(navigator, 'clipboard', {
  362 |             configurable: true,
  363 |             value: { writeText: async () => { throw new Error('denied'); } },
  364 |           });
  365 |         }, owner);
  366 |         await expect.poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('math, svg'))).toBe(true);
  367 |         await insideShadow(page, '#renderer', (root) => (root.querySelector('button') as HTMLButtonElement).click());
  368 |         await expect.poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('[part="copy-status"]'))).toBe(true);
  369 |         await insideShadow(page, '#renderer', (root) => (root.querySelectorAll('button')[1] as HTMLButtonElement).focus());
  370 |         await page.keyboard.press('Enter');
  371 |         await expect.poll(() => insideShadow(page, '#renderer', (root) => !!root.querySelector('[part="menu"]'))).toBe(true);
  372 |         await page.screenshot({ path: testInfo.outputPath('wrapped-error-download.png'), fullPage: true });
  373 |         const geometry = await insideShadow(page, '#renderer', (root) => {
  374 |           const toolbar = root.querySelector('[part="toolbar"]')!.getBoundingClientRect();
  375 |           const menu = root.querySelector('[part="menu"]')!.getBoundingClientRect();
  376 |           return { toolbarHeight: toolbar.height, gap: menu.top - toolbar.bottom };
  377 |         });
  378 |         expect(geometry.toolbarHeight).toBeGreaterThan(touch ? 44 : 32);
> 379 |         expect(geometry.gap).toBeGreaterThanOrEqual(7.5);
      |                              ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  380 |         await page.keyboard.press('Tab');
  381 |         expect(await insideShadow(page, '#renderer', (root) => root.activeElement === root.querySelector('[part="menu"] button'))).toBe(true);
  382 |       });
  383 |     }
  384 |   });
  385 | }
  386 | 
```