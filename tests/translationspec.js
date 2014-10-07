var app = require('../server.js');

var should = require('should');
var supertest = require('supertest');

describe('Request-1', function () {

  it('should return all valid translation requests',
  function (done) {

    supertest(app)
    .get('/v2.0/translation/')
    .expect(200)
    .end(function (err, res) {
      res.status.should.equal(200);
      done(); //It is typically the case when working with promises that its best to end the chain by calling a method like this.
    });

  });

  it('should return error due to bad request ',
  function (done) {

    supertest(app)
    .get('/translation2/')
    .expect(404)
    .end(function (err, res) {
      res.status.should.equal(404);
      done();
    });
  });
});

describe('Request-2', function () {

  it('should return specific request',
  function (done) {

    supertest(app)
    .get('/v2.0/translation/543343bb2218ebfbed000001')
    .expect(200)
    .end(function (err, res) {
      res.status.should.equal(200);
      done();
    });

  });

  it('should return error due to incorrect id ',
  function (done) {

    supertest(app)
    .get('/v2.0/translation/12121212')
    .expect(404)
    .end(function (err, res) {
      res.status.should.equal(404);
      done();
    });
  });
});

describe('Request-3', function () {

  it('should accept the specific translation request',
  function (done) {

    supertest(app)
    .put('/v2.0/accept/543343bb2218ebfbed000001')
    .expect(200)
    .end(function (err, res) {
      res.status.should.equal(200);
      res.body.message.should.not.equal(undefined);
      done();
    });

  });

  it('should return error due to incorrect id',
  function (done) {

    supertest(app)
    .put('/v2.0/accept/12121212')
    .expect(404)
    .end(function (err, res) {
      res.status.should.equal(404);
      res.body.message.should.not.equal(undefined);
      done();
    });

  });

});
