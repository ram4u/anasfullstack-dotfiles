var passport = require('passport');

module.exports.policies = {
  '*': true,
  UserController: {
      "create": true
   },
  AuthController: {
    '*': [
      // Initialize Passport
      passport.initialize(),

      // Use Passport's built-in sessions
      passport.session()
    ]
  }
};


UserController: {
    "create": true
 },
 AuthController: {
    '*': true
 }