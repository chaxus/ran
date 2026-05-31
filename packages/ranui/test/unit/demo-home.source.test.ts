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
    expect(source).toContain('Component notes');
    expect(source).toContain('class="component-meta"');
    expect(source).toContain('component-notes');

    for (const component of COMPONENTS) {
      expect(source, `${component} card anchor missing`).toContain(`id="component-${component}"`);
      expect(source, `${component} detail anchor missing`).toContain(`id="docs-${component}"`);
      expect(source, `${component} detail link missing`).toContain(`href="#docs-${component}"`);
    }
  });

  it('keeps homepage navigation focused on product and docs tasks', () => {
    const source = readDemo();

    expect(source).toContain('href="#components"');
    expect(source).toContain('Explore components');
    expect(source).toContain('href="#themes"');
    expect(source).toContain('href="#style-api"');
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
