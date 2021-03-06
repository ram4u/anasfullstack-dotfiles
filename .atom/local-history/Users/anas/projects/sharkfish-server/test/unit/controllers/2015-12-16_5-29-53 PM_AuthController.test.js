var request = require('supertest');
var assert = require('chai').assert;
var agent;

require('./UserController.test.js');

describe('AuthController', function() {
  'use strict';

  describe('emailLogin', function() {
    it('Should log user with a correct user name and password', function(done) {
      agent = request.agent(sails.hooks.http.app);
      agent
        .post('/login/email')
        .send({
          email: 'anas@gmail.com',
          password: '123456'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status is equal to 200');
          done();
        });
    });

    it('Should log user a correct (case insensetive) user name and password', function(done) {
      request(sails.hooks.http.app)
        .post('/login/email')
        .send({
          email: 'Anas@Gmail.com',
          password: '123456'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status is equal to 403');
          done();
        });
    });

    it('Should not log user in with a correct user name and wrong password', function(done) {
      request(sails.hooks.http.app)
        .post('/login/email')
        .send({
          email: 'anas@gmail.com',
          password: '12345we6'
        })
        .end(function(err, res) {
          assert.equal(res.status, 403, 'res.status is equal to 403');
          done();
        });
    });

    it('Should not log user in with a wrong user name or wrong password', function(done) {
      request(sails.hooks.http.app)
        .post('/login/email')
        .send({
          email: 'anas123@gmail.com',
          password: '123456'
        })
        .end(function(err, res) {
          assert.isNull(err, 'err is equal to null');
          assert.equal(res.status, 403, 'res.status is equal to 403');
          done();
        });
    });
  });

  describe('facebookLogin', function() {
    'use strict';
    it('Should redirect to /login/facebook/callback', function(done) {
      request(sails.hooks.http.app)
        .get('/login/facebook')
        .end(function(err, res) {
          assert.isNull(err, 'err is equal to null');
          assert.equal(res.status, 302, 'res.status is equala to 301');
          assert.include(res.headers.location, '/login/facebook/callback',
           'res.headers.location includes /login/facebook/callback');
          done();
        });
    });
  });

  describe('logout', function() {
    'use strict';
    it('Should logout logged in user', function(done) {
      agent
      .get('/logout')
      .end(function(err, res) {
          assert.isNull(err, 'err is equal to null');
          assert.equal(res.status, 200, 'res.status equal to 200');
          done();
        });
    });

    it('should give an error if you tried to logout without login', function(done) {
      agent
        .get('/logout')
        .end(function(err, res) {
          assert.isNull(err, 'err should be null');
          assert.equal(res.status, 403, 'res.status equal 403');
          done();
        });
    });
  });
});
