import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const readDemo = (): string => readFileSync(resolve(root, 'demo/index.html'), 'utf8');

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
    expect(source).toContain('component-docs');

    for (const component of COMPONENTS) {
      expect(source, `${component} card anchor missing`).toContain(`id="component-${component}"`);
      expect(source, `${component} detail anchor missing`).toContain(`id="docs-${component}"`);
      expect(source, `${component} detail link missing`).toContain(`href="#docs-${component}"`);
    }
  });

  it('keeps homepage navigation focused on product and docs tasks', () => {
    const source = readDemo();

    expect(source).toContain('href="#components"');
    expect(source).toContain('Browse components');
    expect(source).toContain('href="#themes"');
    expect(source).toContain('href="#style-api"');
  });
});
