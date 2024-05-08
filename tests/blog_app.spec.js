const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog, createUser } = require('./helper');
const exp = require('constants');

describe ('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('http:localhost:3001/api/testing/reset')
    createUser(request, 'Grace Hopper', 'ghopper', 'cobol')
    createUser(request, 'Alan Turing', 'aturing', 'enigma')
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
      await createBlog(page, 'title-test', 'author-test', 'url-test')
    })

    test('a new blog can be created', async ({ page }) => {
      const successDiv = await page.locator('.success')
      await expect(successDiv).toContainText('A new blog was added: title-test by author-test')
    })

    test(`a blog's likes can be edited`, async({page}) => {
      await page.getByRole('button', {name: 'View'}).click()
      await page.getByRole('button', {name: 'like'}).click()
      await expect(page.getByText('Likes: 1')).toBeVisible()
    })

    test('delete a blog', async ({page}) => {
      await page.getByRole('button', {name: 'View'}).click()

      page.on('dialog', async(dialog) => {
        expect(dialog.message()).toContain("Removing the blog title-test by author-test")
        await dialog.accept()
      })

      await page.getByRole('button', {name: 'remove'}).click()
      await expect(page.getByRole('button', {name: 'View'})).not.toBeVisible()
    })

    test(`user who created the blog see the blog's delete button`, async ({page}) => {
      await page.getByRole('button', {name: 'View'}).click()
      await expect(page.getByRole('button', {name: 'remove'})).toBeVisible()
      await page.getByRole('button', {name: 'Log out'}).click()
      await loginWith(page, 'aturing', 'enigma')
      await page.getByRole('button', {name: 'View'}).click()
      await expect(page.getByRole('button', {name: 'remove'})).not.toBeVisible()
    })

    // order should be 3021
    test.only(`blog's ranking based on likes`, async({page}) => {
      await page.getByRole('button', {name: 'View'}).click()
      await page.getByRole('button', {name: 'like'}).click()

      await createBlog(page, 'title-test1', 'author-test1', 'url-test1')
      await page.getByRole('button', {name: 'View'}).nth(1).click()
      await page.getByRole('button', {name: 'like'}).nth(1).click()
      await page.getByRole('button', {name: 'like'}).nth(1).click()
      await page.getByRole('button', {name: 'like'}).nth(1).click()
      await page.getByRole('button', {name: 'like'}).nth(1).click()

      await createBlog(page, 'title-test2', 'author-test2', 'url-test2')
      await page.getByRole('button', {name: 'like'}).nth(2).click()
      await page.getByRole('button', {name: 'like'}).nth(2).click()
    })
  })
}) 

