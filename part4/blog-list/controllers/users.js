const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    return response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !password) {
        return response.status(400).json({ error: 'Username or password missing' })
    }

    if (username.length < 3 || password.length < 3) {
        return response.status(400).json({ error: 'username and password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = { username, name, passwordHash }

    const user = new User(newUser)

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter