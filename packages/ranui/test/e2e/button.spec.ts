import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test('button', { tag: '@visual' }, async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-button');
  await mount(page, '<r-button role="button">Submit</r-button>');
  const button = page.getByRole('button', { name: /submit/i });
  await expect(button).toBeVisible();
  await expect(button).toHaveScreenshot('button.png');
});
