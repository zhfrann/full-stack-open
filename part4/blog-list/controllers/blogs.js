const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog.find({})
        .then(blogs => {
            response.json(blogs)
        })
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

blogsRouter.post('/', (request, response) => {
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

    blog.save()
        .then(savedBlog => {
            response.status(201).json(savedBlog)
        })
})

module.exports = blogsRouter