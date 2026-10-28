import { expect, test } from '@playwright/test';

/**
 * Every page used to be published under `/src/`, and those URLs are indexed and linked from
 * elsewhere. The preview server follows the deployed `_redirects`, so this is the redirect
 * a reader with an old link gets.
 */
for (const [retired, current] of [
  ['/src/ranui/button/', '/ranui/button/'],
  ['/cn/src/ranuts/choosing/', '/cn/ranuts/choosing/'],
  ['/fa/src/ranuts/', '/fa/ranuts/'],
  ['/src/ranui/tabs', '/ranui/tab/'],
]) {
  test(`${retired} lands on ${current}`, async ({ page }) => {
    const response = await page.goto(`${retired}#keep`);
    expect(new URL(page.url()).pathname).toBe(current);
    expect(response?.status()).toBe(200);
    expect(response?.request().redirectedFrom()?.url()).toContain(retired);
  });
}

// Articles and notes moved to chaxus.com: the old URL answers with one 301 straight there.
for (const [moved, target] of [
  ['/articles/doc_preview', 'https://chaxus.com/writing/doc_preview/'],
  ['/cn/src/note/docker', 'https://chaxus.com/zh/writing/docker/'],
]) {
  test(`${moved} moves to ${target}`, async ({ request }) => {
    const response = await request.get(moved, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers().location).toBe(target);
  });
}
