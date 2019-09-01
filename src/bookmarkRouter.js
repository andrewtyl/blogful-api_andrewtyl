'use strict';
const express = require('express');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const BookmarksService = require('./bookmarks-service')
const xss = require('xss')

function sanatizeBookmarks(inputedBookmarks) {
  let bookmarksToReturn;
  if (typeof inputedBookmarks === "object") {
    bookmarksToReturn = inputedBookmarks;
    inputedBookmarks.title = xss(inputedBookmarks.title)
    inputedBookmarks.description = xss(inputedBookmarks.description)
  }
  else {
    bookmarksToReturn = [];
    for (let i = 0; i < inputedBookmarks.length; i++) {
      let thisBookmark = inputedBookmarks[i]
      let thisBookmarkSanitized = thisBookmark
      thisBookmarkSanitized.title = xss(thisBookmarkSanitized.title)
      thisBookmarkSanitized.description = xss(thisBookmarkSanitized.description)
      bookmarksToReturn.push(thisBookmarkSanitized)
    }
  }
  return bookmarksToReturn;
}

bookmarkRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db2')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        const sanatizedBookmarks = sanatizeBookmarks(bookmarks)
        res.json(sanatizedBookmarks)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res) => {
    return res
      .status(501)
      .json('Feature not implimented yet')
  })

bookmarkRouter
  .route('/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db2')
    BookmarksService.getById(knexInstance, id)
      .then(bookmark => {
        if (bookmark) {
          res.bookmark = bookmark
          next()
        }
        else {
          res.status(404)
          res.json('Bookmark ID does not exist.')
        }
      })
      .catch(next)
  })
  .get((req, res, next) => {
    const toReturn = sanatizeBookmarks(res.bookmark)
    res.json(toReturn)
  })
  .delete((req, res) => {
    res.status(501).json('Feature not implimented yet')
  })

module.exports = bookmarkRouter;