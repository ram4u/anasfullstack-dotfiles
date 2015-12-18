/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 */
 /*global
 User
 */

module.exports = {
  /**
  * `AudienceListController.update()`
  */
  create: function(req, res, next) {
    'use strict';
    var newUser = req.params.all();
    sails.log.debug(typeof newUser);
    sails.log.debug('newUser   ', newUser);

    if (!newUser.email) {
      sails.log.error('Can not Create user without userName!');
      return res.badRequest('No userName found!');
    }

    if (!newUser.password) {
      sails.log.error('Can not Create user without password!');
      return res.badRequest('No password found!');
    }

    User.create(newUser, function(err, user) {
      if (err) {
        sails.log.error(err);
        res.badRequest();
        return next(err);
      }
      res.status(201);
      res.json(user);
    });
  }

  /**
	 * `AudienceListController.update()`
	 */
	update: function(req, res, next) {
  'use strict';

  var id = req.param('id');

  if (!id) {
    return res.badRequest('No id provided!!!!!!');
  }

  var criteria = _.merge(req.params.all(), req.body);

  AudienceList.update(id, criteria, function(err, list) {
    if (err) {
      sails.log.error(err);
      return next(err);
    }

    if (list.length === 0) {
      return res.notFound();
    }

    res.json(list);
  });

	},};