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
        return res.send({
          message: info.message,
          user: user
        });
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

  callback: function(req, res) {
    var action = req.param('action');

    function negotiateError(err) {
      if (action === 'register') {
        res.redirect('/register');
      } else if (action === 'login') {
        res.redirect('/login');
      } else if (action === 'disconnect') {
        res.redirect('back');
      } else {
        res.forbidden(err);
      }
    }

    sails.services.passport.callback(req, res, function(err, user) {
      if (err || !user) {
        sails.log.warn(user, err);
        return negotiateError(err);
      }

      req.login(user, function(err) {
        if (err) {
          sails.log.warn(err);
          return negotiateError(err);
        }

        req.session.authenticated = true;

        if (req.query.next) {
          var url = sails.services.authservice.buildCallbackNextUrl(req);
          res.status(302).set('Location', url);
        }

        sails.log.info('user', user, 'authenticated successfully');
        return res.json(user);
      });
    });
  },

  /**
   * Disconnect a passport from a user
   *
   * @param {Object} req
   * @param {Object} res
   */
  disconnect: function(req, res) {
    sails.services.passport.disconnect(req, res);
  }

  logout: function(req, res) {
      req.logout();
      delete req.user;
      delete req.session.passport;
      req.session.authenticated = false;

      if (!req.isSocket) {
        res.redirect(req.query.next || '/');
      } else {
        res.ok();
      }
    },
};
