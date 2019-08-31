'use strict';
const express = require('express');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const cuid = require('cuid');
const BookmarksService = require('./bookmarks-service')
const BOOKMARKS = require('./STORE-bookmarks');

bookmarkRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db2')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks)
      })
      .catch(next)
  });

bookmarkRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db2')
    BookmarksService.getById(knexInstance, id)
      .then(bookmarks => {
        if (bookmarks) {
          res.json(bookmarks)
        }
        else {
          res.status(404)
          res.json('Bookmark ID does not exist.')
        }
      })
      .catch(next)
  });

bookmarkRouter
  .route('/')
  .post(bodyParser, (req, res) => {
    return res
      .status(501)
      .json('Feature not implimented yet')
  });

bookmarkRouter
  .route('/:id')
  .delete((req, res) => {
    return res
      .status(501)
      .json('Feature not implimented yet')
  });

module.exports = bookmarkRouter;