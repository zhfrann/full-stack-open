import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let user

beforeEach(() => {
    user = {
        username: 'user123',
        name: 'user'
    }
})

test('blog component only render the title and author', () => {
    const blog = {
        title: 'this is title for testing',
        author: 'nothing here',
        likes: 6,
        url: 'nothing',
        user: user
    }

    render(<Blog blog={blog} user={user} />)

    const title = screen.getByText('this is title for testing')
    const author = screen.getByText('nothing here')

    expect(title).toBeDefined()
    expect(author).toBeDefined()
})

test('show the detail of blog when the button is clicked', async () => {
    const blog = {
        title: 'this is title for testing',
        author: 'nothing here',
        likes: 6,
        url: 'nothing',
        user: user
    }

    const { container } = render(<Blog blog={blog} user={user} />)

    const div = container.querySelector('.blogDescription')
    expect(div).toHaveStyle('display: none')

    const eventUser = userEvent.setup()
    const button = screen.getByText('view')
    await eventUser.click(button)

    expect(div).not.toHaveStyle('display: none')

    const url = screen.getByText('nothing')
    const likes = screen.getByText('6', { exact: false })

    expect(url).toBeDefined()
    expect(likes).toBeDefined()
})

test('clicked the like button twice', async () => {
    const blog = {
        title: 'this is title for testing',
        author: 'nothing here',
        likes: 6,
        url: 'nothing',
        user: user
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} user={user} likesHandler={mockHandler} />)

    const eventUser = userEvent.setup()
    const button = screen.getByText('like')

    await eventUser.click(button)
    await eventUser.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

