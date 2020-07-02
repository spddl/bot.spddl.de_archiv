'use strict'

const moment = require('moment')
const momenttz = require('moment-timezone')
const momentcountdown = require('moment-countdown')
const request = require('request')
const requestjson = require('request-json')

// [MRGC] 16:17:02 -------------------check24h fn: #fr3ddytv, pyroaxolotl, 84576957--------------------
// [LOG ] 16:17:02 [check24h] Now: 2017-06-07T20:17:02+00:00 Twitch: 2017-06-07T19:46:39Z, 84576957 < 86400000
// [16:17][1] [#tmijs] Executing command: /w fr3ddytv  pyroaxolotl wurde vor 23:29:36 auf Twitch erstellt.

//
// client.on("join", function (chan, username){
//   try {
//     //console.log('debug 614, chan: '+chan+'  username: '+username+' '+settingsprivate[chan.substr(1)].botsettings.check24h);
//   	if (settingsprivate[chan.substr(1)].botsettings.check24h || false){
//   		check24h(false, username, function (result, time){
//   			if (result){
//           let diff = time-86400000
//           bot.timeout(chan.substr(1), username, Math.round(time/1000), 'Check24h: '+username+' bekommt einen TO: '+moment.utc(diff).format("HH:mm:ss")); // umrechnen von MS zu Sekunden
//           if (settingsprivate[chan.substr(1)].botsettings.check24hwhisper || false) bot.whisper(chan.substr(1),' '+username+' bekommt einen TO: '+moment.utc(diff).format("HH:mm:ss"))
//           console.separator('check24h fn: '+chan+', '+username+', '+time, 'emergency');
//           io.of('/info/'+chan.substr(1)).emit('incomingmsg', {'msg': 'check24h: TimeOut für '+username+' '+moment.utc(diff).format("HH:mm:ss")});
//   			}
//   		})
//   	} else if (settingsprivate[chan.substr(1)].botsettings.check24hwhisper || false) {
//
//       check24h(true, username, function (result, time){
//   			if (result){
//           //bot.timeout(chan.substr(1), username, Math.round(time/1000), 'Check24h: '+username+' bekommt einen TO: '+moment.utc(time).format("HH:mm:ss")); // umrechnen von MS zu Sekunden
//           let diff = time-86400000
//           if (settingsprivate[chan.substr(1)].botsettings.check24hwhisper || false) bot.whisper(chan.substr(1),' '+username+' wurde vor '+moment.utc(diff).format("HH:mm:ss")+' auf Twitch erstellt.')
//           console.separator('check24h fn: '+chan+', '+username+', '+time, 'emergency');
//           io.of('/info/'+chan.substr(1)).emit('incomingmsg', {'msg': 'check24h: wurde vor '+username+' '+moment.utc(diff).format("HH:mm:ss")+' auf Twitch erstellt.'});
//   			}
//   		})
//
//   	}
//
//   } catch (e) {
//     console.error('ERROR check24h, chan: '+chan+'  username: '+username+' '+e);
//   }
//
// });

const ClientID = ''
function check24h (info, username, callback) { // TODO hier brauchen wir die ID des users
  requestjson.createClient('https://api.twitch.tv/kraken/users/').get(username, { headers: { 'Client-ID': ClientID, Accept: 'application/vnd.twitchtv.v3+json' } }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      // var diff = (Date.now() - moment.utc(new Date().toISOString()).subtract(23, 'h').valueOf()); // test
      var diff = (Date.now() - moment(body.created_at).valueOf())

      console.log('diff: ' + diff)

      if (diff < 8.64e7) { // 86400 Sekunden = 8.64e7 ms = 24 Stunden
        if (info) { diff = 8.64e7 - diff /* damit die andere Hälfte des Tages getimeoutet wird */ }
        callback(true, diff)
        console.log('[check24h] Now: ' + moment.utc().format() + ' Twitch: ' + body.created_at + ', ' + diff + ' < 86400000')
      } else {
        callback(false, null)
      }
    } else {
      callback(false, null) // Error
    }
  })
}

// check24h(true, 'pyroaxolotl', function (result, time){
// 	if (result){
//     //bot.timeout(chan.substr(1), username, Math.round(time/1000), 'Check24h: '+username+' bekommt einen TO: '+moment.utc(time).format("HH:mm:ss")); // umrechnen von MS zu Sekunden
//     let diff = time-86400000
//     console.log('pyroaxolotl wurde vor '+moment.utc(diff).format("HH:mm:ss")+' auf Twitch erstellt.')
//     console.log('check24h fn: chan, pyroaxolotl, '+time, 'emergency');
//     // io.of('/info/'+chan.substr(1)).emit('incomingmsg', {'msg': 'check24h: wurde vor '+username+' '+moment.utc(diff).format("HH:mm:ss")+' auf Twitch erstellt.'});
// 	} else {
// 	  console.log('#1 '+result);
// 	}
// })

check24h(true, 'pyroaxolotl', function (result, time) {
  if (result) {
    // let diff = time-86400000
    // bot.timeout(chan.substr(1), 'pyroaxolotl', Math.round(time/1000), 'Check24h: '+'pyroaxolotl'+' bekommt einen TO: '+moment.utc(diff).format("HH:mm:ss")); // umrechnen von MS zu Sekunden
    // console.log('pyroaxolotl'+' bekommt einen TO: '+moment.utc(diff).format("HH:mm:ss"))
    console.log('pyroaxolotl' + ' bekommt einen TO: ' + moment.utc(time).format('HH:mm:ss'))
    console.log(moment.utc(86400000).format('HH:mm:ss'))
    console.log('check24h fn: chan, ' + 'pyroaxolotl' + ', ' + time, 'emergency')
    // io.of('/info/'+chan.substr(1)).emit('incomingmsg', {'msg': 'check24h: TimeOut für '+'pyroaxolotl'+' '+moment.utc(diff).format("HH:mm:ss")});
  } else {
    console.log('#1 ' + result)
  }
})
