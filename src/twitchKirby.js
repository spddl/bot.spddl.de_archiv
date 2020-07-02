/* eslint no-undef: 0 */

const clientKirby = new irc.client({ // eslint-disable-line new-cap
  options: {
    debug: false
    // debugIgnore: ['chat', 'action', 'ping', 'part', 'join']
  },
  // logger: () => {},
  logger: {
    trace: () => { },
    debug: () => { },
    info: () => { },
    warn: (message) => { console.log(message) },
    error: (message) => { console.log(message) },
    fatal: (message) => { console.log(message) }
  },
  connection: {
    // cluster: 'aws',
    secure: true,
    reconnect: true
  },
  identity: {
    username: 'Kirby',
    password: 'oauth:' // "password": "oauth:", // https://dev.twitch.tv/console/apps
    // password: 'oauth:',
  },
  channels: ['#kirby']
})

// clientKirby.log.setLevel('error')

// const bot = { // [Prio] niedriger ist wichtiger
//   say: function (chan, msg, prio) {
//     q.push({ cmd: 'say', chan: chan, msg: msg }, prio, function (err) {
//       err && console.error(err)
//     })
//   },
//   timeout: function (chan, user, time, reason) {
//     q.push({ cmd: 'timeout', chan: chan, user: user, time: time, reason: reason }, 8, function (err) {
//       err && console.error(err)
//     })
//   },
//   ban: function (chan, user, reason) {
//     q.push({ cmd: 'ban', chan: chan, user: user, reason: reason }, 9, function (err) {
//       err && console.error(err)
//     })
//   },
//   whisper: function (chan, msg, prio) {
//     q.push({ cmd: 'whisper', chan: chan, msg: msg }, prio, function (err) {
//       err && console.error(err)
//     })
//   }
// }

clientKirby.on('disconnected', reason => {
  log.separator(` Kirby Twitch disconnected ${reason} `, 'notice')
}).on('logon', () => {
  log.separator(' Kirby Twitch bot logon', 'notice')
}).on('reconnect', () => {
  log.separator(' Kirby Twitch reconnect ', 'notice')
})

setTimeout(() => {
  clientKirby.connect()
}, 5000)

clientKirby.on('hosted', (channel, username, viewers) => {
  // channel: String - Channel name being hosted
  // username: String - Username hosting you
  // viewers: Integer - Viewers count
  // if (db.settingsprivate.blocked.indexOf(channel) !== -1) { return }
  // bot.whisper(channel, `Wird nun von ${username} gehostet mit ${viewers}`)
})

// Handle on connect event
clientKirby.on('connected', (address, port) => {
  log.notice('*** Kirby Bot Connected ***')
})
