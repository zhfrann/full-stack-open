const mongoose = require('mongoose')
const listHelper = require('../utils/blog_list_api_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of listHelper.initialBlogs) {
        let newObject = new Blog(blog)
        await newObject.save()
    }
})

describe('when there is initially blog lists saved', () => {
    test('get all blogs', async () => {
        const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(listHelper.initialBlogs.length)
    })

    test('unique identifier is id', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach((blog) => {
            expect(blog).toBeDefined()
            expect(blog).toHaveProperty('id')
        })
    })
})

describe('addition of new blog', () => {
    test('post blog', async () => {
        const newBlog = {
            title: 'This is a new blog',
            author: 'Muhammad Zhafran Ilham',
            url: 'https://github.com/zhfrann',
            likes: 7
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(listHelper.initialBlogs.length + 1)
    })

    test('set default likes if missing', async () => {
        const newBlog = {
            title: 'New blog with missing likes',
            author: 'Muhammad Zhafran Ilham',
            url: 'https://github.com/zhfrann',
        }

        await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
    })

    test('new blog without url or title is not added', async () => {
        const newBlog = {
            author: 'Muhammad Zhafran Ilham',
            // url: 'https://github.com/zhfrann',
            likes: 4
        }

        await api.post('/api/blogs').send(newBlog).expect(400)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await Blog.find({})
        expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).not.toContain(blogToDelete)
    })
})

describe('updating a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToUpdate = blogsAtStart[0]

        const newUpdateBlog = {
            title: 'This is a new updated blog',
            author: 'Muhammad Zhafran Ilham',
            url: 'https://github.com/zhfrann',
            likes: 9
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newUpdateBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await Blog.find({})
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

        const newUpdatedBlog = blogsAtEnd[0]
        expect(newUpdatedBlog).not.toEqual(blogToUpdate)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})