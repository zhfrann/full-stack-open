const mongoose = require('mongoose')
const listHelper = require('../utils/blog_list_api_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

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
    test.only('post blog', async () => {
        const newBlog = {
            title: 'This is a new blog',
            author: 'Muhammad Zhafran Ilham',
            url: 'https://github.com/zhfrann',
            likes: 7
        }

        // const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpoZnJhbiIsImlkIjoiNjRiMTExM2NhYTFiMzRkMmQ1NGMxODdjIiwiaWF0IjoxNjg5NjY5NjgwLCJleHAiOjE2ODk2NzMyODB9.zRYjKJFXYdeujqUfgTVGZapCm9d5g72uMsXefPn_YTE'

        await api.post('/api/blogs')
            // .auth(token, { type: 'bearer' })
            // .set('Authorization', `bearer ${token}`)
            // .set({ Authorization: `${token}` })
            .send(newBlog)
            .expect((res) => {
                console.log('res.headers', res.headers)
                console.log('res.body', res.body)
                console.log('res.req._header', res.req._header)
            })
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(listHelper.initialBlogs.length + 1)
    }, 100000)

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

describe('addtion of new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        await User.insertMany(listHelper.initialUsers)
    })

    test('new user with missing username or password is not added', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'johndoe',
            name: 'John Doe',
        }

        const savedUser = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(savedUser.body.error).toBe('Username or password missing')

        const usersAtEnd = await User.find({})

        expect(usersAtStart).toHaveLength(usersAtEnd.length)
    })

    test('new user with invalid username or password is not added', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'johndoe',
            name: 'John Doe',
            password: 'aa'
        }

        const savedUser = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(savedUser.body.error).toBe('username and password must be at least 3 characters long')

        const usersAtEnd = await User.find({})

        expect(usersAtStart).toHaveLength(usersAtEnd.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})