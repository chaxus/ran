import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';

// Exercise the emitted ESM, not the source adapters or mocks. Actual media decoding
// still depends on browser codecs/MSE and is outside this constructor/rendering smoke test.
test('built lazy media and diagram engines execute in a browser', async ({ page }) => {
  const dist = fileURLToPath(new URL('../../dist/', import.meta.url));
  const files = await readdir(dist);
  const urls = ['dash.all.min', 'hls', 'mpegts', 'mermaid.core'].map((prefix) => {
    const matches = files.filter((file) => file.startsWith(`${prefix}-`) && file.endsWith('.js'));
    expect(matches).toHaveLength(1);
    return `${DEV_SERVER}@fs${dist}${matches[0]}`;
  });
  // Serve only the empty test document; engine modules below still come from Vite's
  // real dist files. Demo media/navigation must not interfere with package execution.
  await page.route(DEV_SERVER, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html><body></body></html>',
    }),
  );
  await page.goto(DEV_SERVER);
  const result = await page.evaluate(async (urls) => {
    const [dash, hls, flv, diagram] = await Promise.all(urls.map((url) => import(/* @vite-ignore */ url)));
    const dashPlayer = dash.MediaPlayer().create();
    const hlsPlayer = new hls.default();
    const result = {
      dash: typeof dashPlayer.initialize,
      hls: typeof hlsPlayer.loadSource,
      flv: typeof flv.default.createPlayer,
      svg: '',
    };
    // DASH has no attached resources; its destroy method requires initialize() first.
    hlsPlayer.destroy();
    diagram.default.initialize({ startOnLoad: false });
    result.svg = (await diagram.default.render('packed-diagram', 'graph TD; A[Ready] --> B[Done]')).svg;
    return result;
  }, urls);
  expect(result.dash).toBe('function');
  expect(result.hls).toBe('function');
  expect(result.flv).toBe('function');
  expect(result.svg).toContain('<svg');
  expect(result.svg).toContain('Ready');
});
