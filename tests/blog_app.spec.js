const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog, createUser } = require('./helper');

describe ('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('http:localhost:3001/api/testing/reset')
    createUser('Grace Hopper', 'ghopper', 'cobol')
    createUser('Alan Turing', 'aturing', 'enigma')
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Log into application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'ghopper', 'cobol')
  
      await expect(page.getByText('Grace Hopper logged in')).toBeVisible()
    })

    test('fails login with the wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('hacker')
      await page.getByTestId('password').fill('breakyourwebsite')
  
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = await page.locator('.error')
  
      await expect(errorDiv).toContainText('Wrong credentials')

      await expect(page.getByText('Hacker logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'ghopper', 'cobol')
    })

    test('a new blog can be created', async ({ page }) => {
      createBlog(page, 'title-test', 'author-test', 'url-test')
  
      const successDiv = await page.locator('.success')
      await expect(successDiv).toContainText('A new blog was added: title-test by author-test')
    })

    test(`a blog's likes can be edited`, async({page}) => {
      createBlog(page, 'title-test', 'author-test', 'url-test')

      await page.getByRole('button', {name: 'View'}).click()
      await page.getByRole('button', {name: 'like'}).click()
      await expect(page.getByText('Likes: 1')).toBeVisible()
    })
  })
}) 

