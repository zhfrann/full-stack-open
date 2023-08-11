const logger = require('./logger')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    const authorization = request.headers.authorization
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
        // request.token = authorization.substring(7)
    }
    next()
}

const userExtractor = (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (decodedToken) {
        request.user = decodedToken.id
    }
    console.log('from middleware, request.user', request.user)
    next()
}

const requestLogger = (request, response, next) => {
    logger.info('------------')
    logger.info('Method:', request.method)
    logger.info('Path:', request.path)
    logger.info('Body:', request.body)
    logger.info('------------')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        // if searching for specific id, but the query string have malformatted mongoDB id
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }

    next(error)
}

module.exports = { tokenExtractor, userExtractor, requestLogger, unknownEndpoint, errorHandler }