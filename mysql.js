'use strict'

const rp = require('request-promise')
const mysql = require('mysql')
const sql = mysql.createPool({ // https://www.npmjs.com/package/mysql#pool-events
  connectionLimit: 10,
  host: '127.0.0.1',
  user: 'root',
  password: 'kracho' // ,
  // database        : 'my_db'
})
sql.on('enqueue', function () {
  console.log('Waiting for available connection slot')
})

const cost = {
  kirby: {
    online: 10,
    offline: 10,
    viewers: 1,
    moderators: 2,
    broadcaster: 1
  }
}

function getChatters (channelName, _attemptCount = 0) {
  return rp({
    uri: `https://tmi.twitch.tv/group/user/${channelName}/chatters`,
    json: true,
    timeout: 60 * 1000 // 1 Min
  })
  .then(data => {
    return Object.entries(data.chatters)
      .reduce((p, [ type, list ]) => p.concat(list.map(name => {
        if (name === channelName) type = 'broadcaster'
        return `'${name}', ${cost[channelName][type] * cost[channelName].online}`
      })), [])
  })
  .catch(err => {
    console.warn(err.code)
    if (_attemptCount < 3 || err.code === 'ETIMEDOUT') {
      return getChatters(channelName, _attemptCount + 1)
    }
    throw err
  })
}

function go () {
  console.time('getChatters')
  getChatters('kirby').then(data => {
    console.timeEnd('getChatters')
    // console.log(data)
    if (data.length) {
      let sqlquery = 'INSERT INTO twitch.kirby (user, coins) VALUES (' + data.join('), (') + ') ON DUPLICATE KEY UPDATE coins = coins + 10'
      // console.log(sqlquery)
      console.time('sql')
      sql.query(sqlquery, function (error, results, fields) {
        if (error) console.warn(error)
        console.timeEnd('sql')
      })
    }
    // TODO evtl. wenn es über X sind dann spliten
    // data.forEach(e => {
    //   console.time('sql')
    //   sql.query(`INSERT INTO twitch.kirby (user, coins) VALUES ('${e.name}', 10) ON DUPLICATE KEY UPDATE coins = coins + 10`, function (error, results, fields) {
    //     if (error) console.warn(error)
    //     console.timeEnd('sql')
    //   })
    // })

    // console.log('getChatters length', data.length)
  })
}

setInterval(() => {
  go()
}, 5 * 60 * 1000) // 5 min
go()

// {
//   "_links": {},
//   "chatter_count": 6,
//   "chatters": {
//     "moderators": [
//       "kirby",
//       "spddl_bot"
//     ],
//     "staff": [],
//     "admins": [],
//     "global_mods": [],
//     "viewers": [
//       "electricalskateboard",
//       "kusch3lbear",
//       "m3ckory",
//       "smatify_"
//     ]
//   }
// }

// Online
// normal users gain 2 Points every 5 Minutes

// Offline
// normal users gain 1 Points every 20 Minutes

// Normal User 1
// Mods 1.5
// Streamer 1