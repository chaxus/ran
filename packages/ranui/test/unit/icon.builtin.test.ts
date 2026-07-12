import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, beforeEach } from 'vitest';
import { Icon, RAN_ICON_NAMES } from '@/components/icon/index';
import { BUILTIN_ICON_NAMES, registerBuiltinIcons } from '@/components/icon/builtin';
import '@/components/icon/index';

// Actual SVG file stems shipped in assets/icons (excluding the combined sprite).
const assetNames = readdirSync(resolve(__dirname, '../../assets/icons'))
  .filter((f) => f.endsWith('.svg') && f !== 'sprite.svg')
  .map((f) => f.replace(/\.svg$/, ''))
  .sort();

describe('bundled icon set', () => {
  const sleep = (ms = 20) => new Promise((r) => setTimeout(r, ms));

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('RAN_ICON_NAMES stays in sync with the assets/icons folder', () => {
    // If this fails, an SVG was added/removed without updating RAN_ICON_NAMES.
    expect([...RAN_ICON_NAMES].sort()).toEqual(assetNames);
  });

  it('registerBuiltinIcons exposes exactly the bundled names', () => {
    expect(BUILTIN_ICON_NAMES).toEqual(assetNames);
  });

  it('renders a builtin icon after registerBuiltinIcons()', async () => {
    registerBuiltinIcons();
    const icon = document.createElement('r-icon') as Icon;
    icon.setAttribute('name', 'lock');
    document.body.appendChild(icon);
    await sleep(20);

    const shadow = (icon as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('svg')).not.toBeNull();
  });
});
