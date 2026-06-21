import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const readDemo = (): string => readFileSync(resolve(root, 'demo/index.html'), 'utf8');
const readDemoCss = (): string => readFileSync(resolve(root, 'demo/demo.css'), 'utf8');
const readDemoTs = (): string => readFileSync(resolve(root, 'demo/index.ts'), 'utf8');
const readThemeTokens = (): string => readFileSync(resolve(root, 'theme/tokens.less'), 'utf8');

const COMPONENTS = [
  'button',
  'icon',
  'input',
  'select',
  'checkbox',
  'form',
  'progress',
  'loading',
  'skeleton',
  'message',
  'tabs',
  'popover',
  'modal',
  'image',
  'colorpicker',
  'math',
  'radar',
  'scratch',
];

describe('ranui demo homepage source', () => {
  it('exposes the component gallery as a docs entry point', () => {
    const source = readDemo();

    expect(source).toContain('id="components"');
    expect(source).toContain('Component Directory');
    expect(source).toContain('class="component-meta"');

    // Component gallery cards still present on landing page
    for (const component of COMPONENTS) {
      expect(source, `${component} card anchor missing`).toContain(`id="component-${component}"`);
    }

    // Detail pages moved to routed views — each component has a route and SPA link
    for (const component of COMPONENTS) {
      expect(source, `${component} route missing`).toContain(`path="/components/${component}"`);
      expect(source, `${component} view-notes link missing`).toContain(`href="/components/${component}"`);
    }
  });

  it('keeps homepage navigation focused on product and docs tasks', () => {
    const source = readDemo();

    expect(source).toContain('href="#components"');
    expect(source).toContain('href="#themes"');
    expect(source).toContain('href="#style-api"');
  });

  it('presents the homepage as an interactive theme workbench', () => {
    const source = readDemo();
    const css = readDemoCss();
    const ts = readDemoTs();

    expect(source).toContain('class="intro-grid"');
    expect(source).toContain('class="hero-mockup"');
    expect(source).toContain('class="pack-pill theme-pack-button"');
    expect(source).toContain('data-pack-choice="wired"');
    expect(css).toContain('.theme-pack-button');
    expect(css).toContain('.pack-pill');
    expect(ts).toContain('bindThemePackButtons');
  });

  it('derives demo page chrome from the ran theme token contract', () => {
    const source = readDemoCss();
    const tokens = readThemeTokens();

    expect(tokens).toContain('--ran-page-background: var(--ran-color-bg-muted);');
    expect(source).toContain('--page: var(--ran-page-background);');
    expect(source).toContain('--surface: var(--ran-surface-background);');
    expect(source).not.toMatch(/:root\[data-ran-theme-pack=['"][^'"]+['"]\]\s*\{[^}]*--page:/s);
  });

  it('syncs nav controls from the stored runtime theme state', () => {
    const source = readDemoTs();

    expect(source).toContain("import '../style';");
    expect(source).toContain('syncThemeControls');
    expect(source).toContain("localStorage.getItem('ran-theme')");
    expect(source).toContain("localStorage.getItem('ran-theme-pack')");
    expect(source).toContain('selectOptionElement');
  });
});
