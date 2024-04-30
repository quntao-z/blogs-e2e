const { test, expect, beforeEach, describe } = require('@playwright/test');

describe ('Blog app', () => {
  beforeEach(async ({page}) => {
    await page.goto(' http://localhost:5173/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Log into application')
    await expect(locator).toBeVisible()
  })

  
}) 

