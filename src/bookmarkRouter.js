'use strict';
const express = require('express');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const BookmarksService = require('./bookmarks-service')
const xss = require('xss')
const path = require('path')

function sanatizeAllBookmarks(inputedBookmarks) {
  let bookmarksToReturn;
  bookmarksToReturn = [];
  for (let i = 0; i < inputedBookmarks.length; i++) {
    let thisBookmark = inputedBookmarks[i]
    let thisBookmarkSanitized = thisBookmark
    thisBookmarkSanitized.title = xss(thisBookmarkSanitized.title)
    thisBookmarkSanitized.description = xss(thisBookmarkSanitized.description)
    thisBookmarkSanitized.url = xss(thisBookmarkSanitized.url)
    bookmarksToReturn.push(thisBookmarkSanitized)
  }
  return bookmarksToReturn;
}

function sanatizeOneBookmark(inputedBookmark) {
  let bookmarkToReturn = {
    id: inputedBookmark.id,
    title: xss(inputedBookmark.title),
    url: xss(inputedBookmark.url),
    rating: inputedBookmark.rating,
    description: xss(inputedBookmark.description)
  };
  return bookmarkToReturn;
}

bookmarkRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db2')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        const sanatizedBookmarks = sanatizeAllBookmarks(bookmarks)
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
    newBookmark = sanatizeOneBookmark(newBookmark)

    BookmarksService.addBookmark(
      req.app.get('db2'),
      newBookmark
    )

      .then(bookmark => {
        res
          .status(201)
          .location(path.posix.join(req.originalURL + `/${bookmark.id}`))
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
    const toReturn = sanatizeOneBookmark(res.bookmark)
    res.json(toReturn)
  })
  .delete((req, res, next) => {
    BookmarksService.deleteBookmark(
      req.app.get('db2'),
      req.params.id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = bookmarkRouter;