var _         = require('underscore');
var P         = require('bluebird');
var orm       = pRequire('/orm');
var modelUtil = pRequire('/lib/model-util');
var log       = pRequire('/lib/log');
var global    = pRequire('/global');

var MadMimi             = require('madmimi');
var madmimiCredintials  = global.credentials.madMimi;

MadMimi.configure({
  email: madmimiCredintials.email,
  key:   madmimiCredintials.apiKey
});

var mailingListsNames = {
  "mainList":         "_auto_registrations",
  "expressList":      "_auto_registrations-express",
  "studioList":       "_auto_registrations-studio",
  "created_10_songs": "_auto_created-10-songs",
  "tried_gave_up":    "_auto_tried-and-gave-up",
  "no_songs":         "_auto_no-songs",
  "no_new_songs":     "_auto_no-new-songs"
};

function setDateMidnight(dateObj){
  dateObj.setHours(0);
  dateObj.setMinutes(0);
  dateObj.setSeconds(0);
  dateObj.setMilliseconds(0);
  return dateObj;
}

function getPastDateTime(daysAgo) {
  var dateStart = new Date();
  var dateEnd   = new Date();

  dateStart.setDate(dateStart.getDate() - daysAgo);
  dateEnd.setDate(dateEnd.getDate() - daysAgo + 1);

  var dateStartMidnight = setDateMidnight(dateStart);
  var dateEndMidnight   = setDateMidnight(dateEnd);

  var pastDate = {
    '>': dateStartMidnight,
    '<': dateEndMidnight
  };
  return pastDate;
}

function getMaillingQueueModel(){
  return orm.getModel('mailing_list_queue');
}

function getUserModel(){
  return orm.getModel('user');
}

function getSongModel(){
  return orm.getModel('song');
}

function addUserToQueueTable(userId, listName){
  var newRow = {
    "user_id":            userId,
    "mailing_list_name":  listName,
    "handled":            false
  };
  return getMaillingQueueModel().create(newRow);
}

function getUserObj(user){
  return {
      "Scl_user_id":        user.user_id,
      "UserName":           user.username,
      "email":              user.email,
      "User Type":          user.user_type,
      "Registration Date":  user.registration_date,
      "country":            user.country,
      "Name":               user.display_name
    };
}

function addUsersListToQueue(usersList, listName) {
  return P.each(usersList, function(user) {
    getMaillingQueueModel()
      .findOne({
        "user_id":            user.user_id || user,
        "mailing_list_name":  listName
      }).then(function(queueItem) {
        if (!queueItem) {return addUserToQueueTable(user.user_id || user, listName);}
      });
  }).then(function() {
    log.info(usersList.length + " users were added to mailing list: " + listName);
  });
}

function addUsersToMailingList() {
  log.info("Adding Users To Mailing List is now runnning!!");
  this.emailCount = 0;
  var self = this;
  return getMaillingQueueModel()
    .find({
      handled: false
    }).then(function(queueList) {
      return P.each(queueList, function(queueItem) {
        return getUserModel().findOne({user_id: queueItem.user_id})
          .then(function(user) {
            if (queueItem.mailing_list_name === null) {
              queueItem.mailing_list_name = mailingListsNames.mainList;
            }
            if (user.email) {
              var userObj = getUserObj(user);
              return MadMimi.post('/audience_lists/' + queueItem.mailing_list_name + '/add', userObj)
                .then(function(result) {
                  self.emailCount += 1;
                  return getMaillingQueueModel()
                    .findOne({'id': queueItem.id})
                    .then(function(item) {
                      return modelUtil.update(item, ['handled'], {'handled': true});
                    });
                })
                .error(function(err) {log.error(err);});
            }
          });
      }).then(function() {
        log.info(self.emailCount + " new emails were added to madmimi mailing list!!");
      });
    });
}

// getting users with specific number of songs and the latest one was created yesterday
function getUsersWithNumberOfSongs(numberOfSongs) {
  return getSongModel()
    .find({
      'creation_date': getPastDateTime(1)
    }).groupBy('author_id')
    .sum()
    .then(function(yesterdaySongs) {
      return P.map(yesterdaySongs, function(song) {
        return getSongModel()
          .count({author_id: song.author_id, is_deleted: false})
          .then(function(songsCount) {
            if (songsCount >= numberOfSongs) {return song.author_id;}
          });
      }).then(function(userIds) {
        var filteredUserIds =  _.filter(userIds, function(userId) {return !!userId;});
        return filteredUserIds;
      });
    });
}

function addUsersWith10SongsToQueue() {
  return getUsersWithNumberOfSongs(10)
    .then(function(usersList){
      return addUsersListToQueue(usersList, mailingListsNames.created_10_songs);
    });
}

function getGaveUpUsers() {
  return getUserModel()
    .find({registration_date: getPastDateTime(14)})
    .then(function(newUsers) {
      console.log('newUsers', newUsers);
      return P.map(newUsers, function(newUser) {
        console.log('newUser',newUser);
        return getSongModel()
          .count({author_id: newUser.user_id, is_deleted: false})
          .then(function(allUserSongs) {
            console.log('allUserSongs', allUserSongs);
            if (allUserSongs > 0) {
              return getSongModel()
                .count({
                  author_id: newUser.user_id,
                  creation_date: {'>': getPastDateTime(12)['>']}
                })
                .then(function(songsCount) {
                  console.log('songsCount', songsCount);
                  if (songsCount === 0) {return newUser;}
                });
            }
          })
          .then(function(gaveUpUsers) {
            var filteredList =  _.filter(gaveUpUsers, function(gaveUpUser) {return !!gaveUpUser;});
            return filteredList;
          });
      });
    });
}
exports.getGaveUpUsers = getGaveUpUsers;

function addGaveUpUsersToQueue() {
  return getGaveUpUsers()
    .then(function(usersList){
    return addUsersListToQueue(usersList, mailingListsNames.tried_gave_up);
    });
}

function getNoNewSongsUsers() {
  return getUserModel()
    .find({registration_date: {
      '>': getPastDateTime(33)['>'],
      '<': getPastDateTime(150)['>']
    }})
    .then(function(newUsers) {
      return P.map(newUsers, function(newUser) {
        return getSongModel()
          .count({author_id: newUser.user_id, is_deleted: false})
          .then(function(allUserSongs) {
            if (allUserSongs > 0) {
              return getSongModel()
                .count({
                  author_id: newUser.user_id,
                  creation_date: {'>': getPastDateTime(30)['>']}
                })
                .then(function(songsCount) {
                  if (songsCount === 0) {return newUser;}
                });
            }
          })
          .then(function(noNewSongsUsers) {
            var filtereduserList =  _.filter(noNewSongsUsers, function(noNewSongsUser) {return !!noNewSongsUser;});
            return filtereduserList;
          });
      });
    });
}

function addNoNewSongsUsersToQueue() {
  return getNoNewSongsUsers()
    .then(function(usersList){
    return addUsersListToQueue(usersList, mailingListsNames.no_new_songs);
    });
}

function getNoSongsUsers(){
  return getUserModel()
  .find({registration_date : getPastDateTime(30)})
  .then(function(newUsers){
    return P.map(newUsers,function(newUser){
      return getSongModel()
        .count({author_id: newUser.user_id, is_deleted: false})
        .then(function(songsCount) {
          if (songsCount === 0) {return newUser;}
        });
    });
  });
}

function addNoSongsUsersToQueue() {
  return getNoSongsUsers()
    .then(function(usersList){
    return addUsersListToQueue(usersList, mailingListsNames.no_songs);
    });
}

function addNewUsersToRegistrationLists(clientId, ListName){
  return getUserModel()
    .find({
      registration_date: getPastDateTime(1),
      registration_app_id: clientId
    })
    .then(function(usersList){
      return addUsersListToQueue(usersList,ListName);
    });
}

exports.mailingLists = {
  addGaveUpUsersToQueue: addGaveUpUsersToQueue,
  addNoSongsUsersToQueue: addNoSongsUsersToQueue,
  addNoNewSongsUsersToQueue: addNoNewSongsUsersToQueue,
  addUsersWith10SongsToQueue:addUsersWith10SongsToQueue,
  addNewUsersToRegistrationLists: addNewUsersToRegistrationLists,
  addUsersToMailingList: addUsersToMailingList,
  mailingListsNames:mailingListsNames
};
