import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from '@playwright/test';

const require = createRequire(import.meta.url);
const environment = JSON.parse(readFileSync(new URL('./environment.json', import.meta.url)));

export default async function setup(config) {
  if (
    process.env.RANUI_VISUAL_IMAGE !== environment.image ||
    process.platform !== 'linux' ||
    process.arch !== 'arm64'
  ) {
    throw new Error('Use pnpm -F ranui test:visual: the screenshot renderer must be the pinned Linux arm64 container.');
  }
  if (
    require('@playwright/test/package.json').version !== environment.playwright ||
    process.version !== environment.node
  ) {
    throw new Error('Visual Playwright/Node versions differ from test/visual/environment.json');
  }
  if (config.updateSnapshots !== 'none' && process.env.RANUI_VISUAL_UPDATE !== '1') {
    throw new Error('Baseline updates require the explicit test:update command.');
  }
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] });
  const browserVersion = browser.version();
  await browser.close();
  if (browserVersion !== environment.chromium) throw new Error(`Unexpected screenshot browser ${browserVersion}`);
  const fonts = [
    ...new Set(execFileSync('fc-list', ['--format', '%{file}\n'], { encoding: 'utf8' }).trim().split('\n')),
  ].sort();
  const hash = createHash('sha256');
  for (const font of fonts) hash.update(font).update(readFileSync(font));
  const inputs = [
    'playwright.config.ts',
    'playwright.visual.config.ts',
    'test/e2e/helpers.ts',
    'test/visual/setup.mjs',
    'bin/visual.mjs',
  ];
  for (const file of readdirSync('test/e2e', { recursive: true })) {
    if (
      file.endsWith('.spec.ts') &&
      statSync(join('test/e2e', file)).isFile() &&
      /toHaveScreenshot|toMatchSnapshot/.test(readFileSync(join('test/e2e', file), 'utf8'))
    ) {
      inputs.push(join('test/e2e', file));
    }
  }
  const harness = createHash('sha256');
  for (const input of inputs.sort()) harness.update(input).update(readFileSync(input));
  const localFonts = createHash('sha256');
  for (const directory of ['fonts', 'assets/fonts']) {
    for (const file of readdirSync(directory)
      .filter((name) => /\.(woff2?|ttf|otf)$/.test(name))
      .sort()) {
      localFonts.update(join(directory, file)).update(readFileSync(join(directory, file)));
    }
  }
  const actual = {
    ...environment,
    systemFontsSha256: hash.digest('hex'),
    systemFontFiles: fonts.length,
    localFontsSha256: localFonts.digest('hex'),
    harnessSha256: harness.digest('hex'),
  };
  mkdirSync('test-results/visual', { recursive: true });
  writeFileSync('test-results/visual/environment.json', JSON.stringify(actual, null, 2) + '\n');
  if (config.updateSnapshots === 'none') {
    const manifestPath = 'test/e2e/__screenshots__/manifest.json';
    if (!existsSync(manifestPath)) throw new Error('Reviewed visual baseline manifest is missing.');
    const expected = JSON.parse(readFileSync(manifestPath));
    const directory = 'test/e2e/__screenshots__/linux-arm64';
    const files = readdirSync(directory, { recursive: true })
      .filter((file) => file.endsWith('.png'))
      .sort();
    if (JSON.stringify(files) !== JSON.stringify(Object.keys(expected.snapshots).sort())) {
      throw new Error('Screenshot baseline file set differs from the reviewed manifest.');
    }
    for (const file of files) {
      const digest = createHash('sha256')
        .update(readFileSync(join(directory, file)))
        .digest('hex');
      if (digest !== expected.snapshots[file]) throw new Error(`Unreviewed screenshot baseline: ${file}`);
    }
    if (JSON.stringify(expected.environment) !== JSON.stringify(actual)) {
      throw new Error('Screenshot environment/font fingerprint differs from the reviewed baseline manifest.');
    }
  }
}
