'use strict';
const express = require('express');

const bookmarkRouter = express.Router();
const bodyParser = express.json();
const BOOKMARKS = require('./STORE-bookmarks');
const cuid = require('cuid');

bookmarkRouter
  .route('/')
  .get((req, res) => {
    return res.json(BOOKMARKS);
  });

bookmarkRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    const returnBookmark = BOOKMARKS.filter(bookmark => bookmark.id === id);
    if (!returnBookmark.length) {
      return res
        .status(404)
        .json({ error: { message: 'Item with the given ID does not exist' } });
    }
    else {
      let toReturn = JSON.stringify(returnBookmark);
      console.log(`toReturn is a ${typeof toReturn} with a value of ${toReturn}`)
      toReturn = toReturn.slice(1, toReturn.length - 1);
      console.log(`toReturn is a ${typeof toReturn} with a value of ${toReturn}`)
      toReturn = JSON.parse(toReturn);
      console.log(`toReturn is a ${typeof toReturn} with a value of ${toReturn}`)
      return res.json(toReturn);
    }
  });

bookmarkRouter
  .route('/')
  .post(bodyParser, (req, res) => {

    const { title, description = '', url, rating = 1 } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ error: { message: 'Title is required' } });
    }

    if (!url) {
      return res
        .status(400)
        .json({ error: { message: 'URL is required' } });
    }

    if ((!url.includes('http://')) && (!url.includes('https://'))) {
      return res
        .status(400)
        .json({ error: { message: 'URL must contain http:// or https://' } });
    }

    const newBookmark = {
      id: cuid(),
      title,
      description,
      url,
      rating
    };

    BOOKMARKS.push(newBookmark);

    return res
      .status(201)
      .json(newBookmark);


  });

bookmarkRouter
  .route('/:id')
  .delete((req, res) => {
    const { id } = req.params;
    const deleteIndex = BOOKMARKS.findIndex(bookmark => bookmark.id === id);
    if (deleteIndex < 0) {
      return res
        .status(404)
        .json({ error: { message: 'Item with the given ID does not exist' } });
    }

    BOOKMARKS.splice(deleteIndex, 1);

    return res
      .status(202)
      .json({ message: 'Item successfully deleted' });
  });

module.exports = bookmarkRouter;