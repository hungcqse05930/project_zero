const auth = require('./auth')
const supertest = require('supertest')
const express = require('express')
const jwt = require('jsonwebtoken')
const { expect } = require('chai')

const JWT_SECRET = 'RANDOM_TOKEN_SECRET'

const app = express()
app.use(auth)
app.all('*', (req, res) => res.sendStatus(200))

describe('All tests', () => {
    it('Should response with 401 for request with NO `authorization` header', (done) => {
        supertest(app)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(401, done)
    })

    it('Should response with 401 for request with INVALID `authorization` header', (done) => {
        supertest(app)
            .get('/')
            .set('authorization', 'INVALID-authorization')
            .expect('Content-Type', /json/)
            .expect(401, done)
    })

    it('Should response with 200 for request with EMPTY `authorization` header', (done) => {
        jwt.sign({}, JWT_SECRET, (err, token) => {
            expect(err).to.be.null
            supertest(app)
                .get('/')
                .set('authorization', `bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(401, done)
        })
    })

    it('Should response with 200 for request with VALID `authorization` header', (done) => {
        jwt.sign({ userId: 1 }, JWT_SECRET, (err, token) => {
            expect(err).to.be.null
            supertest(app)
                .get('/')
                .set('authorization', `bearer ${token}`)
                .expect(200, done)
        })
    })
})
