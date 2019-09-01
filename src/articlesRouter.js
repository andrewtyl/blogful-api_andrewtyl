'use strict';
const express = require('express');
const articleRouter = express.Router();
const jsonParser = express.json();
const ArticlesService = require('./articles-service')
const xss = require('xss')

const serializeArticle = article => ({
    id: article.id,
    style: article.style,
    title: xss(article.title),
    content: xss(article.content),
    date_published: article.date_published,
  })

articleRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db1')
        ArticlesService.getAllArticles(knexInstance)
            .then(articles => {
                let articlesToReturn = [];
                for (let i = 0; i < articles.length; i++) {
                    let thisArticle = articles[i]
                    let thisArticleSanitized = thisArticle
                    thisArticleSanitized.title = xss(thisArticleSanitized.title)
                    thisArticleSanitized.content = xss(thisArticleSanitized.content)
                    articlesToReturn.push(thisArticleSanitized)
                }
                res.json(articlesToReturn)
            })
            .catch(next)
    })

articleRouter
    .route('/:article_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db1')
        ArticlesService.getById(knexInstance, req.params.article_id)
            .then(article => {
                if (!article) {
                    return res.status(404).json({
                        error: { message: `Article doesn't exist` }
                    })
                }
                else {
                    res.article = article
                    next()
                }
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeArticle(res.article))
    })
    .delete((req, res, next) => {
        ArticlesService.deleteArticle(
            req.app.get('db1'),
            req.params.article_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

articleRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        let { title, content, style } = req.body
        let newArticle = { title, content, style }

        for (const [key, value] of Object.entries(newArticle)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        newArticle.title = xss(newArticle.title)
        newArticle.content = xss(newArticle.content)

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