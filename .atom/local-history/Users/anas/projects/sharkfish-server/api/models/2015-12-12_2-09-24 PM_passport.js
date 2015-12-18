var bcrypt = require('bcryptjs');

function hashPassword(passport, next) {
  var config = sails.config.auth.bcrypt;
  var salt = config.salt || config.rounds;
  if (passport.password) {
    bcrypt.hash(passport.password, salt, function(err, hash) {
      if (err) {
        delete passport.password;
        sails.log.error(err);
        throw err;
      }
      passport.password = hash;
      next(null, passport);
    });
  } else {
    next(null, passport);
  }
}

var Passport = {
  attributes: {
    
    protocol: {type: 'alphanumeric', required: true},

    // Local field: Password
    //
    // When the local strategy is employed, a password will be used as the
    // means of authentication along with either a username or an email.
    password: {type: 'string', minLength: 8},

    // Provider fields: Provider, identifer and tokens
    //
    // "provider" is the name of the third-party auth service in all lowercase
    // (e.g. 'github', 'facebook') whereas "identifier" is a provider-specific
    // key, typically an ID. These two fields are used as the main means of
    // identifying a passport and tying it to a local user.
    //
    // The "tokens" field is a JSON object used in the case of the OAuth stan-
    // dards. When using OAuth 1.0, a `token` as well as a `tokenSecret` will
    // be issued by the provider. In the case of OAuth 2.0, an `accessToken`
    // and a `refreshToken` will be issued.
    provider: {type: 'alphanumericdashed'},
    identifier: {type: 'string'},
    tokens: {type: 'json'},

    // Associations
    //
    // Associate every passport with one, and only one, user. This requires an
    // adapter compatible with associations.
    //
    // For more information on associations in Waterline, check out:
    // https://github.com/balderdashy/waterline
    user: {model: 'User', required: true},

    /**
     * Validate password used by the local strategy.
     *
     * @param {string}   password The password to validate
     * @param {Function} next
     */
    validatePassword: function(password, next) {
      bcrypt.compare(password, this.password, next);
    }

  },

  /**
   * Callback to be run before creating a Passport.
   *
   * @param {Object}   passport The soon-to-be-created Passport
   * @param {Function} next
   */
  beforeCreate: function(passport, next) {
    hashPassword(passport, next);
  },

  /**
   * Callback to be run before updating a Passport.
   *
   * @param {Object}   passport Values to be updated
   * @param {Function} next
   */
  beforeUpdate: function(passport, next) {
    hashPassword(passport, next);
  }
};

module.exports = Passport;