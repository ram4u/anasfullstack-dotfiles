module.exports = {

  connections : {
       mongo: {
         adapter : 'sails-mongo',
         host    : 'localhost',
         port    : 27017,
         user    : 'dorepromoadmin',
         password: 'dorepromopassword',
         database: 'dorepromo'
      },
  },

  models: {
    connection: 'mongo'
  }

};