/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 */
var passport = require('passport');
var Facebook = require('machinepack-facebook');

var facebookAuth;
var twitterAuth;
var facebookCallback;

if (process.env.FACEBOOK_AUTH) {
  facebookAuth = JSON.parse(process.env.FACEBOOK_AUTH);
} else {
  facebookAuth = require('./local.js').socialIds.facebook;
}

if (process.env.BASE_URL) {
  facebookCallback = process.env.BASE_URL + '/login/facebook/callback';
} else {
  facebookCallback = require('./local.js').baseUrl + '/login/facebook/callback';
}

if (process.env.TWITTER_AUTH) {
  twitterAuth = JSON.parse(process.env.TWITTER_AUTH);
} else {
  twitterAuth = require('./local.js').socialIds.twitter;
}

module.exports = {

  emailLogin: function(req, res) {
    'use strict';
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        sails.log.error(info.message);
        return res.forbidden();
      }

      req.logIn(user, function(err) {
        if (err) {
          sails.log.error(err);
          res.serverError();
        }

        req.session.authenticated = true;
        req.session.userId = user.id;

        sails.log.debug('emailLogin req session', req.session);
        sails.log.info('user', user.email, 'authenticated successfully');

        return res.send({
          message: info.message,
          user: user
        });
      });
    })(req, res);
  },

  facebookLogin: function(req, res) {
    Facebook.getLoginUrl({
      appId: facebookAuth.clientID,
      callbackUrl: callbackUrl,
      permissions: ['public_profile']
    }).exec({
      error: function(err) { },

      success: function(result) {
        return res.redirect(result);
      }
    });
  },
  // facebookLogin: function(req, res) {
  //   'use strict';
  //   passport.authenticate('facebook', function(err, user, info) {
  //     if ((err) || (!user)) {
  //       sails.log.error(info.message);
  //       return res.forbidden();
  //     }
  //
  //     req.logIn(user, function(err) {
  //       if (err) {
  //         sails.log.error(err);
  //         res.serverError();
  //       }
  //
  //       req.session.authenticated = true;
  //       req.session.userId = user.id;
  //
  //       sails.log.info('user', user.id, 'authenticated successfully');
  //
  //       return res.send({
  //         message: info.message,
  //         user: user
  //       });
  //     });
  //   });
  // },
  //
  // 'facebookCallback': function(req, res, next) {
  //   'use strict';
  //   passport.authenticate('facebook',
  //     function(req, res) {
  //       sails.log.info('user', req.user.id, 'authenticated successfully');
  //       res.ok('user', req.user.id, 'authenticated successfully');
  //     })(req, res, next);
  // },

  logout: function(req, res) {
    'use strict';
    req.logout();
    delete req.user;
    delete req.session.passport;
    req.session.authenticated = false;

    res.ok('Log out successfully!!');
  }

};
