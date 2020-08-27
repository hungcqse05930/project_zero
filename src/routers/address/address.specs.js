const express = require('express')
const Sequelize = require('sequelize')
const supertest = require('supertest')
const sequelize = new Sequelize('sqlite::memory:')
const { createAddressModel } = require('../../models/address')
const { createAddressRouter } = require('./index')
const { expect } = require('chai')

const mockAddresses = [
    {
        user_id: 1,
        province: 'province',
        district: 'district',
        ward: 'ward',
        address: 'address',
    },
    {
        user_id: 1,
        province: 'province1',
        district: 'district1',
        ward: 'ward1',
        address: 'address1',
    }
]

let app
beforeEach(async () => {
    app = express()
    const Address = createAddressModel(sequelize)
    await Address.sync({ force: true })

    // Import mock data
    await Promise.all(mockAddresses.map(address => Address.create(address)))

    app.use('/address', createAddressRouter({ Address }))
})

describe('GET /id/:id test cases', () => {
    it('Response 404 for NOT exists userId', (done) => {
        supertest(app)
            .get('/address/id/404')
            .expect(404, done)
    })

    it('Response 200 for EXISTS userId', (done) => {
        supertest(app)
            .get('/address/id/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                const addresses = res.body

                const correctCount = mockAddresses.filter(val => val.user_id === 1).length
                expect(addresses).to.be.an('Array').with.lengthOf(correctCount)

                done()
            })
    })
})

describe('GET /province', () => {
    it('Response 404 for NOT exists province', (done) => {
        supertest(app)
            .get('/address/province/404')
            .expect(404, done)
    })

    it('Response 300 for Multiple Choice province', (done) => {
        supertest(app)
            .get('/address/province')
            //.expect('Content-Type', /json/)
            .expect(200, done)
    })

    it('Response 302 for Found province', (done) => {
        supertest(app)
            .get('/address/province')
            //.expect('Content-Type', /json/)
            .expect(200, done)
    })

    it('Response 306 for unused province', (done) => {
        supertest(app)
            .get('/address/province')
            //.expect('Content-Type', /json/)
            .expect(200, done)
    })

})

describe('Delete /user/:id test cases', () => {
    it('Delete nonexistent ID should return error: id not found', (done) => {
        supertest(app)
            .delete('/address/user/404')
            .expect(404, done)
            .expect('{"error":"no todo found with that id"}')
    })

    it('Response 204 for Delete exists address', (done) => {
        supertest(app)
            .delete('/address/user/1')
            .expect(204, done)
    })
})

describe('Post / test case ', () => {
    let address = {
        "user_id": "111",
        "province": "1111",
        "district": "22222",
        "ward": "33333",
        "address": "4444",
    }
    it('Response 200 for create new address', (done) => {
        supertest(app)
            .post('/')
            .send(address)
            .expect(200, done)
    })
})

