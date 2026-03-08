import { JSDOM } from 'jsdom';
const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><body><div id="app"></div></body></html>`);
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.customElements = dom.window.customElements;
global.MouseEvent = dom.window.MouseEvent;
global.ShadowRoot = dom.window.ShadowRoot;

// Simulate ShadowRoot.prototype.attachShadow mock if needed, but jsdom supports it.

import('./components/progress/index.ts').then((mod) => {
  const el = document.createElement('r-progress');
  el.setAttribute('type', 'drag');
  el.setAttribute('percent', '30');
  el.setAttribute('total', '100');
  document.body.appendChild(el);
  
  const innerProgress = el._shadowDom.querySelector('.ran-progress');
  
  // mock offsetWidth
  Object.defineProperty(innerProgress, 'offsetWidth', { value: 100 });
  innerProgress.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 10 });
  
  const clickEvent = new MouseEvent('click', { clientX: 50 });
  innerProgress.dispatchEvent(clickEvent);
  
  console.log('Percent after click:', el.percent);
  console.log('Dot transform after click:', el._shadowDom.querySelector('.ran-progress-dot').style.transform);
});
