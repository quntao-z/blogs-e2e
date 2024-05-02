const { test, expect, beforeEach, describe } = require('@playwright/test');

describe ('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Grace Hopper',
        username: 'ghopper',
        password: 'cobol'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Log into application')
    await expect(locator).toBeVisible()
  })

  test('login form', async ({ page}) => {
    await page.getByTestId('username').fill('ghopper')
    await page.getByTestId('password').fill('cobol')

    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('Grace Hopper logged in')).toBeVisible()
  })
}) 

