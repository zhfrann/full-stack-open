const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const { userExtractor } = require('../utils/middleware')

// const getTokenFrom = request => {
//     const authorization = request.headers.authorization
//     if (authorization && authorization.startsWith('Bearer ')) {
//         return authorization.replace('Bearer ', '')
//     }
//     return null
// }

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body

    if (body.title === undefined || body.url === undefined) {
        return response.status(400).send({ error: 'missing title or url' })
    }
    const userId = request.user
    const user = await User.findById(userId)

    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    }

    const blog = new Blog(newBlog)

    const savedBlog = await blog.save()
    // response.status(201).json(savedBlog)

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user
    if (blog.user.toString() !== user) {
        return response.status(401).send({ error: 'you are unauthorized' })
    }

    const deletedNote = await Blog.findByIdAndRemove(request.params.id)

    if (deletedNote) {
        response.status(204).end()
    } else {
        response.status(404).send({ error: 'blog not found' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    if (body.title === undefined || body.url === undefined) {
        return response.status(400).send({ error: 'missing title or url' })
    }

    const updateBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: body.user
    }

    console.log('update Blog', updateBlog)

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new: true, runValidators: true, context: 'query' })
    response.json(updatedBlog)
})

module.exports = blogsRouter