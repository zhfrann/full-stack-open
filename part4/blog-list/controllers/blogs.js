const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

// blogsRouter.get('/:id', (request, response) => {
//     Blog.findById(request.params.id)
//         .then(blog => {
//             if (blog) {
//                 response.json(blog)
//             } else {
//                 response.status(404).end()
//             }
//         })
// })

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (body.title === undefined || body.url === undefined) {
        return response.status(400).send({ error: 'missing title or url' })
    }

    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    }

    const blog = new Blog(newBlog)

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
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
        likes: body.likes || 0
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new: true, runValidators: true, context: 'query' })
    response.json(updatedBlog)
})

module.exports = blogsRouter