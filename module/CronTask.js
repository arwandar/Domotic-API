var schedule = require('node-schedule');
var HueSingleton = require('./Utils/HueSingleton');

var CronTask = function () {
    var j = schedule.scheduleJob('*/30 * * * * *', function () {
        console.log('lancement cron');
        HueSingleton.getRoom('Palier').extinctionAuto(2 * 60);
    });
};

module.exports = CronTask;
