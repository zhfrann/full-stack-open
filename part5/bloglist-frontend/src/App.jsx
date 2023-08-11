import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import SuccessMessage from './components/SuccessMessage'
import FailedMessage from './components/FailedMessage'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  const blogFormRef = useRef()

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

  const createBlog = async (newBlog) => {
    try {
      const newSavedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(newSavedBlog))
      setSuccessMessage(`a new blog '${newSavedBlog.title}' by ${newSavedBlog.author} added`)
      blogFormRef.current.toggleVisibility()   // to hide the blog create form after create form success
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

  const likesHandler = async (id) => {
    const blog = blogs.find(blog => blog.id === id)
    const changedBlog = { ...blog, user: blog.user.id, likes: blog.likes + 1 }
    delete changedBlog.id

    try {
      const updatedBlog = await blogService.update(id, changedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog))
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

  const sortedBlog = blogs.sort((a, b) => b.likes - a.likes)

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

        <Togglable buttonLabel='new note' ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>

        {sortedBlog.map(blog =>
          <Blog key={blog.id} blog={blog} likesHandler={likesHandler} user={user} />
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