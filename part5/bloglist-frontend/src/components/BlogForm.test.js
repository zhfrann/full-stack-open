import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('submit the blog form', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const inputTitle = container.querySelector('#title')
    const inputAuthor = container.querySelector('#author')
    const inputUrl = container.querySelector('#url')
    const submitButton = screen.getByText('create')

    await user.type(inputTitle, 'testing a form...')
    await user.type(inputAuthor, 'author from testing')
    await user.type(inputUrl, 'url from testing')
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
    expect(createBlog.mock.calls[0][0].author).toBe('author from testing')
    expect(createBlog.mock.calls[0][0].url).toBe('url from testing')
})