var request = require('supertest');
var assert = require('chai').assert;

describe('#UserController', function() {
  'use strict';

  describe('create', function() {

    it('should create new user given email and a password', function(done) {
      request(sails.hooks.http.app)
        .post('/user')
        .send({
          email: 'anas@gmail.com',
          password: '123456'
        })
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 201, 'res.status equal to 201');
          assert.equal(res.body.email, 'anas@gmail.com', 'res.body.email equal to anas@gmail.com');
          assert.isNotNull(res.body.id, 'res.body.id is not null');
          assert.isUndefined(res.body.password, 'res.body.password equal to null');
          done();
        });
    });

    it('should create new user given email, password & id', function(done) {
      request(sails.hooks.http.app)
        .post('/user')
        .send({
          email: 'anas.ieee@gmail.com',
          password: '123456',
          _id: 'Loremipsumdolorsitamet'
        })
        .end(function(err, res) {
          sails.log.debug('res', res.body.email);
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 201, 'res.status equal to 201');
          assert.equal(res.body.email, 'anas.ieee@gmail.com', 'res.body.email equal to anas.ieee@gmail.com');
          assert.equal(res.body.id, 'Loremipsumdolorsitamet', 'res.body.id equal to Loremipsumdolorsitamet');
          assert.isUndefined(res.body.password, 'res.body.password equal to null');
          done();
        });
    });

    it('should make sure unique email added', function(done) {
      request(sails.hooks.http.app)
        .post('/user')
        .send({
          email: 'anas.ieee@gmail.com',
          password: '123456'
        })
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 403, 'res.status equal to 403');
          done();
        });
    });

    it('should make sure a real email added', function(done) {
      request(sails.hooks.http.app)
        .post('/user')
        .send({
          email: 'anasl.com',
          password: '123456'
        })
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 403, 'res.status equal to 403');
          done();
        });
    });

    it('should make sure a password is added', function(done) {
      request(sails.hooks.http.app)
        .post('/user')
        .send({
          email: 'anas@gmail.com'
        })
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 400, 'res.status equal to 400');
          done();
        });
    });

    it('should make sure a password length of 6', function(done) {
      request(sails.hooks.http.app)
        .post('/user')
        .send({
          email: 'anas@gmail.com',
          password: '126'
        })
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 403, 'res.status equal to 403');
          done();
        });
    });
  });

  describe('#read()', function() {

    it('should return one user object by id', function(done) {
      request(sails.hooks.http.app)
        .get('/user/?id=Loremipsumdolorsitamet')
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status equal 200');
          assert.isObject(res.body, 'body is object');
          assert.equal(res.body.email, 'anas.ieee@gmail.com', 'res.body.email, should equal to anas.ieee@gmail.com');
          assert.isUndefined(res.body.password, 'res.body.password should be undefined');
          done();
        });
    });

    it('should return error not found for searching not found List', function(done) {
      request(sails.hooks.http.app)
        .get('/user/?id=Loremipsumdolorsitamet2324')
        .end(function(err, res) {
          assert.equal(res.status, 404, 'res.status equal 404');
          done();
        });
    });

    it('should return an array containing all audience lists that exist', function(done) {
      request(sails.hooks.http.app)
        .get('/user')
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status equal 200');
          assert.isArray(res.body, 'res.body is Array');
          assert.equal(res.body.length, 2, 'res.body.length is equal to 2');
          done();
        });
    });
  });

  describe('#update()', function() {

    it('should update audience list name giving id', function(done) {
      request(sails.hooks.http.app)
        .put('/user/?id=Loremipsumdolorsitamet')
        .send({
          name: 'newName',
          location: 'USA'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status equal 200');
          assert.equal(res.body[0].id, 'Loremipsumdolorsitamet', 'res.body[0].id is equal to Loremipsumdolorsitamet');
          assert.equal(res.body[0].name, 'newName', 'res.body[0].name is equal to newName');
          assert.equal(res.body[0].location, 'USA', 'res.body[0].target is equal to USA audience');
          done();
        });
    });

    it('should make sure that there is an id provided', function(done) {
      request(sails.hooks.http.app)
        .put('/user')
        .send({
          name: 'newName'
        })
        .end(function(err, res) {
          assert.equal(res.status, 400, 'res.status equal 400');
          done();
        });
    });
  });

  describe('#delete', function() {

    it('should delete audience list given id', function(done) {
      request(sails.hooks.http.app)
        .delete('/user/?id=Loremipsumdolorsitamet')
        .end(function(err, res) {
          assert.isNull(err, 'error is equal to null');
          assert.equal(res.status, 200, 'res.status is equal to 200');
          assert.equal(res.text, 'User Deleted Successfully!!', 'res.text is equal to User Deleted Successfully!!');
          done();
        });
    });

    it('should make sure that id is provided', function(done) {
      request(sails.hooks.http.app)
        .delete('/user')
        .end(function(err, res) {
          assert.isNull(err, 'error is equal to null');
          assert.equal(res.status, 400, 'res.status is equal to 400');
          done();
        });
    });

    it('should make sure that the audience list is there first', function(done) {
      request(sails.hooks.http.app)
        .delete('/user/?id=Loremipsumdolorsitamet123')
        .end(function(err, res) {
          assert.isNull(err, 'error is equal to null');
          assert.equal(res.status, 404, 'res.status is equal to 404');
          done();
        });
    });
  });

  describe('#forgotPassword', function() {

    it('Should send an email with a token url and insert the token in db', function(done) {
      request(sails.hooks.http.app)
        .post('/forget-my-password')
        .send({
          email: 'anas.ieee@gmial.com'
        })
        .end(function(err, res) {
          assert.isNull(err, 'error is equal to null');
          assert.equal(res.status, 200, 'res.status is equal to 404');
          done();
        });
    });

  });
});
