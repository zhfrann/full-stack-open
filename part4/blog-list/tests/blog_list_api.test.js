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
}, 100000)

test('new blog without url or title is not added', () => {
    const newBlog = {
        author: 'Muhammad Zhafran Ilham',
        // url: 'https://github.com/zhfrann',
        likes: 4
    }

    return api.post('/api/blogs').send(newBlog).expect(400)
})

afterAll(async () => {
    await mongoose.connection.close()
})