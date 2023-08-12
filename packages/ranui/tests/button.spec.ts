import { expect, test } from '@playwright/test'
import { DEV_SERVER, TIME_OUT } from '../playwright.config'

test('button', async ({ page }) => {
  setTimeout(async () => {
    await page.waitForURL(DEV_SERVER, { timeout: TIME_OUT })
    await page.goto(DEV_SERVER)
    await page.waitForLoadState('domcontentloaded')
    await page.waitForLoadState('load')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/ranui/)
    await page.evaluate(() => {
      const component = document.createElement('r-button')
      component.role = 'button'
      component.innerText = 'Submit'
      document.body.appendChild(component)
    })
    await page.getByRole('button', { name: /submit/i }).click()
    await expect(page.getByRole('button', { name: /submit/i })).toBeVisible()
  }, TIME_OUT)
})
