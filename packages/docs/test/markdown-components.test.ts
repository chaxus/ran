// @vitest-environment jsdom
import { beforeAll, expect, it } from 'vitest';
import { markdown } from '../build/build';

beforeAll(async () => {
  await markdown.init();
});
const render = (source: string): HTMLElement => {
  const body = document.createElement('div');
  body.innerHTML = markdown.render(source).html;
  return body;
};

it('treats callout titles as text while preserving rendered markdown bodies', () => {
  const body = render('::: warning <img src=x onerror=alert(1)> & "quoted"\n**Read this** & that\n:::');
  expect(body.querySelector('aside')?.className).toBe('callout callout--warning');
  expect(body.querySelector('.callout__label')?.textContent).toBe('<img src=x onerror=alert(1)> & "quoted"');
  expect(body.querySelector('img')).toBeNull();
  expect(body.querySelector('strong')?.textContent).toBe('Read this');
  expect(render('::: note\nbody\n:::').querySelector('.callout__label')?.textContent).toBe('NOTE');
});

it('escapes code group labels and retains highlighted code with hidden interaction tabs', () => {
  const body = render(
    '::: code-group\n```js [<img src=x> & "quoted"]\nconst value = "<tag>";\n```\n```html\n<r-button>Save</r-button>\n```\n:::',
  );
  const tabs = body.querySelectorAll<HTMLButtonElement>('.code-group__tab');
  expect(tabs).toHaveLength(2);
  expect(tabs[0].textContent).toBe('<img src=x> & "quoted"');
  expect(tabs[0].hidden).toBe(true);
  expect(tabs[0].dataset.index).toBe('0');
  expect(body.querySelector('img')).toBeNull();
  expect(body.querySelector('.code-group__fallback')?.textContent).toBe(tabs[0].textContent);
  expect(body.querySelector('.code-group__pane code')?.textContent).toBe('const value = "<tag>";');
  expect(body.querySelectorAll('.code-group__pane pre')).toHaveLength(2);
});

it('round trips mermaid source through its encoded attribute', () => {
  const code = 'graph TD\nA["<tag> & quoted"] --> B';
  const body = render(`\`\`\`mermaid\n${code}\n\`\`\``);
  const element = body.querySelector('r-mermaid')!;
  expect(decodeURIComponent(element.getAttribute('code')!)).toBe(code);
  expect(element.children).toHaveLength(0);
});
