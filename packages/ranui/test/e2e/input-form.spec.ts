import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow } from '../../testing';
import { isolatedSetup, mount } from './helpers';

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-input');
});

test('attribute updates and removal change the submitted value', async ({ page }) => {
  await mount(page, '<form><r-input name="username" value="before"></r-input></form>');
  const values = await page.evaluate(() => {
    const form = document.querySelector('form')!;
    const input = document.querySelector('r-input')!;
    input.setAttribute('value', 'after');
    const updated = new FormData(form).get('username');
    input.removeAttribute('value');
    return [updated, new FormData(form).get('username')];
  });
  expect(values).toEqual(['after', '']);
});

test('a re-enabled input accepts keyboard input after changing type', async ({ page }) => {
  await mount(page, '<r-input disabled></r-input>');
  await page.locator('r-input').evaluate((input) => {
    input.removeAttribute('disabled');
    input.setAttribute('type', 'password');
    input.focus();
  });
  await page.keyboard.type('secret');
  expect(await insideShadow(page, 'r-input', (root) => root.querySelector('input')!.type)).toBe('password');
  await expect(page.locator('r-input')).toHaveAttribute('value', 'secret');
});

test('native numeric constraints gate form submission and recover after edits', async ({ page }) => {
  await mount(page, '<form><r-input name="amount" type="number" min="10" max="20" step="2"></r-input></form>');
  const states = await page.evaluate(() => {
    const form = document.querySelector('form')!;
    const input = document.querySelector('r-input')!;
    const states: boolean[] = [];
    for (const value of ['3', '21', '11', '12']) {
      input.setAttribute('value', value);
      states.push(form.checkValidity());
    }
    input.setAttribute('min', '14');
    states.push(form.checkValidity());
    input.setAttribute('disabled', '');
    states.push(form.checkValidity());
    input.removeAttribute('disabled');
    states.push(form.checkValidity());
    input.removeAttribute('min');
    states.push(form.checkValidity());
    return states;
  });
  expect(states).toEqual([false, false, false, true, false, true, false, true]);
});

test('email validity and required state follow value and type changes', async ({ page }) => {
  await mount(page, '<form><r-input name="email" type="email" required></r-input></form>');
  const states = await page.evaluate(() => {
    const form = document.querySelector('form')!;
    const input = document.querySelector('r-input')!;
    const states = [form.checkValidity()];
    input.setAttribute('value', 'invalid');
    states.push(form.checkValidity());
    input.setAttribute('value', 'alice@example.com');
    states.push(form.checkValidity());
    input.removeAttribute('value');
    states.push(form.checkValidity());
    input.removeAttribute('required');
    states.push(form.checkValidity());
    return states;
  });
  expect(states).toEqual([false, false, true, false, true]);
});

for (const action of ['clear', 'reset'] as const) {
  test(`${action} clears an invalid numeric edit even when the reflected value is already empty`, async ({ page }) => {
    await mount(page, '<form><r-input name="amount" type="number"></r-input></form>');
    await page.locator('r-input').evaluate((input) => input.focus());
    await page.keyboard.type('-');
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(false);
    await page.evaluate((action) => {
      if (action === 'clear') document.querySelector('r-input')!.value = '';
      else document.querySelector('form')!.reset();
    }, action);
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(true);
  });
}
