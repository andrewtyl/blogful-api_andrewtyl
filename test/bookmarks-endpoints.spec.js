const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmarks.fixtures')

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
    it(`responds with a 501 error`, () => {
        return supertest(app)
            .post('/bookmarks')
            .expect(501)
    })
})

describe(`Delete /bookmarks/:id`, () => {
    it(`responds with a 501 error`, () => {
        return supertest(app)
            .delete(`/bookmarks/8`)
            .expect(501)
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
})