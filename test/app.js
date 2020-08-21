const request = require('supertest');
const async = require('async');
const app = require('../app.js');

describe('1 GET /randomURL', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/randomURL')
      .expect(404, done);
  });
});

describe('2 GET /review/1', () => {
    it('Input nonexistent ID should return error: Department not found', (done) => {
      request(app)
        .get('/review/1')
        .expect(200)
        .expect('{"error":"product not found"}')
        .end((err) => {
          if (err) return done(err);
          done();
      });
    });
  });