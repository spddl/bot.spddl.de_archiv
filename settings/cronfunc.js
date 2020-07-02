'use strict'

// const CronJob = require('cron').CronJob; // https://www.npmjs.com/package/cron

module.exports = function () {
  return {
    idk: 'test',
    test: function (chan, id) {
      console.log('test: ' + chan + ', ' + id)
      try {
        return global[chan + id].running
      } catch (e) {
        return false
      }
    },
    nextDate: function (chan, id) {
      return global[chan + id].nextDate()._d
    },
    source: function (chan, id) {
      return global[chan + id].cronTime.source
    },
    del: function (chan, id) {
      const chanID = chan + id
      console.log('stop: ' + chanID)
      // console.log('test1: '+this.test(chan,id));
      global[chanID].stop()
      // console.log('test2: '+this.test(chan,id));
      delete global[chanID]
      // global[chanID] = null
    },

    // Don't use
    set: function (chan, id, time, msg) { // http://crontab.guru/
      console.warn('CronJob ' + chan + ', ' + id + ', ' + time + ', ' + msg)
      const chanID = chan + id
      // console.log('\"Seconds: 0-59\" \"Minutes: 0-59\" \"Hours: 0-23\" \"Day of Month: 1-31\" \"Months: 0-11\" \"Day of Week: 0-6\"');
      global[chanID] = new CronJob(time, function () {
        if (settings[chan].online === true) bot.say('#' + chan, msg) // TODO
      }, null, true, 'Europe/Berlin')

      // console.log(util.inspect(global[chanID], false, null, true));

      // console.log(chanID+' running', global[chanID].running);
      // console.log(chanID+' source', global[chanID].cronTime.source);
      // console.log(chanID+' nextDate ', global[chanID].nextDate()._d);

      // return false;
    }
  }
}
