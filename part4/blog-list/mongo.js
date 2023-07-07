const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')

mongoose.set('strictQuery', false)

logger.info(`connectin to ${config.MONGODB_URI}`)
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to database')
    })
    .catch((error) => {
        logger.error('failed to connect:', error.message)
    })

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)

// fetching database
Blog.find({}).then(blogs => {
    blogs.forEach(blog => {
        logger.info(blog)
        mongoose.connection.close()
    })
})
