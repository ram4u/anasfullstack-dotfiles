var request = require('supertest');

describe('AudienceListController', function(){
  describe('#create()', funcion(){
    it('should create new audience list', function(done){
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testList'})
        .expect(302);
    });
  });
})
