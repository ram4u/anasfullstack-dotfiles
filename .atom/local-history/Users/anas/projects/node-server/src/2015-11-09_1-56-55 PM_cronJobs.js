
require('./pRequire');
var CronJob = require('cron').CronJob;

function createCronJob(time,onTick){
  var cronJob = new CronJob({
    cronTime: time,
    onTick: onTick,
    start: false,
    timeZone: 'CET'
  });
  return cronJob;
}

(function initCron(handler) {
  var loadCredentials = require('./../credentials').loadCredentials;
  var log = pRequire('/lib/log');

  loadCredentials(function(err, credentials) {
    if(err) { throw err; }

    var global = require('./global');
    global.setCredentials(credentials);

    var orm = pRequire('/orm');
    orm.init(function() {
      var Seo = pRequire('/managers/seo-manager').seoManager;
      var ML = pRequire('/managers/mailing-list-manager').mailingLists;

      // cron job runs daily at 00:00
      var dailyJob1 = createCronJob('00 57 13 * * *',function() {
        log.info("Daily Cron Job # 1 at 0:00 is now runnning!!");
        Seo.createProfileIndexPages();
        Seo.createSongsIndexPages();
      }
      );
      dailyJob1.start();

      // cron job runs daily at 06:00
      var dailyJob2_1 = createCronJob('00 58 13 * * *',function() {
        log.info("Daily Cron Job # 2_1  at 06:00  is now runnning!!");
        ML.addGaveUpUsersToQueue();
      }
      );
      dailyJob2_1.start();

      // cron job runs daily at 07:00
      var dailyJob2_2 = createCronJob('00 59 13 * * *',function() {
        log.info("Daily Cron Job # 2_2  at 07:00  is now runnning!!");
        ML.addNoSongsUsersToQueue();
      }
      );
      dailyJob2_2.start();

      // cron job runs daily at 08:00
      var dailyJob2_3 = createCronJob('00 00 14 * * *',function() {
        log.info("Daily Cron Job # 2_3  at 08:00  is now runnning!!");
        ML.addNoNewSongsUsersToQueue();
      }
      );
      dailyJob2_3.start();

      // cron job runs daily at 08:00
      var dailyJob2_4 = createCronJob('00 01 14 * * *',function() {
        log.info("Daily Cron Job # 2_4  at 09:00  is now runnning!!");
        ML.addUsersWith10SongsToQueue();
      }
      );
      dailyJob2_4.start();

      // cron job runs daily at 10:00
      var dailyJob2_5 = createCronJob('00 02 14 * * *',function() {
        log.info("Daily Cron Job # 2_5  at 10:00  is now runnning!!");
        ML.addNewUsersToRegistrationLists(1,ML.mailingListsNames.mainList);
        ML.addNewUsersToRegistrationLists(2,ML.mailingListsNames.studioList);
        ML.addNewUsersToRegistrationLists(3,ML.mailingListsNames.expressList);
        ML.addNewUsersToRegistrationLists(4,ML.mailingListsNames.mainList);
      }
      );
      dailyJob2_5.start();

      // cron job runs daily at 12:00
      var dailyJob3 = createCronJob('00 03 14 * * *',function() {
        log.info("Daily Cron Job # 3  at 12:00  is now runnning!!");
        ML.addUsersToMailingList();
        Seo.createSitemapsIndexPage();
      }
      );
      dailyJob3.start();

      // cron job runs daily at 18:00
      var dailyJob4 = createCronJob('00 04 14 * * *',function() {
        log.info("Daily Cron Job # 4  at 18:00  is now runnning!!");
        Seo.uploadSiteMaps();
      }
      );
      dailyJob4.start();
    });
  });
}());
