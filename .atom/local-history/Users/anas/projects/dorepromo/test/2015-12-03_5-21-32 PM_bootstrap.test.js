var Sails = require('sails'),
  sails;

before(function(done) {
  'use strict';
  this.timeout(5000);

  Sails.lift({
      models: {
        connection: 'mongo',
        migrate: 'drop'
      }
    },
    function(err, server) {
      sails = server;
      if (err) {
        return done(err);
      }

      done(err, sails);
    });
});

after(function(done){
  'use strict';
  console.log();
  Sails.lower(done);
});