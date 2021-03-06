/**
 * User.js
 *
 * @description :: User Model
 */
var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      minLength: 6
    },

    facebookId: {
      type: 'string',
      unique: true
    },

    emailVerified: {
      type: 'boolean',
      default: false
    },

    isDeleted: {
      type: 'boolean',
      default: false
    },

    //overridig the default to json function
    toJSON: function() {
      'use strict';
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeCreate: function(user, cb) {
    'use strict';

    if (!user.password) {cb();}

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          sails.log.error(err);
          cb(err);
        } else {
          user.password = hash;
          cb();
        }
      });
    });
  },
  beforeUpdate: function(user, cb) {
    'use strict';
    if (!user.password) {cb();}

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) {
          sails.log.error(err);
          cb(err);
        }

        bcrypt.hash(user.newPassword, salt, function(err, crypted) {
          if (err) return cb(err);

          delete user.newPassword;
          user.password = crypted;
          return cb();
        });
      });

  }
};
