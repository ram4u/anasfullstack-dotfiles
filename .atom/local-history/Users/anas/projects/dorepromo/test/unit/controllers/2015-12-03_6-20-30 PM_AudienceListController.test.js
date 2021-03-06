var request = require('supertest');
var assert = require('chai').assert;

describe('AudienceListController', function() {
  'use strict';

  describe('#create()', function() {

    it('should create new audience list giving a name', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testName'})
        .end(function(err, res){
          assert.isNull(err, 'error is null');
          assert.equal(res.status, 201, 'res.status equal 201');
          assert.equal(res.body.name, 'testName', 'res.body.name equal testName');
          done();
        });
    });

    it('should create new audience list giving a name, id & campaign', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({_id: 'Loremipsumdolorsitamet', name: 'promoCampaintestName', campaign: 'promoCampain'})
        .end(function(err, res){
          assert.isNull(err, 'error is null');
          assert.equal(res.status, 201, 'res.status equal 201');
          assert.equal(res.body.name, 'promoCampaintestName', 'res.body.name equal promoCampaintestName');
          assert.equal(res.body.campaign, 'promoCampain', 'res.body.campaign equal promoCampain');
          done();
        });
    });

    it('Make sure that List name is required', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400, 'res.status equal 400');
          done();
        });
    });

    it('should make sure a unique list name is required', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testName'})
        .end(function(err, res){
          assert.equal(res.status, 400, 'res.status equal 400');
          done();
        });
    });

    it('should make sure name is more than 5 litters', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'tes'})
        .end(function(err, res){
          assert.equal(res.status, 400, 'res.status equal 400');
          done();
        });
    });

    it('should make sure name is less than 50 litters', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'Lorem ipsum dolor sit amet, consectetur adipiscing sed.'})
        .end(function(err, res){
          assert.equal(res.status, 400, 'res.status equal 400');
          done();
        });
    });
  });

  decribe('#read()', function(){
    it('should return list by id', function(done){
      request(sails.hook.http.app)
      .get('/audiencelist/?id=Loremipsumdolorsitamet')
      .end(function(err, res){
        assert.equal(res.status, 200, 'res.status equal 200');
        assert.isObject(res.body, 'body is object');
        assert.equal(res.body.name, 'promoCampaintestName');
        assert.equal(res.body.campain, 'promoCampain');
        done();
      });
    });
  });
});
