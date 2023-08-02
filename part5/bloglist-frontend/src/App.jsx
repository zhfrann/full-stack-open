import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import SuccessMessage from './components/SuccessMessage'
import FailedMessage from './components/FailedMessage'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [failedMessage, setFailedMessage] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const loginHandler = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error.response.data.error)
      setFailedMessage(error.response.data.error)
      setUsername('')
      setPassword('')
      setTimeout(() => {
        setFailedMessage(null)
      }, 5000)
    }
  }

  const logoutHandler = async (event) => {
    event.preventDefault()

    setUser(null)
    window.localStorage.removeItem('loggedUser')
  }

  const createBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title, author, url
    }

    try {
      const newSavedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(newSavedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setSuccessMessage(`a new blog '${newSavedBlog.title}' by ${newSavedBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      console.log(error.message)
      console.log(error.response.data.error)
      setFailedMessage(error.response.data.error)
      setTimeout(() => {
        setFailedMessage(null)
      }, 5000)
    }
  }

  let message
  if (successMessage) {
    message = <SuccessMessage message={successMessage} />
  } else if (failedMessage) {
    message = <FailedMessage message={failedMessage} />
  }

  if (user) {
    return (
      <div>

        {message}

        <h2>blogs</h2>

        <div style={{ marginBottom: '20px' }}>
          {user.name} logged in.
          <form onSubmit={logoutHandler} style={{ display: 'inline-block', marginLeft: '5px' }}>
            <button type='submit'>Logout</button>
          </form>
        </div>

        <form onSubmit={createBlog} style={{ marginBottom: '10px' }}>
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

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  } else {
    return (
      <div>

        {message}

        <h2>Log in to application</h2>
        <form onSubmit={loginHandler}>
          <div>
            <label htmlFor='username'>Username : </label>
            <input id='username' name='username' value={username} onChange={({ target }) => { setUsername(target.value) }}></input>
          </div>
          <div>
            <label htmlFor='password'>Password : </label>
            <input id='password' name='password' value={password} onChange={({ target }) => { setPassword(target.value) }}></input>
          </div>
          <button type='submit'>login</button>
        </form >
      </div >
    )
  }

}

export default App