/**
 * Renders the static image assets: the social card and the PNG icons.
 *
 * Deliberately **not** part of `build`. These change when the wordmark or the tagline
 * changes, which is roughly never, and making every deploy depend on a browser binary
 * would be a poor trade. The outputs are committed; run `pnpm -F site og` after editing
 * `assets/og.html` or `public/favicon.svg`.
 *
 * Chromium is the renderer because the card is authored in HTML — same palette, same
 * type stack, same wordmark as the site, so the two cannot drift the way a card drawn
 * in a design tool does.
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { OG_IMAGE } from './config.ts';
import { ROOT } from './build.ts';

const PUBLIC_DIR = join(ROOT, 'public');

/** Sizes an installed icon is actually requested at. */
const ICON_SIZES = [180, 192, 512] as const;

const main = async (): Promise<void> => {
  const browser = await chromium.launch();
  try {
    // ── Social card ────────────────────────────────────────────────────────
    const card = await browser.newPage({
      viewport: { width: OG_IMAGE.width, height: OG_IMAGE.height },
      deviceScaleFactor: 1,
    });
    await card.goto(pathToFileURL(join(ROOT, 'assets', 'og.html')).href, { waitUntil: 'networkidle' });
    await card.screenshot({ path: join(PUBLIC_DIR, 'og.png') });
    await card.close();
    console.log(`og: og.png (${OG_IMAGE.width}x${OG_IMAGE.height})`);

    // ── Icons ──────────────────────────────────────────────────────────────
    // The favicon is the source of truth; the PNGs are it at fixed sizes for the
    // places that will not take an SVG (the manifest, iOS home screens).
    const svg = readFileSync(join(PUBLIC_DIR, 'favicon.svg'), 'utf8');
    for (const size of ICON_SIZES) {
      const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
      // The SVG carries a dark-mode rule; an icon file has to commit to one pairing, so
      // it is rendered in the light one, which is what both app launchers assume.
      await page.emulateMedia({ colorScheme: 'light' });
      await page.setContent(
        `<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
      );
      await page.screenshot({ path: join(PUBLIC_DIR, `icon-${size}.png`), omitBackground: true });
      await page.close();
      console.log(`og: icon-${size}.png`);
    }
  } finally {
    await browser.close();
  }
};

await main();
