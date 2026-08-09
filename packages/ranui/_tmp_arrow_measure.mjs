import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const RANUI_DIST = '/Users/ranzhouhang/Documents/code/ran/packages/ranui/dist';

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  body { margin: 0; padding: 100px; font-family: sans-serif; }
  #trigger { display: inline-block; padding: 8px 16px; border: 1px solid #ccc; border-radius: 8px; }
</style>
</head>
<body>
  <r-popover placement="right" trigger="click" id="pop" style="display:inline-block;">
    <button id="trigger">right</button>
    <r-content><div style="padding: 4px 8px;">right</div></r-content>
  </r-popover>
  <script type="module" src="/popover.js"></script>
  <script type="module" src="/content.js"></script>
  <script type="module" src="/dropdown.js"></script>
</body></html>`;

const server = createServer(async (req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
    return;
  }
  try {
    const filePath = path.join(RANUI_DIST, req.url.split('?')[0]);
    const data = await readFile(filePath);
    res.setHeader('Content-Type', 'application/javascript');
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end('not found');
  }
});

await new Promise((resolve) => server.listen(8837, resolve));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 4 });
page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));
await page.goto('http://localhost:8837/');
await page.click('#trigger');
await page.waitForTimeout(500);

const EXTRA_OFFSET = process.env.EXTRA_OFFSET ? Number(process.env.EXTRA_OFFSET) : 0;
if (EXTRA_OFFSET) {
  await page.evaluate((v) => {
    const pop = document.getElementById('pop');
    const current = parseFloat(pop.popoverContent.style.getPropertyValue('--ran-dropdown-arrow-anchor-offset-y')) || 0;
    pop.popoverContent.style.setProperty('--ran-dropdown-arrow-anchor-offset-y', `${current + v}px`);
  }, EXTRA_OFFSET);
}

const data = await page.evaluate(() => {
  const pop = document.getElementById('pop');
  const trigger = document.getElementById('trigger');
  const panel = pop.popoverContent;
  // Shadow roots are closed (ranui convention) — `.shadowRoot` is null from
  // outside; the component stashes the real one on `_shadowDom` instead.
  const dropdownShadow = panel._shadowDom;
  const arrowEl = dropdownShadow ? dropdownShadow.querySelector('.ranui-dropdown-arrow') : null;
  const containerEl = dropdownShadow ? dropdownShadow.querySelector('.ranui-dropdown-container') : null;
  const cRect = containerEl ? containerEl.getBoundingClientRect() : null;
  const tRect = trigger.getBoundingClientRect();
  const pRect = panel.getBoundingClientRect();
  const aRect = arrowEl ? arrowEl.getBoundingClientRect() : null;
  const cs = arrowEl ? getComputedStyle(arrowEl) : null;
  // Draw a red line across the viewport at the trigger's true center, and a
  // blue box around the arrow's own bounding rect, so the screenshot shows
  // both references without guessing pixel coords by eye.
  const marker = document.createElement('div');
  marker.style.cssText = `position:fixed; left:0; top:${tRect.top + tRect.height / 2}px; width:100vw; height:1px; background:red; z-index:99999;`;
  document.body.appendChild(marker);
  if (aRect) {
    const box = document.createElement('div');
    box.style.cssText = `position:fixed; left:${aRect.left}px; top:${aRect.top}px; width:${aRect.width}px; height:${aRect.height}px; outline:2px solid blue; z-index:99999;`;
    document.body.appendChild(box);
  }
  return {
    trigger: { top: tRect.top, height: tRect.height, centerY: tRect.top + tRect.height / 2 },
    panel: { top: pRect.top, height: pRect.height },
    container: cRect ? { top: cRect.top, height: cRect.height } : null,
    arrow: aRect
      ? { top: aRect.top, left: aRect.left, height: aRect.height, width: aRect.width, centerY: aRect.top + aRect.height / 2, transform: cs.transform }
      : null,
    cssVars: {
      anchorHeight: panel.style.getPropertyValue('--ran-dropdown-arrow-anchor-height'),
      offsetY: panel.style.getPropertyValue('--ran-dropdown-arrow-anchor-offset-y'),
    },
    arrowAttr: panel.getAttribute('arrow'),
  };
});

console.log(JSON.stringify(data, null, 2));

await page.screenshot({ path: '/Users/ranzhouhang/Documents/code/ran/packages/ranui/_tmp_arrow_shot.png', clip: { x: 40, y: 60, width: 260, height: 150 } });
if (data.arrow) {
  const pad = 25;
  await page.screenshot({
    path: '/Users/ranzhouhang/Documents/code/ran/packages/ranui/_tmp_arrow_zoom.png',
    clip: { x: data.arrow.left - pad, y: data.arrow.top - pad, width: data.arrow.width + pad * 2, height: data.arrow.height + pad * 2 },
  });
}

await browser.close();
server.close();
