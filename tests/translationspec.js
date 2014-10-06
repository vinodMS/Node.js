var app = require('../server.js');

var should = require('should');
var supertest = require('supertest');

describe('translations', function () {

  it('should return all valid translation request',
  function (done) {

    supertest(app)
    .get('/translation/')
    .expect(200)
    .end(function (err, res) {
      res.status.should.equal(404);
      done();
    });

  });

  /**it('should return all valid translation request',
  function (done) {

    supertest(app)
    .get('/translation/')
    .expect(404)
    .end(function (err, res) {
      res.status.should.equal(404);
      done();
    });
  });*/
});
