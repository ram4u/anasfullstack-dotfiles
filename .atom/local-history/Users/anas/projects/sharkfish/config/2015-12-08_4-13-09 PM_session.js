module.exports.session = {
  secret: 'b8107e1eacff3a31dc5f467beba839eb',

  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },

  adapter: 'redis',

  host: 'localhost',
  port: 6379,
  ttl: 60 * 60,
  db: 0,
  pass: null,
  prefix: 'sess:'

};
