var app = require('../server.js');

var should = require('should');
var supertest = require('supertest');

/*
//checking translation POST method
//------------------------------------------------------------//

describe('Request-1', function () {

  it('should create a new translation request',
  function (done) {

    supertest(app)
    .post('/v2.0/translation/')
    .expect(201)
    .end(function (err, res) {
      res.status.should.equal(201);
      res.body.should.not.equal(undefined);
      done(); //It is typically the case when working with promises that its best to end the chain by calling a method like this.
    });

  });

  it('should return error due to bad translation creation request ',
  function (done) {

    supertest(app)
    .post('/v2.0/translation2/')
    .expect(404)
    .end(function (err, res) {
      res.status.should.equal(404);
      done();
    });
  });
});



//checking translation GET method
//------------------------------------------------------------//

describe('Request-2', function () {

  it('should return all valid translation requests',
  function (done) {

    supertest(app)
    .get('/v2.0/translation/')
    .expect(200)
    .end(function (err, res) {
      res.status.should.equal(200);
      res.body.should.not.equal(undefined);
      done(); //It is typically the case when working with promises that its best to end the chain by calling a method like this.
    });

  });

  it('should return error due to bad request ',
  function (done) {

    supertest(app)
    .get('/v2.0/translation2/')
    .expect(404)
    .end(function (err, res) {
      res.status.should.equal(404);
      done();
    });
  });
});


//checking translation/id GET method
//------------------------------------------------------------//

describe('Request-3', function () {

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

//checking translation/id PUT method
//------------------------------------------------------------//

describe('Request-4', function () {

  it('should return specific request',
  function (done) {

    supertest(app)
    .put('/v2.0/translation/543343bb2218ebfbed000001')
    .expect(200)
    .end(function (err, res) {
      res.status.should.equal(200);
      done();
    });

  });

  it('should return error due to incorrect or invalid id ',
  function (done) {

    supertest(app)
    .put('/v2.0/translation/12121212')
    .expect(404)
    .end(function (err, res) {
      res.status.should.equal(404);
      done();
    });
  });
});

//checking translation/id Delete method
//------------------------------------------------------------//

describe('Request-5', function () {

  it('should delete the specific translation request',
  function (done) {

    supertest(app)
    .delete('/v2.0/translation/5433eebde4b0ec35a8b78a07')
    .expect(204)
    .end(function (err, res) {
      res.status.should.equal(204);
      done();
    });

  });

  it('should return error due to incorrect id',
  function (done) {

    supertest(app)
    .delete('/v2.0/translation/12121212')
    .expect(404)
    .end(function (err, res) {
      res.status.should.equal(404);
      res.body.should.not.equal(undefined);
      done();
    });

  });

});


//checking accept/id PUT method
//------------------------------------------------------------//

describe('Request-6', function () {

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

});*/
