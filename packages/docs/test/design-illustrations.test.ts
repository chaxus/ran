// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { afterEach, expect, it, vi } from 'vitest';
import { LOCALES } from '../build/langs/locales.ts';
import { renderDesignIllustrations, designIllustrationFiles } from '../build/design-illustrations.ts';
import { mountDesignIllustrations } from '../client/design-illustrations.ts';

const source = readFileSync('../ranui/theme/tokens.less', 'utf8');
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
  for (const svg of document.querySelectorAll('svg')) expect(svg.getAttribute('aria-label')).toBeTruthy();
  for (const button of document.querySelectorAll('button')) expect(button.hidden).toBe(true);
  const outer = document.querySelector('[data-radius-outer]')!;
  const inner = document.querySelector('[data-radius-inner]')!;
  expect(Number(outer.getAttribute('rx'))).toBe(px('--ran-radius-lg'));
  expect(Number(inner.getAttribute('rx'))).toBe(px('--ran-radius-md'));
  expect(Number(inner.getAttribute('x')) - Number(outer.getAttribute('x'))).toBe(px('--ran-space-1'));
  expect(Number(inner.getAttribute('x')) + Number(inner.getAttribute('rx'))).toBe(
    Number(outer.getAttribute('x')) + Number(outer.getAttribute('rx')),
  );
  expect(Number(document.querySelector('[data-density-visible]')!.getAttribute('width'))).toBe(px('--ran-size-7'));
  expect(Number(document.querySelector('[data-density-target]')!.getAttribute('width'))).toBe(
    px('--ran-size-7') + 2 * px('--ran-space-2'),
  );
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
    expect(name).toMatch(/^illustrations\/[\w-]+\/(alignment|radius|density)\.svg$/);
    expect(svg).toContain('prefers-color-scheme: dark');
    expect(svg).toContain('prefers-reduced-motion: reduce');
    expect(svg).toContain('--ran-color-text:');
    expect(svg).not.toMatch(/<script|https?:\/\/(?!www.w3.org)|animation[^;}]*infinite/);
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
  expect(button.textContent).toBe(button.dataset.pause);
  vi.advanceTimersByTime(1500);
  button.click();
  expect(figure.dataset.state).toBe('paused');
  vi.advanceTimersByTime(5000);
  expect(figure.dataset.state).toBe('paused');
  button.click();
  vi.advanceTimersByTime(2499);
  expect(figure.dataset.state).toBe('playing');
  vi.advanceTimersByTime(1);
  expect(figure.dataset.state).toBe('finished');
  expect(button.textContent).toBe(button.dataset.replay);
  expect(document.activeElement).toBe(button);
  button.click();
  expect(figure.dataset.state).toBe('playing');
  stop();
  expect(vi.getTimerCount()).toBe(0);
});

it('disables motion initially and cancels active playback when reduced motion changes', () => {
  let state = setup(true);
  expect(state.button.disabled).toBe(true);
  expect(state.button.textContent).toBe(state.button.dataset.reduced);
  state.stop();
  state = setup();
  state.button.click();
  Object.defineProperty(state.motion, 'matches', { value: true });
  state.motion.dispatchEvent(new Event('change'));
  expect(state.figure.dataset.state).toBe('idle');
  expect(state.button.disabled).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
  state.stop();
});

it('keeps captions and geometry aligned with changed source tokens and ignores commented declarations', async () => {
  const { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join, resolve } = await import('node:path');
  const { execFileSync } = await import('node:child_process');
  const dir = mkdtempSync(join(tmpdir(), 'ran-design-illustrations-'));
  try {
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module' }));
    for (const path of ['docs/build/langs', 'ranui/theme']) mkdirSync(join(dir, path), { recursive: true });
    for (const path of ['design-illustrations.ts', 'langs/locales.ts', 'langs/design-illustrations-copy.ts'])
      copyFileSync(resolve('build', path), join(dir, 'docs/build', path));
    const modified =
      source
        .replace('--ran-radius-lg: 16px', '--ran-radius-lg: 20px')
        .replace('--ran-radius-md: 12px', '--ran-radius-md: 16px') + '\n/* --ran-radius-lg: 99px; */';
    writeFileSync(join(dir, 'ranui/theme/tokens.less'), modified);
    writeFileSync(
      join(dir, 'ranui/theme/dark.less'),
      readFileSync('../ranui/theme/dark.less', 'utf8') + '\n--ran-color-link: var(--ran-blue-900);',
    );
    const script = `import {renderDesignIllustrations,designIllustrationFiles} from ${JSON.stringify(join(dir, 'docs/build/design-illustrations.ts'))}; import {ROOT_LOCALE} from ${JSON.stringify(join(dir, 'docs/build/langs/locales.ts'))}; console.log(JSON.stringify([renderDesignIllustrations(ROOT_LOCALE),designIllustrationFiles()[0][1]]));`;
    const [html, standalone] = JSON.parse(
      execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' }),
    );
    document.body.innerHTML = html;
    expect(document.querySelector('[data-radius-outer]')!.getAttribute('rx')).toBe('20');
    expect(document.body.textContent).toContain('outer radius 20 − inset 4 = inner radius 16');
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
  expect(vi.getTimerCount()).toBe(1);
  secondStop();
  stop();
  expect(button.hidden).toBe(true);
  expect(figure.dataset.state).toBe('idle');
  button.click();
  expect(vi.getTimerCount()).toBe(0);
});
