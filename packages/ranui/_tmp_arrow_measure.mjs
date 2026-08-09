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
  <r-popover placement="right" trigger="click" id="pop">
    <button id="trigger">right</button>
    <r-content>right</r-content>
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
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));
await page.goto('http://localhost:8837/');
await page.click('#trigger');
await page.waitForTimeout(500);

const data = await page.evaluate(() => {
  const pop = document.getElementById('pop');
  const trigger = document.getElementById('trigger');
  const panel = pop.popoverContent;
  const arrow = panel.shadowRoot?.querySelector('.ranui-dropdown-arrow') ?? panel.querySelector?.('.ranui-dropdown-arrow');
  // r-dropdown's shadow root holds the arrow; walk into it.
  const dropdownShadow = panel.shadowRoot;
  const arrowEl = dropdownShadow ? dropdownShadow.querySelector('.ranui-dropdown-arrow') : null;
  const tRect = trigger.getBoundingClientRect();
  const pRect = panel.getBoundingClientRect();
  const aRect = arrowEl ? arrowEl.getBoundingClientRect() : null;
  const cs = arrowEl ? getComputedStyle(arrowEl) : null;
  return {
    trigger: { top: tRect.top, height: tRect.height, centerY: tRect.top + tRect.height / 2 },
    panel: { top: pRect.top, height: pRect.height },
    arrow: aRect ? { top: aRect.top, height: aRect.height, centerY: aRect.top + aRect.height / 2, transform: cs.transform } : null,
    cssVars: {
      anchorHeight: panel.style.getPropertyValue('--ran-dropdown-arrow-anchor-height'),
      offsetY: panel.style.getPropertyValue('--ran-dropdown-arrow-anchor-offset-y'),
    },
    arrowAttr: panel.getAttribute('arrow'),
  };
});

console.log(JSON.stringify(data, null, 2));

await browser.close();
server.close();
