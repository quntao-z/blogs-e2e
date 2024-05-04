const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
  
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', {name: 'Create New Blog'}).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url) 
    await page.getByRole('button', {name: 'Create'}).click()
}

const createUser = async (name, username, password) => {
    await request.post('http://localhost:3001/api/users', {
        data: {
          name: name,
          username: username,
          password: password
        }
    })
}

export { loginWith, createBlog, createUser }