/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 */
/*globals User*/
var passport = require('passport');
var Facebook = require('machinepack-facebook');

var facebookAuth;
var twitterAuth;
var googleAuth;

if (process.env.FACEBOOK_AUTH) {
  facebookAuth = JSON.parse(process.env.FACEBOOK_AUTH);
} else {
  facebookAuth = require('../../config/local.js').socialIds.facebook;
}

if (process.env.GOOGLE_AUTH) {
  googleAuth = JSON.parse(process.env.GOOGLE_AUTH);
} else {
  googleAuth = require('../../config/local.js').socialIds.google;
}

if (process.env.TWITTER_AUTH) {
  twitterAuth = JSON.parse(process.env.TWITTER_AUTH);
} else {
  twitterAuth = require('../../config/local.js').socialIds.twitter;
}
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

  facebookLogin: function(req, res) {
    'use strict';

    Facebook.getLoginUrl({
      appId: facebookAuth.clientID,
      callbackUrl: sails.config.appsettings.BASE_URL + '/login/facebook/callback',
      permissions: ['public_profile', 'email']
    }).exec({

      error: function(err) {
        sails.log.error(err);
        return res.serverError(err);
      },

      success: function(result) {
        sails.log.info('facebook Login Success ', result);
        return res.redirect(result);
      }
    });
  },

  facebookCallback: function(req, res) {
    'use strict';

    var params = req.params.all();

    Facebook.getAccessToken({
      appId: facebookAuth.clientID,
      appSecret: facebookAuth.clientSecret,
      code: params.code,
      callbackUrl: sails.config.appsettings.BASE_URL + '/login/facebook/callback'
    }).exec({

      error: function(err) {
        sails.log.error(err);
        return res.serverError(err);
      },

      success: function(result) {
        var token = result.token;

        Facebook.getUserByAccessToken({
          accessToken: token
        }).exec({

          error: function(err) {
            sails.log.error(err);
            return res.serverError(err);
          },

          success: function(result) {
            console.log(result);
            User.findOne({
              or: [{
                facebookId: result.id
              }, {
                email: result.email
              }]
            }).exec(function(err, user) {
              if (user) {
                var criteria = {
                  lastLoggedIn: Date(Date.now())
                };
                User.update(user, criteria, function(err, loggedInUser) {

                  if (err) {
                    sails.log.error(err);
                    return res.serverError(err);
                  }

                  req.logIn(user, function(err) {

                    if (err) {
                      sails.log.error(err);
                      return res.serverError(err);
                    }

                    return res.json(loggedInUser);
                  });

                });
              } else {
                var newUser = {
                  facebookId: result.id ,
                  email: result.email || undefined,
                  firstName: result.first_name || undefined,
                  gender: result.gender || undefined,
                  lastName: result.last_name || undefined ,
                  link: result.link || undefined,
                  locale: result.locale || undefined,
                  name: result.name || undefined,
                  timezone: result.timezone || undefined
                };

                User.create(newUser, function(err, newUserResult){
                  
                })
              }
            });
          }

        });
      }
    });
  },

  logout: function(req, res) {
    'use strict';
    req.logout();
    res.redirect('/');
  }
};
