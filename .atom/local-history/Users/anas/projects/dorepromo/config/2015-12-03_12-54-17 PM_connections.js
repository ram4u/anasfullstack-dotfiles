

module.exports.connections = {

  localDiskDb: {
    adapter: 'sails-disk'
  },

  someMongodbServer: {
    adapter : 'sails-mongo',
    host    : 'localhost',
    port    : 27017,
    user    : 'dorepromoadmin',
    password: 'dorepromopassword',
    database: 'dorepromo'
  }
};
