import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://localhost:8899/src/ranui/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(500);

const info = await page.evaluate(() => {
  const btn = document.querySelector('.product-switcher-btn');
  const switcher = document.querySelector('.product-switcher');
  const anchor = document.querySelector('a.title');
  const titleDiv = document.querySelector('.VPNavBarTitle') || document.querySelector('.title')?.parentElement;
  const rect = (el) => el ? (({top, left, right, bottom, width, height}) => ({top, left, right, bottom, width, height}))(el.getBoundingClientRect()) : null;
  const style = (el, props) => el ? Object.fromEntries(props.map(p => [p, getComputedStyle(el)[p]])) : null;
  const chain = [];
  let n = switcher;
  while (n) { chain.push({tag: n.tagName, cls: n.className, id: n.id}); n = n.parentElement; if (chain.length > 8) break; }
  return {
    btnRect: rect(btn),
    switcherRect: rect(switcher),
    anchorRect: rect(anchor),
    switcherStyle: style(switcher, ['position','left','top','zIndex','transform']),
    anchorStyle: style(anchor, ['position','zIndex','width']),
    switcherInlineStyle: switcher?.getAttribute('style'),
    chain,
    elementAtBtnCenter: (() => {
      const r = btn.getBoundingClientRect();
      const el = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
      return el ? el.outerHTML.slice(0, 150) : null;
    })(),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
