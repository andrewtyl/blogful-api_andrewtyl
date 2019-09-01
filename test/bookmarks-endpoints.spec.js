const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray, makeMaliciousBookmarksArray } = require('./bookmarks.fixtures')
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

let db

before('make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL2
    })
    app.set('db2', db)
})

before('clean the table', () => db('bookmarks').truncate())

afterEach('cleanup', () => db('bookmarks').truncate())

after('disconnect from db', () => db.destroy())

describe(`POST /bookmarks`, () => {
    context('Given all requirements are met for the new bookmark')
})

describe(`Delete /bookmarks/:id`, () => {
    context('Given the bookmark ID exists', () => {
        const testBookmarks = makeBookmarksArray()

        beforeEach('insert bookmarks', () => {
            return db
                .into('bookmarks')
                .insert(testBookmarks)
        })

        it(`responds with a 501 error`, () => {
            return supertest(app)
                .delete(`/bookmarks/1`)
                .expect(501)
        })
    })

    context('Given the bookmark ID does not exist', () => {
        it(`responds with a 404 error`, () => {
            return supertest(app)
                .delete(`/bookmarks/1`)
                .expect(404)
        })
    })
})

describe(`GET /bookmarks`, () => {
    context('Given there are bookmarks in the database', () => {
        const testBookmarks = makeBookmarksArray()

        beforeEach('insert bookmarks', () => {
            return db
                .into('bookmarks')
                .insert(testBookmarks)
        })

        it('responds with 200 and all articles in the database', () => {
            return supertest(app)
                .get('/bookmarks')
                .expect(200, testBookmarks)
        })
    })

    context('Given no bookmarks', () => {
        it('responds with 200 and an empty list', () => {
            return supertest(app)
                .get('/articles')
                .expect(200, [])
        })
    })

    context('Given there are bookmarks in the database and there is malicious code in one or more of them', () => {
        const testBookmarks = makeMaliciousBookmarksArray()
        const sanitizedTestBookmarks = sanatizeBookmarks(testBookmarks)

        beforeEach('insert bookmarks including malicious bookmark', () => {
            return db
                .into('bookmarks')
                .insert(testBookmarks)
        })

        it('removes xss attack content', () => {
            return supertest(app)
                .get(`/bookmarks/`)
                .expect(200)
                .expect(res => {
                    expect(res.body).to.eql(sanitizedTestBookmarks)
                })
        })
    })
})

describe(`GET /bookmarks/:id`, () => {
    context('Given the bookmark exists', () => {
        const testBookmarks = makeBookmarksArray()

        beforeEach('insert bookmarks', () => {
            return db
                .into('bookmarks')
                .insert(testBookmarks)
        })

        it('responds with 200 and the specified bookmark', () => {
            const bookmarkId = 3
            const expectedBookmark = testBookmarks[bookmarkId - 1]
            return supertest(app)
                .get(`/bookmarks/${bookmarkId}`)
                .expect(200, expectedBookmark)
        })

    })
    context('Given the bookmark does not exists', () => {

        it('responds with 200 and the specified bookmark', () => {
            const bookmarkId = 3
            return supertest(app)
                .get(`/bookmarks/${bookmarkId}`)
                .expect(404)
        })

    })

    context('Given the bookmark exists and there is malicious code in it', () => {
        const testBookmarks = makeMaliciousBookmarksArray()
        const maliciousBookmark = testBookmarks[3]
        const sanitizedMaliciousBookmark = sanatizeBookmarks(maliciousBookmark)

        beforeEach('insert bookmarks including malicious bookmark', () => {
            return db
                .into('bookmarks')
                .insert(testBookmarks)
        })

        it('removes xss attack content', () => {
            return supertest(app)
                .get(`/bookmarks/${maliciousBookmark.id}`)
                .expect(200)
                .expect(res => {
                    expect(res.body).to.eql(sanitizedMaliciousBookmark)
                })
        })
    })
})