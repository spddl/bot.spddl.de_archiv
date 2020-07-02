function cb (chan, id, time, msg) { // http://crontab.guru/
  console.info('CronJob ' + chan + ', ' + id + ', ' + time + ', ' + msg)
  var chanID = chan + id
  // console.log('\"Seconds: 0-59\" \"Minutes: 0-59\" \"Hours: 0-23\" \"Day of Month: 1-31\" \"Months: 0-11\" \"Day of Week: 0-6\"')

  global[chanID] = new CronJob('0 ' + time, function () {
    // if (settings[chan].online.status === true) {
    if (settings[chan].online.status || settings[chan].online.OnCount !== 0) {
      bot.say('#' + chan, msg)
    }
  }, null, true, 'Europe/Berlin')
}
