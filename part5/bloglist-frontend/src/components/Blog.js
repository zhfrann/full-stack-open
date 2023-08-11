import { useState } from "react"

const Blog = ({ blog, likesHandler, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: visible ? 'none' : '' }
  const hideWhenVisible = { display: visible ? '' : 'none' }

  const blogUser = user.username === blog.user.username

  return (
    <div style={blogStyle}>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={{ marginLeft: '7px' }}>view</button>
      </div>
      <div style={hideWhenVisible}>
        <div>
          {blog.title}
          <button onClick={toggleVisibility} style={{ marginLeft: '7px' }}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => likesHandler(blog.id)} style={{ marginLeft: '5px' }}>like</button>
        </div>
        <div>{blog.author}</div>
        {blogUser && <button onClick={() => window.confirm(`remove blog '${blog.title}' by ${blog.author}`)}>remove</button>}
      </div>
    </div>
  )
}

export default Blog