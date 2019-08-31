'use strict';
const express = require('express');
const articleRouter = express.Router();
const jsonParser = express.json();
const ArticlesService = require('./articles-service')

articleRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db1')
        ArticlesService.getAllArticles(knexInstance)
            .then(articles => {
                res.json(articles)
            })
            .catch(next)
    })

articleRouter
    .route('/:article_id')
    .get((req, res, next) => {
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

articleRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { title, content, style } = req.body
        const newArticle = { title, content, style }

           for (const [key, value] of Object.entries(newArticle)) {
             if (value == null) {
               return res.status(400).json({
                 error: { message: `Missing '${key}' in request body` }
               })
             }
           }

        ArticlesService.insertArticle(
            req.app.get('db1'),
            newArticle
        )
            .then(article => {
                res
                    .status(201)
                    .location(`/articles/${article.id}`)
                    .json(article)
            })
            .catch(next)
    })

module.exports = articleRouter;