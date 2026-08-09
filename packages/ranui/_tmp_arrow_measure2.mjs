import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const RANUI_DIST = '/Users/ranzhouhang/Documents/code/ran/packages/ranui/dist';
const SIZE = process.env.ARROW_SIZE || '';

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  body { margin: 0; padding: 100px; font-family: sans-serif; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); }
  #trigger { display: inline-block; padding: 8px 16px; border: 1px solid #ccc; border-radius: 8px; background: #fff; }
</style>
</head>
<body>
  <r-popover placement="right" trigger="click" id="pop" style="display:inline-block; ${SIZE ? `--ran-dropdown-arrow-width: ${SIZE}px; --ran-dropdown-arrow-height: ${SIZE}px;` : ''}">
    <button id="trigger">trig</button>
    <r-content><div style="padding: 4px 8px;">content</div></r-content>
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

await new Promise((resolve) => server.listen(8838, resolve));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 4 });
page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));
await page.goto('http://localhost:8838/');
await page.click('#trigger');
await page.waitForTimeout(500);

const data = await page.evaluate(() => {
  const pop = document.getElementById('pop');
  const trigger = document.getElementById('trigger');
  const panel = pop.popoverContent;
  const dropdownShadow = panel._shadowDom;
  const arrowEl = dropdownShadow ? dropdownShadow.querySelector('.ranui-dropdown-arrow') : null;
  const svgEl = arrowEl ? arrowEl.querySelector('svg') : null;
  const tRect = trigger.getBoundingClientRect();
  const aRect = arrowEl ? arrowEl.getBoundingClientRect() : null;
  const svgRect = svgEl ? svgEl.getBoundingClientRect() : null;

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
    arrow: aRect ? { top: aRect.top, left: aRect.left, width: aRect.width, height: aRect.height, centerY: aRect.top + aRect.height / 2 } : null,
    svgSize: svgRect ? { width: svgRect.width, height: svgRect.height } : null,
  };
});

console.log(JSON.stringify(data, null, 2));

if (data.arrow) {
  const pad = Math.max(25, data.arrow.width * 0.6);
  await page.screenshot({
    path: `/Users/ranzhouhang/Documents/code/ran/packages/ranui/_tmp_arrow2_${SIZE || 'default'}.png`,
    clip: { x: data.arrow.left - pad, y: data.arrow.top - pad, width: data.arrow.width + pad * 2, height: data.arrow.height + pad * 2 },
  });
}

await browser.close();
server.close();
