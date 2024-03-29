require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const winston = require('winston')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()
const ArticlesService = require('./articles-service')
const bookmarkRouter = require('./bookmarkRouter');

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'info.log' })
    ]
});

if (NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

app.use(function validateBearerToken(req, res, next) {
    if (process.env.SKIP_AUTH === false) {
        const apiToken = process.env.API_KEY;
        const authToken = req.get('Authorization');

        if (!authToken || authToken.split(' ')[1] !== apiToken) {
            logger.error(`Unauthorized request to path: ${req.path}`);
            return res.status(401).json({ error: 'Unauthorized request' });
        }
    }

    next();
});

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

app.use('/bookmarks', bookmarkRouter);

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.get('/articles', (req, res, next) => {
    const knexInstance = req.app.get('db1')
    ArticlesService.getAllArticles(knexInstance)
        .then(articles => {
            res.json(articles)
        })
        .catch(next)
})

app.get('/articles/:article_id', (req, res, next) => {
    const knexInstance = req.app.get('db1')
    ArticlesService.getById(knexInstance, req.params.article_id)
        .then(article => {
            if (!article) {
                return res.status(404).json({
                    error: { message: `Article doesn't exist` }
                })
            }
            else {
                res.json(article)
            }
        })
        .catch(next)
})

module.exports = app