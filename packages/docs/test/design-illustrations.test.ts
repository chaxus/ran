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
  for (const button of document.querySelectorAll('button')) expect(button.hidden).toBe(true);
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
  expect(document.body.textContent).toContain('separate object');
  expect(document.body.textContent).toContain('host example');
});

it('covers every locale and exports three self-contained themed SVGs per language', () => {
  const files = [...designIllustrationFiles()];
  expect(files).toHaveLength(LOCALES.length * 3);
  for (const locale of LOCALES) {
    document.body.innerHTML = renderDesignIllustrations(locale);
    expect(document.querySelectorAll('figure')).toHaveLength(3);
    expect(document.querySelector('button')!.dataset.play).toBeTruthy();
    expect(document.querySelector('button')!.dataset.reduced).toBeTruthy();
    expect(document.querySelectorAll('a[download]')).toHaveLength(3);
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
    expect(svg).not.toMatch(/<script|https?:\/\/(?!www\.w3\.org)|animation[^;}]*infinite/);
  }
});

const setup = (reduced = false) => {
  vi.useFakeTimers();
  const motion = new EventTarget() as MediaQueryList;
  Object.defineProperty(motion, 'matches', { value: reduced, writable: true });
  vi.stubGlobal('matchMedia', () => motion);
  document.body.innerHTML = renderDesignIllustrations(rootLocale);
  const stop = mountDesignIllustrations();
  const figure = document.querySelector<HTMLElement>('figure')!;
  const button = figure.querySelector<HTMLButtonElement>('button')!;
  return { figure, button, motion, stop };
};

it('is opt-in, pauses and resumes the same finite sequence, then offers replay', () => {
  const { figure, button, stop } = setup();
  expect(button.hidden).toBe(false);
  expect(figure.dataset.state).toBe('idle');
  button.focus();
  button.click();
  expect(figure.dataset.state).toBe('playing');
  expect(button.querySelector('[data-play-label]')!.textContent).toBe(button.dataset.pause);
  vi.advanceTimersByTime(1500);
  button.click();
  expect(figure.dataset.state).toBe('paused');
  vi.advanceTimersByTime(5000);
  figure.querySelector('.di-motion')!.dispatchEvent(new Event('animationend', { bubbles: true }));
  expect(figure.dataset.state).toBe('paused');
  button.click();
  vi.advanceTimersByTime(4000);
  expect(figure.dataset.state).toBe('playing');
  figure.querySelector('.di-motion')!.dispatchEvent(new Event('animationend', { bubbles: true }));
  expect(figure.dataset.state).toBe('finished');
  expect(button.querySelector('[data-play-label]')!.textContent).toBe(button.dataset.replay);
  expect(document.activeElement).toBe(button);
  button.click();
  expect(figure.dataset.state).toBe('playing');
  stop();
  expect(vi.getTimerCount()).toBe(0);
});

it('uses static text for reduced motion and restores focus only when the hidden command owned it', () => {
  const { figure, button, motion, stop } = setup(true);
  const note = figure.querySelector<HTMLElement>('[data-reduced-note]')!;
  expect(button.hidden).toBe(true);
  expect(note.hidden).toBe(false);
  expect(note.textContent).toBeTruthy();
  Object.defineProperty(motion, 'matches', { value: false });
  motion.dispatchEvent(new Event('change'));
  expect(button.hidden).toBe(false);
  expect(note.hidden).toBe(true);
  expect(document.activeElement).not.toBe(button);
  button.focus();
  button.click();
  Object.defineProperty(motion, 'matches', { value: true });
  motion.dispatchEvent(new Event('change'));
  expect(figure.dataset.state).toBe('idle');
  expect(button.hidden).toBe(true);
  expect(document.activeElement).toBe(note);
  figure.querySelector('.di-motion')!.dispatchEvent(new Event('animationend', { bubbles: true }));
  expect(figure.dataset.state).toBe('idle');
  Object.defineProperty(motion, 'matches', { value: false });
  motion.dispatchEvent(new Event('change'));
  expect(document.activeElement).toBe(button);
  const link = figure.querySelector('a')!;
  link.focus();
  Object.defineProperty(motion, 'matches', { value: true });
  motion.dispatchEvent(new Event('change'));
  expect(document.activeElement).toBe(link);
  stop();
});

it('keeps a contextual native command with intrinsic reservations for every localized playback label', () => {
  for (const locale of LOCALES) {
    document.body.innerHTML = renderDesignIllustrations(locale);
    expect(document.querySelector('#design-illustrations')).toBeTruthy();
    const ids = new Set<string>();
    for (const figure of document.querySelectorAll('figure')) {
      expect(figure.id).toMatch(/^design-illustration-(alignment|radius|density)$/);
      const button = figure.querySelector('button')!;
      const description = document.getElementById(button.getAttribute('aria-describedby')!);
      expect(description).toBe(figure.querySelector('h3'));
      expect(ids.has(description!.id)).toBe(false);
      ids.add(description!.id);
      expect([...button.querySelectorAll('[aria-hidden="true"]')].map((span) => span.textContent)).toEqual([
        button.dataset.play,
        button.dataset.pause,
        button.dataset.resume,
        button.dataset.replay,
      ]);
      expect(button.querySelectorAll('[data-play-label]')).toHaveLength(1);
    }
  }
  const { button, stop } = setup();
  const reserves = [...button.querySelectorAll('[aria-hidden="true"]')];
  button.click();
  button.click();
  expect([...button.querySelectorAll('[aria-hidden="true"]')]).toEqual(reserves);
  stop();
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
    for (const path of ['design-illustrations.ts', 'langs/locales.ts', 'langs/design-illustrations-copy.ts'])
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
    expect(document.body.textContent).toContain('outer radius 20 − inset 4 = inner radius 16');
    expect(document.querySelector('[data-density-visible]')!.getAttribute('width')).toBe('18');
    expect(document.querySelector('[data-density-target]')!.getAttribute('width')).toBe('34');
    expect(document.body.textContent).toContain('18px glyph inside a 34px native command');
    expect(standalone).toContain('--ran-blue-900:#47a8ff;');
    expect(standalone).toContain('font-size:var(--ran-text-label-1)');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

it('does not duplicate event handlers and restores static fallback on cleanup', () => {
  const { figure, button, stop } = setup();
  const secondStop = mountDesignIllustrations();
  button.click();
  expect(figure.dataset.state).toBe('playing');
  expect(vi.getTimerCount()).toBe(0);
  secondStop();
  stop();
  expect(button.hidden).toBe(true);
  expect(figure.dataset.state).toBe('idle');
  button.click();
  figure.querySelector('.di-motion')!.dispatchEvent(new Event('animationend', { bubbles: true }));
  expect(figure.dataset.state).toBe('idle');
  expect(vi.getTimerCount()).toBe(0);
});
