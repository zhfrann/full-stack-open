const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    return response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = { username, name, passwordHash }

    const user = new User( newUser )

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter