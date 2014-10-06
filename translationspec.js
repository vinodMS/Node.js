var app = require('./server');

var should = require('should');
var supertest = require('supertest');

describe('translations', function () {

  it('should return all valid translation request',
  function (done) {

    supertest(app)
    .get('/translation/')
    .expect(201)
    .end(function (err, res) {
      res.status.should.equal(200);
      done();
    });

  });

  /*it('should not pass', function (done) {
    throw "Don't pass";
    done();
  });*/
});
