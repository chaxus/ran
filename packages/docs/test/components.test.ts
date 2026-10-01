// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { renderGlassPlayground, renderHome, renderIconGallery, renderLoadingGallery } from '../build/components';
import { LOCALES, localeHref } from '../build/langs/locales';
import { homeCopy } from '../build/langs/home-copy';
import { readPackageFacts, renderPackageFacts } from '../build/package-facts';

const documentFor = (html: string): Document => {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = html;
  return doc;
};

describe('static documentation components', () => {
  it.each(LOCALES)('keeps localized live examples and their displayed source in agreement ($id)', (locale) => {
    const doc = documentFor(renderHome(locale));
    const copy = homeCopy(locale.dir);
    expect(doc.querySelector('.btn-primary')?.getAttribute('href')).toBe(localeHref('/src/ranui/', locale));
    expect(Array.from(doc.querySelectorAll('.live-body r-button'), (button) => button.textContent)).toEqual(
      copy.liveButtons,
    );
    expect(doc.querySelector('.live-code')?.textContent).toBe(
      [
        `<r-button type="primary">${copy.liveButtons[0]}</r-button>`,
        `<r-button>${copy.liveButtons[1]}</r-button>`,
        `<r-button type="warning">${copy.liveButtons[2]}</r-button>`,
        '',
        '<r-progress percent="66"></r-progress>',
        '',
        '<r-loading name="circle-line"></r-loading>',
        `<r-checkbox checked>${copy.liveCheck}</r-checkbox>`,
      ].join('\n'),
    );
    expect(doc.querySelector('.live-body r-checkbox')?.getAttribute('checked')).toBe('true');
    expect(doc.querySelector('.cmd code')?.textContent).toBe('npm\u00a0i\u00a0ranui\u00a0ranuts');
    for (const svg of doc.querySelectorAll('svg')) {
      expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
      for (const child of svg.children) expect(child.namespaceURI).toBe(svg.namespaceURI);
    }
  });

  it('renders glass sliders with the same defaults as the element and copyable source', () => {
    const doc = documentFor(renderGlassPlayground(LOCALES[0]));
    const glass = doc.querySelector('r-glass')!;
    for (const input of doc.querySelectorAll<HTMLInputElement>('input[data-param]')) {
      const key = input.dataset.param!;
      expect(input.value).toBe(key === 'width' ? '300' : glass.getAttribute(key));
      expect(input.nextElementSibling?.textContent).toBe(`${input.value}${input.dataset.unit}`);
    }
    expect(doc.querySelector('.gp-code code')?.textContent).toBe(
      '<r-glass blur="16" saturate="180" displace="8" radius="24">\n  …\n</r-glass>',
    );
    expect(doc.querySelector('[data-glass] [data-reset]')).not.toBeNull();
    expect(doc.querySelector('[data-copy-code]')).not.toBeNull();
  });

  it('renders gallery names with matching interaction hooks and custom elements', () => {
    const icons = documentFor(renderIconGallery(LOCALES[0]));
    expect(icons.querySelectorAll('.icon-cell')).toHaveLength(20);
    for (const button of icons.querySelectorAll<HTMLButtonElement>('.icon-cell')) {
      expect(button.type).toBe('button');
      expect(button.querySelector('r-icon')?.getAttribute('name')).toBe(button.dataset.icon);
      expect(button.querySelector('.icon-cell__name')?.textContent).toBe(button.dataset.icon);
    }
    const loading = documentFor(renderLoadingGallery());
    expect(loading.querySelectorAll('.loading-cell')).toHaveLength(29);
    for (const cell of loading.querySelectorAll('.loading-cell')) {
      expect(cell.querySelector('r-loading')?.getAttribute('name')).toBe(
        cell.querySelector('.loading-cell__name')?.textContent,
      );
    }
  });

  it('renders only proven package facts with their package destinations', () => {
    const facts = readPackageFacts('ranui');
    const doc = documentFor(renderPackageFacts('package="ranui"'));
    const links = doc.querySelectorAll('a');
    expect(links[0].getAttribute('href')).toBe(facts.npm);
    expect(links[0].textContent).toBe(`v${facts.version}`);
    expect(links[1].getAttribute('href')).toBe(facts.source);
    expect(links[1].textContent).toBe('packages/ranui');
    expect(Array.from(doc.querySelectorAll('.pkg-facts__item'), (item) => item.textContent)).toEqual([
      `v${facts.version}`,
      ...(facts.license ? [facts.license] : []),
      ...(facts.formats.length ? [facts.formats.join(' · ')] : []),
      'packages/ranui',
    ]);
    expect(() => renderPackageFacts('')).toThrow('needs a package');
  });
});
