import { expect, test } from '@playwright/test';

/**
 * Every page used to be published under `/src/`, and those URLs are indexed and linked from
 * elsewhere. The preview server follows the deployed `_redirects`, so this is the redirect
 * a reader with an old link gets.
 */
for (const [retired, current] of [
  ['/src/ranui/button/', '/ranui/button/'],
  ['/cn/src/article/doc_preview', '/cn/articles/doc_preview'],
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
