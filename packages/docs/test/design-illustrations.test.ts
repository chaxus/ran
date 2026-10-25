// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';
import { LOCALES } from '../build/langs/locales.ts';
import { renderDesignIllustrations, designIllustrationFiles } from '../build/design-illustrations.ts';
import { mountDesignIllustrations } from '../client/design-illustrations.ts';

const source = readFileSync(resolve(import.meta.dirname, '../../ranui/theme/tokens.less'), 'utf8');
const px = (name: string): number => Number(new RegExp(`${name}:\\s*(\\d+)px`).exec(source)![1]);
const rootLocale = LOCALES.find((locale) => !locale.dir)!;
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

it('renders meaningful static schematics using foundation geometry, with no scripts or live component claims', () => {
  document.body.innerHTML = renderDesignIllustrations(rootLocale);
  expect(document.querySelectorAll('figure')).toHaveLength(3);
  expect(document.querySelectorAll('script, r-button, r-input')).toHaveLength(0);
  for (const svg of document.querySelectorAll('svg[role="img"]')) expect(svg.getAttribute('aria-label')).toBeTruthy();
  expect(document.querySelectorAll('button, a, input, [tabindex], [data-reduced-note]')).toHaveLength(0);
  const outer = document.querySelector('[data-radius-outer]')!;
  const inner = document.querySelector('[data-radius-inner]')!;
  expect(Number(outer.getAttribute('rx'))).toBe(px('--ran-radius-lg'));
  expect(Number(inner.getAttribute('rx'))).toBe(px('--ran-radius-md'));
  expect(Number(inner.getAttribute('x')) - Number(outer.getAttribute('x'))).toBe(px('--ran-space-1'));
  expect(Number(inner.getAttribute('x')) + Number(inner.getAttribute('rx'))).toBe(
    Number(outer.getAttribute('x')) + Number(outer.getAttribute('rx')),
  );
  expect(Number(document.querySelector('[data-density-visible]')!.getAttribute('width'))).toBe(px('--ran-size-1'));
  expect(Number(document.querySelector('[data-density-target]')!.getAttribute('width'))).toBe(px('--ran-size-7'));
  const spine = document.querySelector('[data-alignment-spine]')!.getAttribute('x1');
  expect(
    [...document.querySelectorAll('[data-alignment-text]')].every((line) => line.getAttribute('x1') === spine),
  ).toBe(true);
});

it('covers every locale and exports three self-contained themed SVGs per language', () => {
  const files = [...designIllustrationFiles()];
  expect(files).toHaveLength(LOCALES.length * 3);
  for (const locale of LOCALES) {
    document.body.innerHTML = renderDesignIllustrations(locale);
    expect(document.querySelectorAll('figure')).toHaveLength(3);
    expect(document.querySelectorAll('button, a, [tabindex], [data-reduced-note]')).toHaveLength(0);
    expect(document.querySelector('#design-illustrations')).toBeTruthy();
    const ids = new Set<string>();
    for (const figure of document.querySelectorAll('figure')) {
      expect(figure.id).toMatch(/^design-illustration-(alignment|radius|density)$/);
      const heading = figure.querySelector('h3')!;
      expect(heading.id).toBe(`${figure.id}-title`);
      expect(ids.has(heading.id)).toBe(false);
      ids.add(heading.id);
    }
  }
  for (const [name, svg] of files) {
    const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
    expect(parsed.querySelector('parsererror'), name).toBeNull();
    expect(parsed.documentElement.namespaceURI, name).toBe('http://www.w3.org/2000/svg');
    expect(parsed.documentElement.hasAttribute('width'), name).toBe(false);
    expect(parsed.documentElement.hasAttribute('height'), name).toBe(false);
    expect(name).toMatch(/^illustrations\/[\w-]+\/(alignment|radius|density)\.svg$/);
    expect(svg).toContain('prefers-color-scheme: dark');
    expect(svg).toContain('prefers-reduced-motion: reduce');
    expect(svg).toContain('--ran-color-text:');
    expect(svg).not.toMatch(/<script|https?:\/\/(?!www\.w3\.org)/);
    expect(svg).toContain('animation-iteration-count:infinite');
  }
});

const setup = (reduced = false, supported = true) => {
  const motion = new EventTarget() as MediaQueryList;
  Object.defineProperty(motion, 'matches', { value: reduced, writable: true });
  vi.stubGlobal('matchMedia', () => motion);
  const observe = vi.fn();
  const disconnect = vi.fn();
  let notify!: IntersectionObserverCallback;
  const observer = { observe, disconnect } as unknown as IntersectionObserver;
  const createObserver = vi.fn(function (callback: IntersectionObserverCallback) {
    notify = callback;
    return observer;
  });
  vi.stubGlobal('IntersectionObserver', supported ? createObserver : undefined);
  document.body.innerHTML = renderDesignIllustrations(rootLocale);
  const stop = mountDesignIllustrations();
  const figures = [...document.querySelectorAll<HTMLElement>('figure')];
  const canvases = figures.map((figure) => figure.querySelector('.ran-design-canvas')!);
  const enter = (index: number, isIntersecting = true, intersectionRatio = 1) =>
    notify([{ target: canvases[index], isIntersecting, intersectionRatio } as IntersectionObserverEntry], observer);
  return { figures, canvases, motion, stop, enter, observe, disconnect, createObserver };
};
const setReduced = (motion: MediaQueryList, reduced: boolean) => {
  Object.defineProperty(motion, 'matches', { value: reduced });
  motion.dispatchEvent(new Event('change'));
};

it('runs independent instructional loops in view and pauses them outside the viewport', () => {
  const { figures, canvases, enter, observe, createObserver, stop } = setup();
  expect(createObserver).toHaveBeenCalledTimes(1);
  expect(observe.mock.calls.map(([element]) => element)).toEqual(canvases);
  expect(figures.every((figure) => figure.dataset.state !== 'playing')).toBe(true);
  enter(0, false);
  expect(figures[0].dataset.state).toBeUndefined();
  enter(0);
  expect(figures[0].dataset.state).toBe('playing');
  expect(figures[1].dataset.state).toBeUndefined();
  enter(0, false);
  expect(figures[0].dataset.state).toBe('paused');
  enter(1);
  expect(figures[1].dataset.state).toBe('playing');
  expect(figures[2].dataset.state).toBeUndefined();
  enter(0);
  enter(0);
  expect(figures[0].dataset.state).toBe('playing');
  enter(1, false);
  expect(figures[1].dataset.state).toBe('paused');
  stop();
});

it('shows the complete static diagram for reduced motion and follows visibility when restored', () => {
  const { figures, motion, enter, stop } = setup(true);
  enter(0);
  expect(figures[0].dataset.state).toBeUndefined();
  setReduced(motion, false);
  expect(figures[0].dataset.state).toBe('playing');
  enter(1);
  expect(figures[1].dataset.state).toBe('playing');
  setReduced(motion, true);
  expect(figures.every((figure) => figure.dataset.state === undefined)).toBe(true);
  enter(0, false);
  setReduced(motion, false);
  expect(figures[0].dataset.state).toBeUndefined();
  expect(figures[1].dataset.state).toBe('playing');
  expect(figures[2].dataset.state).toBeUndefined();
  stop();
});

it('preserves complete static diagrams when observation is unavailable', () => {
  const { figures, createObserver, stop } = setup(false, false);
  expect(createObserver).not.toHaveBeenCalled();
  expect(figures.every((figure) => figure.dataset.state !== 'playing')).toBe(true);
  expect(document.querySelectorAll('.di-motion')).toHaveLength(4);
  stop();
});

it('does not duplicate observers or steal focus and disposes pending callbacks', () => {
  const { figures, enter, motion, createObserver, disconnect, stop } = setup();
  const focus = document.createElement('button');
  document.body.append(focus);
  focus.focus();
  const secondStop = mountDesignIllustrations();
  expect(createObserver).toHaveBeenCalledTimes(1);
  enter(0);
  secondStop();
  expect(figures[0].dataset.state).toBe('playing');
  setReduced(motion, true);
  setReduced(motion, false);
  expect(document.activeElement).toBe(focus);
  stop();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(figures.every((figure) => figure.dataset.state === undefined)).toBe(true);
  enter(1);
  expect(figures[1].dataset.state).toBeUndefined();
  setReduced(motion, true);
  expect(document.activeElement).toBe(focus);
  const remountStop = mountDesignIllustrations();
  enter(0);
  expect(figures[0].dataset.state).toBeUndefined();
  setReduced(motion, false);
  expect(figures[0].dataset.state).toBe('playing');
  stop();
  expect(figures[0].dataset.state).toBe('playing');
  remountStop();
});

it('keeps instructional geometry constant while revealing guides through the existing easing token', () => {
  for (const [name, content] of designIllustrationFiles()) {
    expect(content, name).toContain('animation-timing-function:var(--ran-motion-ease-standard)');
    expect(content, name).toContain('--ran-motion-ease-standard:cubic-bezier(');
    expect(content, name).not.toMatch(/@keyframes[^}]+(?:rx:|transform:)/);
    const svg = new DOMParser().parseFromString(content, 'image/svg+xml');
    if (name.endsWith('/radius.svg')) {
      expect(svg.querySelector('[data-radius-inner]')!.classList.contains('di-motion')).toBe(false);
      expect(svg.querySelector('[data-radius-guides].di-motion')).toBeTruthy();
    }
  }
  const css = readFileSync(resolve(import.meta.dirname, '../styles/design-illustrations.css'), 'utf8');
  expect(css).not.toMatch(/min-width:\s*320px/);
});

it('keeps captions and geometry aligned with changed source tokens and ignores commented declarations', async () => {
  const { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { execFileSync } = await import('node:child_process');
  const { pathToFileURL } = await import('node:url');
  const dir = mkdtempSync(join(tmpdir(), 'ran-design-illustrations-'));
  try {
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module' }));
    for (const path of ['docs/build/langs', 'ranui/theme']) mkdirSync(join(dir, path), { recursive: true });
    for (const path of [
      'design-illustrations.ts',
      'langs/locales.ts',
      'langs/design-pages.ts',
      'langs/design-illustrations-copy.ts',
    ])
      copyFileSync(resolve(import.meta.dirname, '../build', path), join(dir, 'docs/build', path));
    const modified =
      source
        .replace('--ran-radius-lg: 16px', '--ran-radius-lg: 20px')
        .replace('--ran-radius-md: 12px', '--ran-radius-md: 16px')
        .replace('--ran-size-1: 16px', '--ran-size-1: 18px')
        .replace('--ran-size-7: 32px', '--ran-size-7: 34px') + '\n/* --ran-radius-lg: 99px; */';
    writeFileSync(join(dir, 'ranui/theme/tokens.less'), modified);
    writeFileSync(
      join(dir, 'ranui/theme/dark.less'),
      readFileSync(resolve(import.meta.dirname, '../../ranui/theme/dark.less'), 'utf8') +
        '\n--ran-color-link: var(--ran-blue-900);',
    );
    const script = `import {renderDesignIllustrations,designIllustrationFiles} from ${JSON.stringify(pathToFileURL(join(dir, 'docs/build/design-illustrations.ts')).href)}; import {ROOT_LOCALE} from ${JSON.stringify(pathToFileURL(join(dir, 'docs/build/langs/locales.ts')).href)}; console.log(JSON.stringify([renderDesignIllustrations(ROOT_LOCALE),designIllustrationFiles()[0][1]]));`;
    const [html, standalone] = JSON.parse(
      execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' }),
    );
    document.body.innerHTML = html;
    expect(document.querySelector('[data-radius-outer]')!.getAttribute('rx')).toBe('20');
    expect(document.body.textContent).toContain('20 − 4 = 16');
    expect(document.querySelector('[data-density-visible]')!.getAttribute('width')).toBe('18');
    expect(document.querySelector('[data-density-target]')!.getAttribute('width')).toBe('34');
    expect(document.body.textContent).toContain('18px');
    expect(document.body.textContent).toContain('34px');
    expect(standalone).toContain('--ran-blue-900:#47a8ff;');
    expect(standalone).toContain('font-size:var(--ran-text-label-1)');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
