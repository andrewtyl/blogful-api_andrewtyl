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
  .post(bodyParser, (req, res, next) => {
    let { title, description, url, rating } = req.body
    let newBookmark = { title, description, url, rating }

    if (!(title) || !(url) || !(rating)) {
      return res.status(400).json({
        error: { message: `Title, url, and rating are requried.` }
      })
    }

    if (!(typeof newBookmark.title === "string")) {
      return res.status(400).json({
        error: { message: `The title field must be a string.` }
      })
    }

    if (!(typeof newBookmark.description === "string")) {
      return res.status(400).json({
        error: { message: `The description field must be a string.` }
      })
    }

    if (!(typeof newBookmark.url === "string")) {
      return res.status(400).json({
        error: { message: `The url field must be a string.` }
      })
    }

    if ((!(newBookmark.url.slice(0, 7) === "http://")) && ((!(newBookmark.url.slice(0, 8) === "https://")))) {
      return res.status(400).json({
        error: { message: `URL must begin with 'http://' or 'https://'` }
      })
    }

    if (!(typeof newBookmark.rating === "number") || (newBookmark.rating >= 6) || (newBookmark.rating < 1)) {
      return res.status(400).json({
        error: { message: `Rating must be a number between 1 and 5` }
      })
    }

    newBookmark.rating = Math.floor(newBookmark.rating)
    newBookmark.title = xss(newBookmark.title);
    newBookmark.description = xss(newBookmark.description);
    newBookmark.url = xss(newBookmark.url)

    BookmarksService.addBookmark(
      req.app.get('db2'),
      newBookmark
    )

      .then(bookmark => {
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(bookmark)
      })
      .catch(next)

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