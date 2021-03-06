/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 */
var passport = require('passport');

module.exports = {
  emailLogin: function(req, res) {
    'use strict';
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        return res.forbidden(info.message);
      }
      req.logIn(user, function(err) {
        if (err) {
          res.send(err);
        }
        return res.send({
          message: info.message,
          user: user
        });
      });
    })(req, res);
  },

  logout: function(req, res) {
    'use strict';
    req.logout();
    res.redirect('/');
  }
};
