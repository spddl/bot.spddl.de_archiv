try { // BACKUP
  const backup = new CronJob('0 0 12 * * *', () => { // eslint-disable-line no-unused-vars
    // var d = new Date()
    // var df = d.getMonth()+'-'+d.getDate()+'-'+d.getFullYear()+'_'+d.getHours()+'.'+d.getMinutes()
    // //var cmd = 'zip '+storage+'backup/'+df+'.zip '+storage+'*.json';

    const exec = require('child_process').exec
    // Create a date object with the current time
    const now = new Date()
    const date = [now.getMonth() + 1, now.getDate(), now.getFullYear()] // Create an array with the current month, day and time
    const time = [now.getHours(), now.getMinutes()] // Create an array with the current hour, minute and second

    // If seconds and minutes are less than 10, add a zero
    for (let i = 1; i < 3; i++) {
      if (time[i] < 10) {
        time[i] = '0' + time[i]
      }
    }

    try {
      // gzip ~/root/storage/backup/123456.zip ~/storage/*.json
      exec('zip ~/root/storage/backup/' + date.join('-') + '_' + time.join('.') + '.zip ~/root/storage/*.json', (err, stdout, stderr) => {
        if (err) console.warn(err)
        if (stderr) console.warn(stderr)
        console.log(stdout)
      })
    } catch (e) {
      console.warn(e)
    }

    try {
      exec('find ~/root/storage/backup/ -iname "*" -mtime +14 -delete', (err, stdout, stderr) => {
        if (err) console.warn(err)
        if (stderr) console.warn(stderr)
        console.log(stdout)
      })
    } catch (e) {
      console.warn(e)
    }
    // FIXME: kein backup
  }, null, false, 'Europe/Berlin') // }, null, (!config.localhost()), 'Europe/Berlin')
} catch (err) {
  console.error('BACKUP: ' + err)
}
