import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()

        createBlog({
            title, author, url
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <form onSubmit={addBlog} style={{ marginBottom: '10px' }}>
            <h2>Create new</h2>

            <div>
                <label htmlFor="title">title : </label>
                <input type="text" name='title' id='title' value={title} onChange={({ target }) => setTitle(target.value)} />
            </div>
            <div>
                <label htmlFor="author">author : </label>
                <input type="text" name='author' id='author' value={author} onChange={({ target }) => { setAuthor(target.value) }} />
            </div>
            <div>
                <label htmlFor="url">url : </label>
                <input type="text" name='url' id='url' value={url} onChange={(event) => setUrl(event.target.value)} />
            </div>
            <button type="submit">create</button>
        </form>
    )
}

export default BlogForm