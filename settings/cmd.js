'use strict'
exports = module.exports = {}

const config = require('./config.js')()
const db = require('./db.js')
const cache = require('./cache.js')
// const urlencode = require('urlencode')
const request = require('request')
const requestjson = require('request-json')
// const csgomarket = require('csgo-market')
const moment = require('moment')
require('moment-countdown')
const _ = require('underscore')
// const async = require('async')
// const momenttz = require('moment-timezone')
// const https = require('https')

exports.test = () => {
  return new Promise(function (resolve) {
    console.log('cmd.test()')
    resolve(+new Date())
  })
}

// exports.mm = () => {
//   return new Promise(function (resolve, reject) {
//     cache.get('ICSGOServers_730/GetGameServersStatus', (err, data) => {
//       if (err) { console.warn("cache.get err: " +err); }
//       else {
//         if (data) {
//           resolve(data); // Daten aus Redis
//         } else {
//           requestjson.createClient('http://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v001/').get("?key="+config.steamapikey, function(err, res, body) {
//             if (!err && res.statusCode === 200 && body.stream !== null) {
//               if (!err) {
//                 resolve(body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer ØWartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden');
//                 cache.set('ICSGOServers_730/GetGameServersStatus', body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer ØWartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden', (err) => { if (err) { console.log("redis set: "+err); } })
//               } else {
//                 reject(err);
//               }
//             }else{
//               resolve('The channel is not live.')
//             }
//           });
//         }
//       }
//     })
//   });
// }

exports.mm = () => {
  return new Promise(async function (resolve, reject) {
    const [errPget, dataset] = await cache.Pget('ICSGOServers_730/GetGameServersStatus')
    if (dataset && !errPget) {
      resolve(dataset) // Daten aus Redis
    } else {
      if (errPget) { console.warn('\x1b[31m%s\x1b[0m', errPget) }
      requestjson.createClient('http://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v001/').get('?key=' + config.steamapikey, function (err, res, body) {
        if (!err && res.statusCode === 200 && body.stream !== null) {
          if (!err) {
            resolve(body.result.matchmaking.searching_players + ' Spieler suchen von ' + body.result.matchmaking.online_players + ' bei einer ØWartezeit von ' + body.result.matchmaking.search_seconds_avg + ' Sekunden')
            // let err = await cache.Pset('ICSGOServers_730/GetGameServersStatus', body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer ØWartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden')
            // if (err) { console.warn(err); }
            cache.set('ICSGOServers_730/GetGameServersStatus', body.result.matchmaking.searching_players + ' Spieler suchen von ' + body.result.matchmaking.online_players + ' bei einer ØWartezeit von ' + body.result.matchmaking.search_seconds_avg + ' Sekunden', (err) => { if (err) { console.log('redis set: ' + err) } })
          } else {
            reject(err)
          }
        } else {
          resolve('SteamAPI nicht verfügbar')
        }
      })
    }
  })
}

exports.uptime = (channel, ClientID) => {
  return new Promise(async function (resolve) {
    const [errPget, dataset] = await cache.Pget('helix/streams/' + channel)
    if (dataset && !errPget) {
      const startedTime = new Date(dataset) // Daten aus Redis
      const totalUptime = Math.round(Math.abs((Date.now() - (startedTime.getTime() - (startedTime.getTimezoneOffset() * 1000))) / 1000))
      const days = Math.floor(totalUptime / 86400)
      const hours = Math.floor(totalUptime / 3600) - (days * 24)
      let minutes = Math.floor(totalUptime / 60) - (days * 1440) - (hours * 60)
      const seconds = totalUptime - (days * 86400) - (hours * 3600) - (minutes * 60)
      minutes = minutes - 4
      resolve((days > 0 ? days + ' day' + (days === 1 ? '' : 's') + ', ' : '') + (hours > 0 ? hours + ' hour' + (hours === 1 ? '' : 's') + ', ' : '') + (minutes > 0 ? minutes + ' minute' + (minutes === 1 ? '' : 's') + ', ' : '') + seconds + ' second' + (seconds === 1 ? '' : 's'))
    } else {
      if (errPget) { console.warn('\x1b[31m%s\x1b[0m', errPget) }

      requestjson.createClient('https://api.twitch.tv/helix/').get('streams?user_login=' + channel, { headers: { 'Client-ID': ClientID, Authorization: `Bearer ${global.oauth}` } }, function (err, res, body) {
        if (!err && res.statusCode === 200 && body.data[0] !== null) {
          const startedTime = new Date(body.data[0].started_at)
          const totalUptime = Math.round(Math.abs((Date.now() - (startedTime.getTime() - (startedTime.getTimezoneOffset() * 1000))) / 1000))
          const days = Math.floor(totalUptime / 86400)
          const hours = Math.floor(totalUptime / 3600) - (days * 24)
          let minutes = Math.floor(totalUptime / 60) - (days * 1440) - (hours * 60)
          const seconds = totalUptime - (days * 86400) - (hours * 3600) - (minutes * 60)
          minutes = minutes - 4
          resolve((days > 0 ? days + ' day' + (days === 1 ? '' : 's') + ', ' : '') + (hours > 0 ? hours + ' hour' + (hours === 1 ? '' : 's') + ', ' : '') + (minutes > 0 ? minutes + ' minute' + (minutes === 1 ? '' : 's') + ', ' : '') + seconds + ' second' + (seconds === 1 ? '' : 's'))

          cache.set('helix/streams/' + channel, body.data[0].started_at, (err) => { if (err) { console.log('redis set: ' + err) } })
        } else {
          resolve('The channel is not live.')
        }
      })
    }
  })
}

// TODO: Kirby only?
exports.subage = (user, chan, target, ClientID) => { // https://github.com/justintv/Twitch-API/blob/master/v3_resources/follows.md#put-usersuserfollowschannelstarget
  return new Promise(async resolve => {
    console.log({ user, chan, target, ClientID })
    // const targetid = await exports.getUserId('kirby', ClientID)
    // console.log({ user: 'kirby', targetid })
    // console.log(db.privatee['kirby'])

    // "oauth": "",
    // "lastupdated": "2019-09-04T10:17:39.185Z",
    // "_id": 37218834
    requestjson.createClient('https://api.twitch.tv/helix/').get('subscriptions?broadcaster_id=' + db.privatee[user.username].oauth, { headers: { 'Client-ID': ClientID, Authorization: `Bearer ${global.oauth}` } }, function (err, res, body) {
      console.log(body)
      if (!err && res.statusCode === 200) { // if (!err && res.statusCode === 200 && body.data[0] !== null) {
        console.log(body)

        // let startedTime = new Date(body.data[0].started_at)
        // let totalUptime = Math.round(Math.abs((Date.now() - (startedTime.getTime() - (startedTime.getTimezoneOffset() * 1000))) / 1000))
        // let days = Math.floor(totalUptime / 86400)
        // let hours = Math.floor(totalUptime / 3600) - (days * 24)
        // let minutes = Math.floor(totalUptime / 60) - (days * 1440) - (hours * 60)
        // let seconds = totalUptime - (days * 86400) - (hours * 3600) - (minutes * 60)
        // minutes = minutes - 4
        resolve('Kappa')
      } else {
        if (res.statusCode === 401) {
          resolve(body.error)
        } else {
          resolve('Error :/')
        }
      }
    })

    // if (user.username === chan && !target) {
    //   console.log('user == chan') // GET https://api.twitch.tv/kraken/channels/<channel ID>/subscriptions/<user ID>
    //   requestjson.createClient('https://api.twitch.tv/kraken/channels/').get(chan + '/subscriptions/' + user.username, { headers: { 'Accept': 'application/vnd.twitchtv.v3+json', 'Client-ID': ClientID, 'Authorization': 'OAuth ' + db.privatee[chan].oauth } }, function (err, res, body) {
    //     if (err) console.error(err)
    //     resolve('is Sub since: ' + moment(body.created_at).countdown().toString())
    //   })
    // } else if (target === chan) {
    //   console.log('target == chan')
    //   requestjson.createClient('https://api.twitch.tv/kraken/channels/').get(chan + '/subscriptions/' + chan, { headers: { 'Accept': 'application/vnd.twitchtv.v3+json', 'Client-ID': ClientID, 'Authorization': 'OAuth ' + db.privatee[chan].oauth } }, function (err, res, body) {
    //     if (err) console.error(err)
    //     resolve('@' + target + ' is Sub since: ' + moment(body.created_at).countdown().toString())
    //   })
    // } else if (target) {
    //   console.log('target')
    //   requestjson.createClient('https://api.twitch.tv/kraken/channels/').get(chan + '/subscriptions/' + target, { headers: { 'Accept': 'application/vnd.twitchtv.v3+json', 'Client-ID': ClientID, 'Authorization': 'OAuth ' + db.privatee[chan].oauth } }, function (err, res, body) {
    //     if (err) console.error(err)
    //     if (res.statusCode === 401) {
    //       resolve('Twitch OAuth ist nicht aktuell, bitte erneut einloggen auf bot.spddl.de'); return
    //     }
    //     if (!err && res.statusCode === 404) {
    //       resolve(body.message); return
    //     }
    //     if (!err && res.statusCode === 200) {
    //       resolve('@' + target + ' is Sub since: ' + moment(body.created_at).countdown().toString())
    //     } else {
    //       console.warn('res.statusCode ' + res.statusCode)
    //     }
    //   })
    // } else {
    //   requestjson.createClient('https://api.twitch.tv/kraken/channels/').get(chan + '/subscriptions/' + user.username, { headers: { 'Accept': 'application/vnd.twitchtv.v3+json', 'Client-ID': ClientID, 'Authorization': 'OAuth ' + db.privatee[chan].oauth } }, function (err, res, body) {
    //     if (err) console.error(err)
    //     if (!err && res.statusCode === 404) {
    //       resolve(body.message)
    //       return
    //     }
    //     if (!err && res.statusCode === 200) {
    //       resolve('@' + user.username + ' is Sub since: ' + moment(body.created_at).countdown().toString())
    //     } else {
    //       console.warn('res.statusCode ' + res.statusCode)
    //     }
    //   })
    // }
  })
}

// TODO: Kirby only?
exports.subs = (user, chan, ClientID) => { // https://dev.twitch.tv/docs/v5/reference/channels/#get-channel-subscribers
  // TODO: requestjson.createClient('https://api.twitch.tv/kraken/channels/').get(user['room-id']+'/subscriptions?limit=1&direction=desc',{headers:{'Accept':'application/vnd.twitchtv.v5+json','Client-ID':ClientID,'Authorization': 'OAuth '+privatee[chan].oauth}}, function(err, res, body){
  // console.log('twitchsubs(room-id): '+user['room-id']); ): 37218834
  return new Promise(function (resolve) {
    requestjson.createClient('https://api.twitch.tv/kraken/channels/').get(/* user['room-id'] */ '37218834' + '/subscriptions?limit=1&direction=desc', { headers: { Accept: 'application/vnd.twitchtv.v5+json', 'Client-ID': ClientID, Authorization: 'OAuth ' + db.privatee[chan].oauth } }, function (err, res, body) {
      if (err) console.error(err)
      if (!err && res.statusCode === 404) {
        resolve(body.message); return
      }
      if (!err && res.statusCode === 200) {
        try {
          if (db.settingsprivate[chan].botsettings.alerts.subscription.subtext) {
            let msg = db.settingsprivate[chan].botsettings.alerts.subscription.subtext
            msg = msg.replace(new RegExp('{SUBCOUNTER}', 'g'), body._total)
            resolve(msg)
          } else {
            resolve('We are currently having ' + body._total + ' subscribers'); return
          }
        } catch (e) {
          console.warn(e)
          resolve('')
        }
      } else {
        console.warn('res.statusCode !== 200 ' + res.statusCode)
      }
    })
  })
}

exports.getUserId = (user, ClientID) => {
  return new Promise(function (resolve) {
    // GET https://dev.twitch.tv/docs/api/reference/#get-users
    requestjson.createClient('https://api.twitch.tv/helix/').get('users?login=' + user, { headers: { 'Client-ID': ClientID, Authorization: `Bearer ${global.oauth}` } }, function (err, res, body) {
      if (err) console.error(err)
      try {
        resolve(body.data[0].id)
      } catch (error) {
        console.log('user', user)
        console.warn(body)
        resolve(null)
      }
    })
  })
}

exports.follower = (user, chan, target, ClientID) => {
  return new Promise(async function (resolve) {
    // console.log('twitchfollower fn, '+chan+', '+target);
    const h = { Accept: 'application/vnd.twitchtv.v5+json', 'Client-ID': ClientID }
    let _id
    if (user['room-id']) _id = user['room-id']
    else _id = db.privatee[chan]._id

    if (user.username === chan && !target) {
      console.log('user == chan also der Streamer?')

      // Check User Follows by Channel / https://dev.twitch.tv/docs/v5/reference/users#get-user-by-id
      requestjson.createClient('https://api.twitch.tv/kraken/users/').get(user['user-id'], { headers: h }, function (err, res, body) {
        if (err) {
          console.error(err)
          resolve()
        }

        console.log(body)
        if (body.error) resolve('@' + target + ' ' + body.error + ', ' + body.message)
        else resolve('was created before: ' + moment(body.created_at).countdown().toString())
        // resolve( 'was created before: '+moment(body.created_at).countdown().toString() );
      })
    } else if (target === chan) {
      // console.log('target == chan auch der streamer');
      // { display_name: 'spddl',
      // _id: '29218758',
      // name: 'spddl',
      // type: 'user',
      // bio: null,
      // created_at: '2012-03-24T00:18:29.799922Z',
      // updated_at: '2017-11-23T13:04:17.386855Z',
      // logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/spddl-profile_image-383ac69764a1ee3a-300x300.jpeg' }

      // Check User Follows by Channel / https://dev.twitch.tv/docs/v5/reference/users#get-user-by-id
      requestjson.createClient('https://api.twitch.tv/kraken/users/').get(user['user-id'], { headers: h }, function (err, res, body) {
        if (err) {
          console.error(err)
          resolve()
        }

        // console.log(body)
        if (body.error) resolve('@' + target + ' ' + body.error + ', ' + body.message) // <--
        else resolve('@' + target + ' was created before: ' + moment(body.created_at).countdown().toString())
        // resolve('@'+target+' was created before: '+moment(body.created_at).countdown().toString() )
      })
    } else if (target) {
      // console.log('target: '+target);

      const targetid = await exports.getUserId(target, ClientID)
      // Check User Follows by Channel / https://dev.twitch.tv/docs/v5/reference/users#check-user-follows-by-channel
      requestjson.createClient('https://api.twitch.tv/kraken/users/').get(targetid + '/follows/channels/' + _id, { headers: h }, function (err, res, body) {
        console.log(body)
        if (err) console.error(err)
        if (!err && res.statusCode === 404) {
          resolve(body.message)
          return
        }
        if (!err && res.statusCode === 200) {
          console.log('body.created_at1')
          console.log(body.created_at)
          resolve('@' + target + ' is following since: ' + moment(body.created_at).countdown().toString())
        } else {
          console.warn('res.statusCode ' + res.statusCode)
        }
      })
    } else {
      // Check User Follows by Channel / https://dev.twitch.tv/docs/v5/reference/users#check-user-follows-by-channel
      requestjson.createClient('https://api.twitch.tv/kraken/users/').get(user['user-id'] + '/follows/channels/' + _id, { headers: h }, function (err, res, body) {
        if (err) console.error(err)
        if (!err && res.statusCode === 404) {
          resolve(body.message)
          return
          // '@'+user.username+' now follows since: '+time
        }
        if (!err && res.statusCode === 200) {
          console.log('body.created_at2')
          console.log(body.created_at)
          resolve('@' + user.username + ' is following since: ' + moment(body.created_at).countdown().toString())
        } else {
          console.warn('res.statusCode ' + res.statusCode)
        }
      })
    }
  })
}

// Overwatch
exports.patch_notes = (channel, game, user) => { // TODO hier brauchen wir die ID des users
  return new Promise(function (resolve) {
    requestjson.createClient('https://api.lootbox.eu').get('patch_notes', function (err, res, body) {
      if (!err && res.statusCode === 200) {
        resolve(body.patchNotes[0].patchVersion, body.patchNotes[0])
      } else {
        console.warn(err)
        console.warn(res.statusCode)
        resolve('') // Error
      }
    })
  })
}

exports.loadrss = (link) => {
  // return new Promise(function (resolve) {
  //   feed(link, function (err, articles) {
  //     if (err) throw err
  //     // Each article has the following properties:
  //     //
  //     //   * "title"     - The article title (String).
  //     //   * "author"    - The author's name (String).
  //     //   * "link"      - The original article link (String).
  //     //   * "content"   - The HTML content of the article (String).
  //     //   * "published" - The date that the article was published (Date).
  //     //   * "feed"      - {name, source, link}
  //     //
  //     resolve({title: articles[0].title, link: articles[0].link})
  //   })
  // })
}

exports.gamechange = (channel, game, ClientID) => { // findGameName: https://github.com/tmijs/tmi.js/issues/307
  return new Promise(function (resolve) {
    if (!(db.privatee[channel] && db.privatee[channel].oauth)) {
      resolve('@' + channel + ' (keine Rechte) Bitte einmal auf http://bot.spddl.de anmelden'); return
    }

    const h = { Accept: 'application/vnd.twitchtv.v5+json', 'Client-ID': ClientID, Authorization: 'OAuth ' + db.privatee[channel].oauth }

    // https://dev.twitch.tv/docs/v5/reference/channels#update-channel
    const data = { channel: { game: game, channel_feed_enabled: true } }
    requestjson.createClient('https://api.twitch.tv/').put('kraken/channels/' + db.privatee[channel]._id, data, { headers: h }, function (err, res, body) {
      if (err !== null) { console.warn('exports.gamechange err: ' + err) }
      console.log('statusCode', res.statusCode)
      if (body !== undefined) {
        resolve('erl.')
      } else {
        resolve('API Down? StatusCode: ', res.statusCode) // API Down?
      }
    })
  })
}

exports.titelchange = (channel, titel, ClientID) => {
  return new Promise(function (resolve) {
    if (titel === '') {
      return resolve('Und wie lautet der neue Titel? (!titel 24H Stream ᶘ ᵒᴥᵒᶅ)')
    }
    if (!(db.privatee[channel] && db.privatee[channel].oauth)) {
      return resolve('@' + channel + ' (keine Rechte) Bitte einmal auf http://bot.spddl.de anmelden')
    }

    const h = { 'Client-ID': ClientID, Accept: 'application/vnd.twitchtv.v5+json', Authorization: 'OAuth ' + db.privatee[channel].oauth }
    console.log(h)

    // https://dev.twitch.tv/docs/v5/reference/channels#update-channel
    // const data = { channel: { status: titel } }
    const data = 'channel[status]=' + titel.replace(/ /, '+')

    console.log('titelchange: https://api.twitch.tv/kraken/channels/' + db.privatee[channel]._id)
    requestjson.createClient('https://api.twitch.tv/').put('kraken/channels/' + db.privatee[channel]._id, data, { headers: h }, (err, res, body) => {
      if (err !== null) { console.warn('exports.titelchange err: ' + err) }
      console.log('titelchange: statusCode', res.statusCode)

      if (body !== undefined) {
        resolve('erl.')
      } else {
        resolve(res.statusCode) // API Down?
      }
    })
  })
}

exports.twitchstatus = (channel, user, ClientID) => { // TODO: ClientID im Header
  return new Promise(function (resolve) {
    const url = 'https://api.twitch.tv/kraken/channels/' + channel.substr(1)
    request({
      url: url,
      json: true,
      headers: { 'Client-ID': ClientID }
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        resolve('Twitch Headline: ' + body.status + ',  Spiel: ' + body.game + ',  Followers: ' + body.followers)
      } else {
        console.warn('statusCode: ' + response.statusCode)
        console.warn(error)
      }
    })
  })
}

// TODO adminCheck
exports.weather = (channel, user, city, state) => {
  return new Promise(function (resolve) {
    // if(channel === '#false' || db.settingsprivate[channel].botsettings.weather || adminCheck(user, channel)) {
    // console.log('http://api.openweathermap.org/data/2.5/weather?q='+city+'&units=metric&APPID='+config.openweathermapkey);

    try {
      requestjson.createClient('http://api.openweathermap.org/data/2.5/').get('weather?q=' + city + '&units=metric&APPID=' + config.openweathermapkey, function (err, res, body) {
        if (err !== null) { console.error('fn weather err: ' + err) }
        try {
          console.log(body.name + ',' + (body.sys.country || '') + ' ' + Math.round(body.main.temp) + '°C ' + body.weather[0].description)
        } catch (e) {
          console.warn(e)
        }

        if (body !== undefined) { // API Down?
          if (body.cod === 404 || body.cod === 502) {
            resolve('Not found city')
          } else if (body && body.main && body.main.temp && body.weather) {
            try {
              resolve(body.name + ',' + (body.sys.country || '') + ' ' + Math.round(body.main.temp) + '°C ' + body.weather[0].description)
            } catch (e) {
              console.warn(e, body)
              resolve(body.name + ', ' + Math.round(body.main.temp) + '°C ' + body.weather[0].description)
            }
          } else {
            console.warn(city, body)
            resolve('Daten unvollständig')
          }
        } else {
          resolve('Weather API is down. ⚠')
        }
      })
    } catch (e) {
      console.warn(e)
      resolve('Weather API is down. ⚠')
    }
  })
}

exports.add = (user, channel, msg) => {
  return new Promise(function (resolve) {
    // console.log(user, channel, msg)
    let n = msg.indexOf(' ')
    if (msg.length === 0 && n !== -1) {
      resolve('kein Befehl')
      return
    }
    const instruction = msg.substr(0, n).toLowerCase()
    const value = msg.substr(++n)
    if (value.length === 0) {
      resolve('kein Text')
      return
    }

    db.commands[channel].cmd[instruction] = { permission: {}, text: value }
    db.commands_save()
    resolve('Command ' + instruction + ' [' + value + '] wurde übernommen.')
  })
}

exports.del = (user, channel, msg) => {
  return new Promise(function (resolve) {
    // console.log(user, channel, msg)
    if (msg.length === 0) {
      resolve('kein Befehl')
      return
    }
    if (!db.commands[channel].cmd[msg]) {
      resolve('Befehl [' + msg + '] nicht gefunden')
      return
    }
    delete db.commands[channel].cmd[msg]
    db.commands_save()
    resolve('Command ' + msg + ' wurde gelöscht.')
  })
}

exports.counter = (channel, msg) => {
  return new Promise(function (resolve) {
    resolve(db.commands[channel].cmd[msg].counter++)
    db.commands_save()
  })
}

exports.giveaway = (user, msg) => {
  return new Promise(function (resolve) {
    resolve()
  })
}

exports.submit = (user, msg) => {
  return new Promise(function (resolve) {
    // io.of('/submit/'+channel.substr(1)).emit('incomingmsg', {'user': user.username, 'color': user.color, 'text': cmdall.substr(7), 'emotes': user.emotes })
    resolve()
  })
}

exports.pubg = (command, username, action, platform, mode) => {
  return new Promise(async function (resolve) {
    console.log(username, action, platform, mode)
    let errPget, body
    if (username && username.toLowerCase() !== 'help') {
      [errPget, body] = await cache.Pget('api.pubgtracker.com/v2/profile/pc/' + username)
      if (body && !errPget) {
        console.log('// Daten aus Redis')
        body = JSON.parse(body)
      } else {
        if (errPget) { console.warn('\x1b[31m%s\x1b[0m', errPget) }
        // body = await _fetchPubgtrackerQueue(username)
        body = await _fetchPubgtrackerthrottle(username)

        cache.set('api.pubgtracker.com/v2/profile/pc/' + username, JSON.stringify(body), (err) => { if (err) { console.log('redis set: ' + err) } })
      }
    } else {
      action = 'help'
    }

    if (platform) { platform = platform.toLowerCase() } else { platform = 'eu' }
    if (action) { action = action.toLowerCase() } else { action = 'kd' }
    if (mode) { mode = mode.toLowerCase() }
    console.log(body)
    // console.log(body.stats[0]);
    // console.log(body.stats[1]);

    const result = {}
    let done = ''
    try {
      for (let i = 0; i < body.stats.length; i++) {
        if (body.stats[i].region === platform && (mode ? mode === body.stats[i].mode : true)) {
          result.mode = body.stats[i].mode
          if (action === 'kd') {
            // xgerhard's K/D ratio: 3.73 (Top 12%, #385) [Solo, EU].
            for (let ii = 0; ii < body.stats[i].stats.length; ii++) {
              const field = body.stats[i].stats[ii].field
              if (field === 'KillDeathRatio') {
                result.kd = body.stats[i].stats[ii].value
              }
              if (field === 'WinRatio') {
                result.ratio = body.stats[i].stats[ii].displayValue
                result.rank = body.stats[i].stats[ii].rank
              }
            }
            // console.log("end?, i"+i);
            console.log(result)
            done = username + '\'s K/D ratio: ' + result.kd + ' (Top ' + result.ratio + ' , #' + result.rank + ') [' + _capitalizeFirstLetter(result.mode) + ', ' + platform.toUpperCase() + ']'
            break
          } else if (action === 'time') {
            // xgerhard: xgerhard's Time survived: 14 days, 18 hours and 45 minutes (354.74 hours) (Top 34%, #3,373) [Solo, EU].
            for (let ii = 0; ii < body.stats[i].stats.length; ii++) {
              const field = body.stats[i].stats[ii].field
              if (field === 'TimeSurvived') {
                result.survived = body.stats[i].stats[ii].displayValue
                result.rank = body.stats[i].stats[ii].rank
              }
            }
            done = username + '\'s Time survived: ' + result.survived + '(#' + result.rank + ') [' + _capitalizeFirstLetter(result.mode) + ', ' + platform.toUpperCase() + ']'
            break
            // } else if (action === "stats") {
            // xgerhard: xgerhard stats summary: [Skill rating: 1944.4 (#63,038)], [K/D ratio: 3.73 (#385)], [Wins: 4 (#64,219)], [Top 10 placements: 7 (#2,179)], [Win %: 21.05 (#236)], [Time survived: 354.74 hours (#3,373)] [Solo, EU].

            // break
          } else { // Wrong
            // done = '@'+username+ ' '+command+' <pubguser> kd/time/stats eu/na/as/agg Solo/Duo/Squad/Solo-fpp'
            done = '@' + username + ' ' + command + ' <pubguser> kd/time Eu/Na/As/Agg Solo/Duo/Squad/Solo-fpp'
            break
          }
        }
      }
    } catch (error) {
      console.warn(error)
      console.log(body)
    }
    resolve(done)
    // outputMessage += "For " + matchTypes[type] + " you have " +player[matchTypes[type]].wins+" wins, "+player[matchTypes[type]].kills+" kills, k/d of "+player[matchTypes[type]].kd+", and an average "+player[matchTypes[type]].damagePg+" damage.\n";
  })
}

function _capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const _fetchPubgtrackerthrottle = _.throttle((username) => {
  return new Promise(function (resolve) {
    requestjson.createClient('https://api.pubgtracker.com').get('v2/profile/pc/' + username, { headers: { 'TRN-Api-Key': config.Pubg_TRN_Api_Key } }, function (err, res, body) {
      if (err) console.log(err)
      if (res.statusCode !== 200) {
        console.log('api.pubgtracker.com down? ' + res.statusCode)
      }
      setTimeout(() => {
        resolve(body)
      }, 2000)
    })
  })
}, 2000)

exports.warteschlange = {}
// exports.warteschlange = {
//   kirby: [
//     {sub: true, name: ''}
//   ]
// }

// var warteschlange = {}
// warteschlange['kirby'] = []

// warteschlange['kirby'].push({ sub: true, name: '1'})
// warteschlange['kirby'].push({ sub: true, name: '2'})
// warteschlange['kirby'].push({ sub: true, name: '3'})
// warteschlange['kirby'].push({ sub: false, name: '4'})
// warteschlange['kirby'].push({ sub: true, name: '5'})
// warteschlange['kirby'].push({ sub: true, name: '6'})
// warteschlange['kirby'].push({ sub: true, name: '7'})
// warteschlange['kirby'].push({ sub: false, name: '8'})
// warteschlange['kirby'].push({ sub: true, name: '9'})
// warteschlange['kirby'].push({ sub: false, name: '10'})
// warteschlange['kirby'].push({ sub: false, name: '11'})

// console.log('warteschlange', warteschlange)

// var list = warteschlange['kirby']
// var result = []
// for (let i = 0, len = list.length; i < len; i++) {
//   if (list[i].sub) {
//     result.push(`[${i}] ${list[i].name}`)

//     if (i === 9) {
//       break
//     }
//   }
// }
// console.log(result)

// exports.warteschlange_list = (channel, at) => {
//   return new Promise(function (resolve) {
//     const list = exports.warteschlange[channel]
//     if (!list) { return resolve('') }
//     let result = []

//     if (list.length) {
//       // result.push(`${list.length} haben teilgenommen:`) // in der Warteschlange
//       let c = 1
//       for (let i = 0, len = list.length; i < len; i++) {
//         if (list[i].sub) { // Subs
//           if (at) {
//             result.push(`[${c}] @${list[i].name}`)
//           } else {
//             result.push(`[${c}] ${list[i].name}`)
//           }
//           c++

//           if (i === 9) {
//             break
//           }
//         }
//       }
//       if (result.length < 11) { // Limit noch nicht erreicht
//         for (let i = 0, len = list.length; i < len; i++) {
//           if (!list[i].sub) { // NonSubs
//             if (at) {
//               result.push(`[${c}] @${list[i].name}`)
//             } else {
//               result.push(`[${c}] ${list[i].name}`)
//             }
//             c++

//             if (result.length === 11) {
//               break
//             }
//           }
//         }
//       }
//     }
//     resolve(result.join(', '))
//   })
// }

exports.warteschlange_list = (channel, at, num = null) => {
  if (!exports.warteschlange[channel]) { exports.warteschlange[channel] = { subs: [], non: [] } }
  let result = []
  console.log('exports.warteschlange[channel]', exports.warteschlange[channel], channel, at, num)

  if (exports.warteschlange[channel].subs.length === 0 && exports.warteschlange[channel].non.length === 0) {
    return '0' // Liste leer
  }

  if (num === null) {
    if (at) return exports.warteschlange[channel].subs.concat(...exports.warteschlange[channel].non).map(o => `@${o}`).join(', ')
    else return exports.warteschlange[channel].subs.concat(...exports.warteschlange[channel].non).join(', ')
  }

  if (exports.warteschlange[channel].subs.length > num) {
    result = exports.warteschlange[channel].subs.slice(0, num)
    const _num = num - exports.warteschlange[channel].subs.length
    exports.warteschlange[channel].subs.splice(0, num) // ich brauche einen positiven Wert
    num = _num
  } else {
    result = exports.warteschlange[channel].subs.slice(0, num)
    num = num - exports.warteschlange[channel].subs.length
    const _num = num - exports.warteschlange[channel].subs.length
    exports.warteschlange[channel].subs.splice(0, num) // ich brauche einen positiven Wert
    num = _num
  }

  if (num < 1) {
    console.log('num < 1')
    if (at) return result.map(o => `@${o}`).join(', ')
    else return result.join(', ')
  }

  if (exports.warteschlange[channel].non.length > num) {
    console.log('exports.warteschlange[channel].non.length > num')
    const resultTemp = exports.warteschlange[channel].non.slice(0, num)
    exports.warteschlange[channel].non.splice(0, num)
    result.push(...resultTemp)
  } else {
    console.log('exports.warteschlange[channel].non.length < num')
    // result = exports.warteschlange[channel].non.slice(0, num)
    const resultTemp = exports.warteschlange[channel].non.slice(0, num)
    result.push(...resultTemp)
    exports.warteschlange[channel].non.splice(0, num)
  }

  if (at) return result.map(o => `@${o}`).join(', ')
  else return result.join(', ')
}

// OLD
// [#kirby] <spddl_bot>: [1] Dardrahan, [2] wichtelkopf, [3] wichtelkopf in der Warteschlange
// exports.warteschlange_list = (channel, at, num) => {
//   return new Promise(function (resolve) {
//     if (!db.settingsprivate[channel].botsettings.warteschlange) return resolve('warteschlange ist derzeit deaktiviert')
//     // if (!exports.warteschlange[channel]) { console.log('!exports.warteschlange[channel]'); return resolve('') }
//     if (!exports.warteschlange[channel]) { exports.warteschlange[channel] = { subs: [], non: [] } }
//     const list = exports.warteschlange[channel]
//     let result = []
//     let c = 1

//     if (list.subs.length === 0 && list.non.length === 0) {
//       return resolve('0') // Liste leer
//     }

//     // if (!list.active) {
//     //   return resolve('') // Aus
//     // }

//     if (list.subs.length) {
//       for (let i = 0, len = list.subs.length; i < len; i++) {
//         if (at) {
//           result.push(`[${c}] @${list.subs[i]}`)
//         } else {
//           result.push(`[${c}] ${list.subs[i]}`)
//         }
//         c++
//         if (i === 9) {
//           break // 10 Subs sind voll
//         }
//       }
//     }
//     if (list.non.length) {
//       if (result.length < 11) { // Limit noch nicht erreicht
//         for (let i = 0, len = list.non.length; i < len; i++) {
//           if (at) {
//             result.push(`[${c}] @${list.non[i]}`)
//           } else {
//             result.push(`[${c}] ${list.non[i]}`)
//           }
//           c++
//           if (result.length === 11) { // 10 Plätze sind voll
//             break
//           }
//         }
//       }
//     }
//     if (result.length === 0) return resolve('0')
//     resolve(result.join(', '))
//   })
// }

exports.warteschlange_start = (channel, num = 10) => {
  return new Promise(async resolve => {
    console.log('warteschlange_start', channel)
    if (!isNaN(num)) Number(num)

    const list = await exports.warteschlange_list(channel, true, num)
    console.log('list', list)

    resolve(list)
  })
}

exports.warteschlange_add = (user, channel, addUser) => {
  return new Promise(function (resolve) {
    if (!exports.warteschlange[channel]) { exports.warteschlange[channel] = { subs: [], non: [] } }

    const name = user['display-name'] || user.username

    // TODO: wenn der User schon in der Liste ist diesen wieder entfernen
    let newUser
    console.log(`if (${addUser} && (${channel} === ${name} || ${user.mod})) {`)
    if (addUser && (channel.toLowerCase() === name.toLowerCase() || user.mod)) {
      newUser = addUser // std: Sub ?
      console.log('newUser =', addUser)
      // TODO: Sub und nicht per Push sonder unshift
    } else {
      if (!db.settingsprivate[channel].botsettings.warteschlange) return resolve('')

      const indexSub = exports.warteschlange[channel].subs.indexOf(name)
      if (indexSub !== -1) {
        console.log('warteschlange_add', name, 'entfernen')
        exports.warteschlange[channel].subs.splice(indexSub, 1)
        return resolve(exports.warteschlange[channel].subs.length + exports.warteschlange[channel].non.length)
      }

      const indexNon = exports.warteschlange[channel].non.indexOf(name)
      if (indexNon !== -1) {
        console.log('warteschlange_add', name, 'entfernen')
        exports.warteschlange[channel].non.splice(indexNon, 1)
        return resolve(exports.warteschlange[channel].subs.length + exports.warteschlange[channel].non.length)
      }

      newUser = name
    }

    console.log('warteschlange_add', { subs: user.subscriber, name: newUser })

    if (user.badges && ('subscriber' in user.badges || 'founder' in user.badges)) { // https://github.com/tmijs/tmi.js/issues/364#issuecomment-544278635
    // if (user.subscriber || user.badges.founder) {
      exports.warteschlange[channel].subs.push(newUser)
    } else {
      exports.warteschlange[channel].non.push(newUser)
    }

    // exports.warteschlange[channel].push({ sub: user.subscriber, name: newUser})
    resolve(exports.warteschlange[channel].subs.length + exports.warteschlange[channel].non.length)
    // resolve(`${exports.warteschlange[channel].length} in der Warteschlange`)
  })
}

exports.warteschlange_remove = (user, channel, search) => {
  return new Promise(function (resolve) {
    if (!search) { return resolve('') }
    if (!exports.warteschlange[channel]) {
      console.log('create warteschlange')
      exports.warteschlange[channel] = { subs: [], non: [] }
    }

    const indexSub = exports.warteschlange[channel].subs.indexOf(search)
    if (indexSub !== -1) {
      console.log('warteschlange_remove', search)
      exports.warteschlange[channel].subs.splice(indexSub, 1)
      return resolve(exports.warteschlange[channel].subs.length + exports.warteschlange[channel].non.length)
    }

    const indexNon = exports.warteschlange[channel].non.indexOf(search)
    if (indexNon !== -1) {
      console.log('warteschlange_remove', search)
      exports.warteschlange[channel].non.splice(indexNon, 1)
      return resolve(exports.warteschlange[channel].subs.length + exports.warteschlange[channel].non.length)
    }
    resolve(exports.warteschlange[channel].subs.length + exports.warteschlange[channel].non.length)
  })
}

exports.warteschlange_toggle = (channel, status) => {
  return new Promise(function (resolve) {
    if (!exports.warteschlange[channel]) { exports.warteschlange[channel] = { subs: [], non: [] } }
    if (status) {
      status = status.toLowerCase()
    } else {
      status = ''
    }
    switch (status) {
      case 'off':
      case 'aus':
      case '0':
        console.log('warteschlange_add AUS')
        db.settingsprivate[channel].botsettings.warteschlange = false
        return resolve('[Aus]')
        // break
      case 'on':
      case 'an':
      case '1':
        console.log('warteschlange_add AN')
        db.settingsprivate[channel].botsettings.warteschlange = true
        return resolve('[An]')
        // break
      default:
        db.settingsprivate[channel].botsettings.warteschlange = !db.settingsprivate[channel].botsettings.warteschlange
        if (db.settingsprivate[channel].botsettings.warteschlange) {
          return resolve('[An]')
        } else {
          return resolve('[Aus]')
        }
    }
    // resolve('off, aus, 0 oder on, an, 1')
  })
}

exports.warteschlange_clear = channel => {
  return new Promise(function (resolve) {
    console.log('create warteschlange_clear')
    const active = db.settingsprivate[channel].botsettings.warteschlange || true
    exports.warteschlange[channel] = { active: active, subs: [], non: [] }
    resolve(null)
  })
}

const FaceitAPIkey = ''
const FaceitIds = {
  kirby: ''
}
exports.faceitelo = channel => {
  return new Promise((resolve, reject) => {
    // "https://open.faceit.com/data/v4/players/" - H "accept: application/json" - H "Authorization: Bearer "
    requestjson.createClient('https://open.faceit.com/data/v4/players/').get(FaceitIds[channel], { headers: { accept: 'application/json', Authorization: 'Bearer ' + FaceitAPIkey } }, (err, res, body) => {
      if (!err && res.statusCode === 200 && body !== null) {
        if (!err) {
          resolve(body.games.csgo.faceit_elo)
        } else {
          reject(err)
        }
      } else {
        resolve('Faceit API nicht verfügbar')
      }
    })
  })
}

exports.faceitmatchlink = channel => {
  return new Promise((resolve, reject) => {
    requestjson.createClient('https://api.faceit.com/match/v1/matches/groupByState').get('?userId=' + FaceitIds[channel], (err, res, body) => {
      if (!err && res.statusCode === 200 && body) {
        if (!err) {
          if (body.payload && (body.payload.ONGOING || body.payload.READY)) {
            if (body.payload.ONGOING) {
              resolve(`https://www.faceit.com/en/csgo/room/${body.payload.ONGOING[0].id}`)
            } else if (body.payload.READY) {
              resolve(`https://www.faceit.com/en/csgo/room/${body.payload.READY[0].id}`)
            }
          } else {
            resolve('Aktuell in keinem Match')
          }
        } else {
          reject(err)
        }
      } else {
        resolve('Faceit API nicht verfügbar')
      }
    })
  })
}

// exports.json = (user, msg) => {
//   return new Promise(function (resolve) {
//     var text
//     if (user.username === 'spddl') {
//       let chan = cmd[1].toLowerCase().replace('#', '')
//       db.settings.channels.push('#' + chan)
//       db.settings.botchannels.push('#' + chan)

//       db.settings_save()

//       client.join('#' + chan)
//       bot.say('#' + chan, 'hi.')
//       text = 'hi.'
//     }
//     resolve(text)
//   })
// }

// exports.part = (user, msg) => {
//   return new Promise(function (resolve) {
//     var text
//     if (user.username === 'spddl') {
//       text = 'bye.'
//       client.part(channel)
//     }
//     resolve(text)
//   })
// }

// function _fetchPubgtrackerQueue(username){
//   return new Promise(function (resolve) {
//     q.push(username, function (data) {
//       resolve(data);
//     });
//   })
// }

// const q = async.queue(function (username, callback) { // 1 request per 2 seconds.
//   requestjson.createClient('https://api.pubgtracker.com').get('v2/profile/pc/'+username, { headers: { "TRN-Api-Key": config.Pubg_TRN_Api_Key }}, function(err, res, body) {
//     if (res.statusCode !== 200) {
//       console.log("api.pubgtracker.com down? "+res.statusCode);
//     }
//     setTimeout(() => {
//       callback(body)
//     }, 2000);
//   })
// }, 1);

// let [errPget, dataset] = await cache.Pget('ICSGOServers_730/GetGameServersStatus');
// if (dataset && !errPget) {
//   resolve(dataset); // Daten aus Redis
// } else {
//   if (errPget) { console.warn('\x1b[31m%s\x1b[0m', errPget); }
//   requestjson.createClient('http://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v001/').get("?key="+config.steamapikey, function(err, res, body) {
//     if (!err && res.statusCode === 200 && body.stream !== null) {
//       if (!err) {
//         resolve(body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer ØWartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden');
//         // let err = await cache.Pset('ICSGOServers_730/GetGameServersStatus', body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer ØWartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden')
//         // if (err) { console.warn(err); }
//         cache.set('ICSGOServers_730/GetGameServersStatus', body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer ØWartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden', (err) => { if (err) { console.log("redis set: "+err); } })
//       } else {
//         reject(err);
//       }
//     }else{
//       resolve('SteamAPI nicht verfügbar')
//     }
//   });
// }

/*

  case "ow":
    if(!(db.settingsprivate[channel.substr(1)].botsettings.overwatch === false)) {
      overwatch_status(channel, user, cmdall)
    } else {
      console.warn('[Block] botsettings.overwatch: '+settingsprivate[channel.substr(1)].botsettings.overwatch);
    }
  break;
  case "market":
    // if(!(db.settingsprivate[channel.substr(1)].botsettings.market === false)) return
    if(!(db.settingsprivate[channel.substr(1)].botsettings.market === false)) {
      market(channel, user, cmdall)
    } else {
      console.warn('[Block] botsettings.market: '+settingsprivate[channel.substr(1)].botsettings.market);
      return;
    }
  break;
  case "knife":
    if(!(db.settingsprivate[channel.substr(1)].botsettings.knife === false)) {
      knife(channel, user, cmdall)
    } else {
      console.warn('[Block] botsettings.knife: '+settingsprivate[channel.substr(1)].botsettings.knife);
      return;
    }
  break;

      case "song": // TODO
          // if(!(db.settingsprivate[channel.substr(1)].botsettings.song === false)) return
          if(!(db.settingsprivate[channel.substr(1)].botsettings.song === false)) {

            if (db.settingsprivate[channel.substr(1)].botsettings.lastfmname || ''){
              lastfm.request('user.getRecentTracks', {
                  limit: '1',
                  user: settingsprivate[channel.substr(1)].botsettings.lastfmname,
                  handlers: {
                      success: function(data) {
                        try {
                          if (user.type === 'steam') steam_say(user,_.values(data.recenttracks.track[0].artist)[0]+' - '+data.recenttracks.track[0].name)
                          else if (user.type === 'twitchgroup') bot.whisper(user.username, _.values(data.recenttracks.track[0].artist)[0]+' - '+data.recenttracks.track[0].name)
                          else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: _.values(data.recenttracks.track[0].artist)[0]+' - '+data.recenttracks.track[0].name})
                          else bot.say(channel,_.values(data.recenttracks.track[0].artist)[0]+' - '+data.recenttracks.track[0].name,4)
                        }
                        catch (e) {
                          console.critical(e);
                        }
                      },
                      error: function(error) {
                          console.error('Error: ' + error.message);
                      }
                  }
              });
            }

          } else {
            console.warn('[Block] botsettings.song: '+settingsprivate[channel.substr(1)].botsettings.song);
          }

          case "add":
            if(adminCheck(user, channel)){
              if (db.settingsprivate[channel.substr(1)].botsettings.addtoggle) {
                //Da "add" getriggert ist läuft der Command nicht weiter
                addcommand(channel, cmdall, user)
              } else {
                if (user.type === 'steam') steam_say(user, '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text')
                else if (user.type === 'twitchgroup') bot.whisper(user.username, '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text')
                else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text'})
                else bot.say(channel, '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text',1)
              }
            }
          break;
          case "del":
      	  case "delete":
            if(adminCheck(user, channel)){
              if(cmd[1] !== undefined) {
                if (commands[channel.substr(1)].cmd[cmd[1].toLowerCase()]){
                  deletecommand(channel, cmd[1], user);
                }
              }
            }
          break;

          case "addmod":
            if(adminCheck(user, channel)){
              addmod(channel, cmd[1], user)
            }
          break;
          case "delmod":
            if(adminCheck(user, channel)){
              if(cmd[1] !== undefined){
                delmod(channel, cmd[1], user)
              }
            }
          break;

          function parseCmd(cmd,channel,user){
            //var user = user || 'Steam'

            if(localhost()) console.info('parseCmd(cmd: '+cmd+', channel: '+channel+', user: %j )', user)

              // if (user.type === 'steam') steam_say(user,'!weather city')
              // else if (user.type === 'twitchgroup') groupirc.say('#jtv','/w '+user.username.substr(8)+' !weather city')
              // else bot.say(channel,'!weather city')
              //
              // if (user.type === 'steam') steam_say(user,adm)
              // else if (user.type === 'twitchgroup') groupirc.say('#jtv','/w '+user.substr(8)+' '+adm)
              // else bot.say(channel,adm)

            var cmdall = cmd
            cmd = cmd.split(' ');

            try {

              // follow
              if (db.settingsprivate[channel.substr(1)].botsettings.followercheck || false){
              	if (cmd[0].toLowerCase() == 'follow'){
              		if(cmd[1] !== undefined){
              			twitchfollower(user, channel.substr(1), cmd[1],function(text) {
                      bot.say(channel,text);
              			})
              		}else{
              			twitchfollower(user, channel.substr(1), false, function(text){
                      bot.say(channel,text);
                    })
              		}
              		return;
              	}
              }

              if (db.settingsprivate[channel.substr(1)].botsettings.subage || false){
                //if (cmd[0].toLowerCase() == 'subage' && (channel === '#kirby' || channel === '#spddl_bot')){
                if (cmd[0].toLowerCase() == 'subage' && channel === '#kirby'){
                  if(cmd[1] !== undefined){
                    twitchsub(user, channel.substr(1), cmd[1],function(text) {
                      if (user.type === 'steam') steam_say(user,text)
                      else if (user.type === 'twitchgroup') bot.whisper(user.username, text)
                      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: text})
                      else bot.say(channel,text)
                    })
                  }else{
                    twitchsub(user, channel.substr(1), false, function(text){
                      if (user.type === 'steam') steam_say(user,text)
                      else if (user.type === 'twitchgroup') bot.whisper(user.username, text)
                      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: text})
                      else bot.say(channel,text)
                    })
                  }
                  return;
                }
              }

              if (db.settingsprivate[channel.substr(1)].botsettings.subs || false){

                if (cmd[0].toLowerCase() == 'subs' && channel === '#kirby'){
                  twitchsubs(user, channel.substr(1),function(text) {
                    if (user.type === 'steam') steam_say(user,text)
                    else if (user.type === 'twitchgroup') bot.whisper(user.username, text)
                    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: text})
                    else bot.say(channel,text)
                  })
                  return;
              	}
              }

              if (user.username == 'kirby') {
                if (cmd[0].toLowerCase() == 'invite') {
                  // var msg = user.msg.slice(7)
                  sendInv(cmd[1], user, function(name){
                    if (user.type === 'steam') steam_say(user, name+' bekommt eine Gruppen einladung')
                    else if (user.type === 'twitchgroup') bot.whisper(user.username, name+' bekommt eine Gruppen einladung')
                    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: name+' bekommt eine Gruppen einladung'})
                    else bot.say(channel,name+' bekommt eine Gruppen einladung')
                  })
                  return;
                }
              }

            // giveaway
            if (db.settingsprivate[channel.substr(1)].botsettings.giveawaytoggle || false){
              if (cmd[0].toLowerCase() == 'giveaway'){
                //console.log(cmdall.substr(9));
                if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                  bot.say(channel,'.me GIVEAWAY!! GIVEAWAY!!',0); // TODO: KeyWord
                  settings[channel.substr(1)].giveawaysuspend = settingsprivate[channel.substr(1)].botsettings.giveaway.giveawaysuspend // Bots
                  if (cmd[1]) {
                    settingsprivate[channel.substr(1)].botsettings.giveaway.keyword = cmdall.substr(10)
                    setTimeout(function(){
                      bot.say(channel,'.me KeyWord: '+cmdall.substr(9),10);
                    }, 100);
                  }
                  bot.whisper(channel.substr(1), 'Um das Giveaway zu starten http://bot.spddl.de/giveaway') // bot.say(channel,'/me Jeder Sub der etwas im Chat schreibt ist dabei!'); // TODO config aus der JSON laden und die Nachricht anpassen
                  settings[channel.substr(1)].giveaway = true
                }
                return;
              }
            }

            // COUNTER
            if(commands[channel.substr(1)].counter[cmd[0].toLowerCase()]){
              counter(cmd[0].toLowerCase(), user.username, channel.substr(1), function(data){
                if (user.type === 'steam') steam_say(user,data)
                else if (user.type === 'twitchgroup') bot.whisper(user.username, data)
                else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: data})
                else bot.say(channel,data)
              })
              return; // um die Funktion zu beenden
            }

          } catch (e) { console.error(e+' | parseCmd('+cmd+','+channel+', %j )', user) }

            switch(cmd[0].toLowerCase()){
              case "shot": //https://twitter.com/oddshot_tv/status/633970483835334656
              break;
              case "part":
                if(user.username == 'spddl'){
                  bot.say(channel,'bye.',8);
                  client.part(channel)
                }
              break;
              case "join":
                if(user.username == 'spddl'){ // !join #channel

                  var chan = cmd[1].toLowerCase().replace('#','')
                  // if (localhost()) {
                    // settings.localchannels.push('#'+chan)
                    // settings.localbotchannels.push('#'+chan)
                  // } else {
                    db.settings.channels.push('#'+chan)
                    // settings.botchannels.push('#'+chan)
                  // }
                  db.settings_save()

                  client.join('#'+chan)
                  bot.say('#'+chan,'hi.');
                }
              break;
              case "status": // TODO:
                //if(!(db.settingsprivate[channel.substr(1)].botsettings.status === false)) return
                if(!(db.settingsprivate[channel.substr(1)].botsettings.status === false)) {
                  if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                    getStatus(channel, user);
                  }
                } else {
                  console.warn('[Block] botsettings.status: '+settingsprivate[channel.substr(1)].botsettings.status);
                }
              break;
              case "permit":
              case "allow":
                // if(!(db.settingsprivate[channel.substr(1)].botsettings.permit === false)) return
                if(!(db.settingsprivate[channel.substr(1)].botsettings.permit === false)) {
                  if (cmd[1]) {
                    if(user.type === 'steam'){
                      settings[channel.substr(1)].allowing.push(cmd[1].toLowerCase());
                      bot.say(channel,'.me is allowing links from '+cmd[1]+' (2min)');
                      setTimeout(function(){noMoreLinks(cmd[1].toLowerCase(), channel);},120000);
                    }
                    if(user.type === 'twitchgroup'){
                      settings[channel.substr(1)].allowing.push(cmd[1].toLowerCase());
                      bot.say(channel,'.me is allowing links from '+cmd[1]+' (2min)');
                      setTimeout(function(){noMoreLinks(cmd[1].toLowerCase(), channel);},120000);
                    }
                    if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                      settings[channel.substr(1)].allowing.push(cmd[1].toLowerCase());
                      bot.say(channel,'.me is allowing links from '+cmd[1]+' (2min)');
                      setTimeout(function(){noMoreLinks(cmd[1].toLowerCase(), channel);},120000);
                    }else{
                      bot.say(channel,"Nice try, "+user.username+", but I do not obey you.",4);
                    }
                    console.log(settings[channel.substr(1)].allowing);
                  }
                } else {
                  console.warn('[Block] botsettings.permit: '+settingsprivate[channel.substr(1)].botsettings.permit);
                }

              break;
              // case "clear":
              //   if(adminCheck(user.username)){
              //     violators = [];
              //     bot.say(channel,"Violations have been cleared.")
              //   }else{
              //     bot.say(channel,"Nice try, "+user+", but I do not obey you.");
              //   }
              //   break;
              //case "help":
              //  if(adminCheck(user.username, channel)){
              //    bot.say(channel,"=======================");
              //    bot.say(channel,"status - get various information");
              //    bot.say(channel,"admin - display people I listen to");
              //    bot.say(channel,"violators - display people that annoy");
              //    bot.say(channel,"allow [name]- admins only; allows user to post links");
              //    bot.say(channel,"setviewers [#] - admins only; set the viewer count to the right #");
              //    bot.say(channel,"clear - admins only; clears violators");
              //    bot.say(channel,"creator - find out who the genius is behind this bad ass bot");
              //    bot.say(channel,"=========================================");
              //  }
              //  break;
              // case "admin":
              //   var adm = "People who can control me are: ";
              //   admins.indexOf(channel.substr(1)) != -1 ? console.log('Hoster ist Admin') : admins.push(channel.substr(1))
              //   console.log(channel.substr(1)+' admin|channel.substr(1) '+admins.length)
              //   for(var j = 0; j < admins.length;j++){
              //     adm += (j == 0) ? admins[j] : ", "+admins[j];
              //     console.log(admins[j]+'  '+j+'  '+adm)
              //   }
              //   admins.slice(-1)[0] == channel.substr(1) ? admins.pop() : console.log('Hoster ist std Admin') // array muss nicht gekürzt werden
              //   if (user.type === 'steam') steam_say(user,adm)
              //   else if (user.type === 'twitchgroup') groupirc.say('#jtv','/w '+user.username.substr(8)+' '+adm)
              //   else bot.say(channel,adm)
              // break;
              case "violators":
               // TODO nur Ich darf das
               //  if(user["user-type"] === "mod" || user.username === channel.substr(1)){
               //    getViolatorsList(channel, user);
               //  }

              break;
              // case "esea":
              //   if(!(db.settingsprivate[channel.substr(1)].botsettings.esea === false)) {
              //     //esea(channel, user)
              //     esea(channel, user, cmdall)
              //   } else {
              //     console.warn('[Block] botsettings.esea: '+settingsprivate[channel.substr(1)].botsettings.esea);
              //   }
              // break;
              // case "lastesea":
              //   if(!(db.settingsprivate[channel.substr(1)].botsettings.lastesea === false)) {
              //     //lastesea(channel, user)
              //     lastesea(channel, user, cmdall)
              //   } else {
              //     console.warn('[Block] botsettings.lastesea: '+settingsprivate[channel.substr(1)].botsettings.lastesea);
              //   }
              // break;
              case "ow":
                if(!(db.settingsprivate[channel.substr(1)].botsettings.overwatch === false)) {
                  overwatch_status(channel, user, cmdall)
                } else {
                  console.warn('[Block] botsettings.overwatch: '+settingsprivate[channel.substr(1)].botsettings.overwatch);
                }
              break;
              case "market":
                // if(!(db.settingsprivate[channel.substr(1)].botsettings.market === false)) return
                if(!(db.settingsprivate[channel.substr(1)].botsettings.market === false)) {
                  market(channel, user, cmdall)
                } else {
                  console.warn('[Block] botsettings.market: '+settingsprivate[channel.substr(1)].botsettings.market);
                  return;
                }
              break;
          	  case "knife":
                if(!(db.settingsprivate[channel.substr(1)].botsettings.knife === false)) {
                  knife(channel, user, cmdall)
                } else {
                  console.warn('[Block] botsettings.knife: '+settingsprivate[channel.substr(1)].botsettings.knife);
                  return;
                }
              break;
              case "weather":
                if(cmd[1] !== undefined){
                  //console.alert('1WETTER? cmd[1] !== undefined '+channel);
                  //weather(channel, user, cmd[1], cmd[2]);
                  weather(channel, user, cmdall.substr(9));
                }else{
                  if(user["user-type"] === "mod" || user.username === channel.substr(1)){
            				weathertoggle(channel, user)
            			} else {
                    if (user.type === 'steam') steam_say(user,'!weather city')
                    else if (user.type === 'twitchgroup') bot.whisper(user.username, '!weather city')
                    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '!weather city'})
                    else bot.say(channel,'!weather city')
                  }
                }
              break;
              case "wrongcommandmsg":
                if(adminCheck(user, channel)){
                  settingsprivate[channel.substr(1)].botsettings.wrongcommandmsg = !settingsprivate[channel.substr(1)].botsettings.wrongcommandmsg
                  //bot.say(channel,commands[channel.substr(1)].botsettings.wrongcommandmsg === true ? "Benachrichtigung über falschen Command aktiviert" : "Benachrichtigung über falschen Command deaktiviert")
                  if (user.type === 'steam') steam_say(user,settingsprivate[channel.substr(1)].botsettings.wrongcommandmsg === true ? "Benachrichtigung über falschen Command aktiviert" : "Benachrichtigung über falschen Command deaktiviert");
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, settingsprivate[channel.substr(1)].botsettings.wrongcommandmsg === true ? 'Benachrichtigung über falschen Command aktiviert' : 'Benachrichtigung über falschen Command deaktiviert')
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: settingsprivate[channel.substr(1)].botsettings.wrongcommandmsg === true ? 'Benachrichtigung über falschen Command aktiviert' : 'Benachrichtigung über falschen Command deaktiviert'})
                  else bot.say(channel,settingsprivate[channel.substr(1)].botsettings.wrongcommandmsg === true ? "Benachrichtigung über falschen Command aktiviert" : "Benachrichtigung über falschen Command deaktiviert",3);
                  savecommand_save()
                }
              break;
              case "wronglinkmsg":
                if(adminCheck(user, channel)){
                  settingsprivate[channel.substr(1)].botsettings.wronglinkmsg = !settingsprivate[channel.substr(1)].botsettings.wronglinkmsg
                  //bot.say(channel,commands[channel.substr(1)].botsettings.wronglinkmsg === true ? "Benachrichtigung über falschen Link aktiviert" : "Benachrichtigung über falschen Link deaktiviert")
                  if (user.type === 'steam') steam_say(user,settingsprivate[channel.substr(1)].botsettings.wronglinkmsg === true ? "Benachrichtigung über falschen Link aktiviert" : "Benachrichtigung über falschen Link deaktiviert")
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, settingsprivate[channel.substr(1)].botsettings.wronglinkmsg === true ? 'Benachrichtigung über falschen Link aktiviert' : 'Benachrichtigung über falschen Link deaktiviert')
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: settingsprivate[channel.substr(1)].botsettings.wronglinkmsg === true ? 'Benachrichtigung über falschen Link aktiviert' : 'Benachrichtigung über falschen Link deaktiviert'})
                  else bot.say(channel,settingsprivate[channel.substr(1)].botsettings.wronglinkmsg === true ? "Benachrichtigung über falschen Link aktiviert" : "Benachrichtigung über falschen Link deaktiviert",3)
                  savecommand_save()
                }
              break;
              case "wrongsymbolsmsg":
                if(adminCheck(user, channel)){
                  settingsprivate[channel.substr(1)].botsettings.wrongsymbolsmsg = !settingsprivate[channel.substr(1)].botsettings.wrongsymbolsmsg
                  //bot.say(channel,commands[channel.substr(1)].botsettings.wrongsymbolsmsg === true ? "Benachrichtigung über zuviele Symbole aktiviert" : "Benachrichtigung über zuviele Symbole deaktiviert")
                  if (user.type === 'steam') steam_say(user,settingsprivate[channel.substr(1)].botsettings.wrongsymbolsmsg === true ? "Benachrichtigung über zuviele Symbole aktiviert" : "Benachrichtigung über zuviele Symbole deaktiviert")
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, settingsprivate[channel.substr(1)].botsettings.wrongsymbolsmsg === true ? 'Benachrichtigung über zuviele Symbole aktiviert' : 'Benachrichtigung über zuviele Symbole deaktiviert')
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: settingsprivate[channel.substr(1)].botsettings.wrongsymbolsmsg === true ? 'Benachrichtigung über zuviele Symbole aktiviert' : 'Benachrichtigung über zuviele Symbole deaktiviert'})
                  else bot.say(channel,settingsprivate[channel.substr(1)].botsettings.wrongsymbolsmsg === true ? "Benachrichtigung über zuviele Symbole aktiviert" : "Benachrichtigung über zuviele Symbole deaktiviert",3)
                  savecommand_save()
                }
              break;
              case "wronguppercasemsg":
                if(adminCheck(user, channel)){
                  settingsprivate[channel.substr(1)].botsettings.wronguppercasemsg = !settingsprivate[channel.substr(1)].botsettings.wronguppercasemsg
                  //bot.say(channel,commands[channel.substr(1)].botsettings.wronguppercasemsg === true ? "Benachrichtigung über Capslock aktiviert" : "Benachrichtigung über Capslock deaktiviert")
                  if (user.type === 'steam') steam_say(user,settingsprivate[channel.substr(1)].botsettings.wronguppercasemsg === true ? "Benachrichtigung über Capslock aktiviert" : "Benachrichtigung über Capslock deaktiviert")
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, settingsprivate[channel.substr(1)].botsettings.wronguppercasemsg === true ? 'Benachrichtigung über Capslock aktiviert' : 'Benachrichtigung über Capslock deaktiviert')
                  else bot.say(channel,settingsprivate[channel.substr(1)].botsettings.wronguppercasemsg === true ? "Benachrichtigung über Capslock aktiviert" : "Benachrichtigung über Capslock deaktiviert",3)
                  savecommand_save()
                }
              break;

              case "wrongcommandlevenshtein":
                if(adminCheck(user, channel)){
                  settingsprivate[channel.substr(1)].botsettings.wrongcommandlevenshtein = !settingsprivate[channel.substr(1)].botsettings.wrongcommandlevenshtein
                  if (user.type === 'steam') steam_say(user,settingsprivate[channel.substr(1)].botsettings.wrongcommandlevenshtein === true ? 'nun wird per Levenshtein-Algorithmus der nächste Command gesucht' : 'der Levenshtein-Algorithmus wurde deaktiviert')
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, settingsprivate[channel.substr(1)].botsettings.wrongcommandlevenshtein === true ? 'nun wird per Levenshtein-Algorithmus der nächste Command gesucht' : 'der Levenshtein-Algorithmus wurde deaktiviert')
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: settingsprivate[channel.substr(1)].botsettings.wrongcommandlevenshtein === true ? 'nun wird per Levenshtein-Algorithmus der nächste Command gesucht' : 'der Levenshtein-Algorithmus wurde deaktiviert'})
                  else bot.say(channel,settingsprivate[channel.substr(1)].botsettings.wrongcommandlevenshtein === true ? 'nun wird per Levenshtein-Algorithmus der nächste Command gesucht' : 'der Levenshtein-Algorithmus wurde deaktiviert',3)
                  savecommand_save()
                }
              break;

              case "magicconchshellmodsonly":
                if(adminCheck(user, channel)){
                  settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.modsonly = !settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.modsonly
                  if (user.type === 'steam') steam_say(user,settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.modsonly === true ? "Nur Mods können die Magische Miesmuschel benutzen" : "Jeder darf mit #Frage eine Frage der Magischen Miesmuschel stellen")
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.modsonly === true ? 'Nur Mods können die Magische Miesmuschel benutzen' : 'Jeder darf mit #Frage eine Frage der Magischen Miesmuschel stellen')
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.modsonly === true ? 'Nur Mods können die Magische Miesmuschel benutzen' : 'Jeder darf mit #Frage eine Frage der Magischen Miesmuschel stellen'})
                  else bot.say(channel,settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.modsonly === true ? "Nur Mods können die Magische Miesmuschel benutzen" : "Jeder darf mit #Frage eine Frage der Magischen Miesmuschel stellen")
                  savecommand_save()
                }
              break;
              case "randomreply":
                if(adminCheck(user, channel)){
                  settingsprivate[channel.substr(1)].botsettings.randomreply = !settingsprivate[channel.substr(1)].botsettings.randomreply
                  if (user.type === 'steam') steam_say(user,settingsprivate[channel.substr(1)].botsettings.randomreply === true ? "RandomReplys sind nun eingeschaltet" : "RandomReplys sind nun ausgeschaltet")
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, settingsprivate[channel.substr(1)].botsettings.randomreply === true ? 'RandomReplys sind nun eingeschaltet' : 'RandomReplys sind nun ausgeschaltet')
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: settingsprivate[channel.substr(1)].botsettings.randomreply === true ? 'RandomReplys sind nun eingeschaltet' : 'RandomReplys sind nun ausgeschaltet'})
                  else bot.say(channel,settingsprivate[channel.substr(1)].botsettings.randomreply === true ? "RandomReplys sind nun eingeschaltet" : "RandomReplys sind nun ausgeschaltet")
                	savecommand_save()
                }
              break;
              case "youtubetowhisper":
                if(adminCheck(user, channel)){
                  settingsprivate[channel.substr(1)].botsettings.youtubetowhisper = !settingsprivate[channel.substr(1)].botsettings.youtubetowhisper
                  if (user.type === 'steam') steam_say(user,settingsprivate[channel.substr(1)].botsettings.youtubetowhisper === true ? "YoutubeToWhisper ist nun eingeschaltet" : "YoutubeToWhisper ist nun ausgeschaltet")
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, settingsprivate[channel.substr(1)].botsettings.youtubetowhisper === true ? 'YoutubeToWhisper ist nun eingeschaltet' : 'YoutubeToWhisper ist nun ausgeschaltet')
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: settingsprivate[channel.substr(1)].botsettings.youtubetowhisper === true ? 'YoutubeToWhisper ist nun eingeschaltet' : 'YoutubeToWhisper ist nun ausgeschaltet'})
                  else bot.say(channel,settingsprivate[channel.substr(1)].botsettings.youtubetowhisper === true ? "YoutubeToWhisper ist nun eingeschaltet" : "YoutubeToWhisper ist nun ausgeschaltet",3)
                	savecommand_save()
                }
              break;

              case "followercheck":
                if(adminCheck(user, channel)){
                  settingsprivate[channel.substr(1)].botsettings.followercheck = !settingsprivate[channel.substr(1)].botsettings.followercheck
                  if (user.type === 'steam') steam_say(user,settingsprivate[channel.substr(1)].botsettings.followercheck === true ? "!follow ist nun eingeschaltet" : "!follow ist nun ausgeschaltet")
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, settingsprivate[channel.substr(1)].botsettings.followercheck === true ? '!follow ist nun eingeschaltet' : '!follow ist nun ausgeschaltet')
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: settingsprivate[channel.substr(1)].botsettings.followercheck === true ? '!follow ist nun eingeschaltet' : '!follow ist nun ausgeschaltet'})
                  else bot.say(channel,settingsprivate[channel.substr(1)].botsettings.followercheck === true ? "!follow ist nun eingeschaltet" : "!follow ist nun ausgeschaltet",3)
                  savecommand_save()
                }
              break;

              case "submit":
                  io.of('/submit/'+channel.substr(1)).emit('incomingmsg', {'user': user.username, 'color': user.color, 'text': cmdall.substr(7), 'emotes': user.emotes })
              break;

              case "song": // TODO
                  // if(!(db.settingsprivate[channel.substr(1)].botsettings.song === false)) return
                  if(!(db.settingsprivate[channel.substr(1)].botsettings.song === false)) {

                    if (db.settingsprivate[channel.substr(1)].botsettings.lastfmname || ''){
                      lastfm.request('user.getRecentTracks', {
                          limit: '1',
                          user: settingsprivate[channel.substr(1)].botsettings.lastfmname,
                          handlers: {
                              success: function(data) {
                                try {
                                  if (user.type === 'steam') steam_say(user,_.values(data.recenttracks.track[0].artist)[0]+' - '+data.recenttracks.track[0].name)
                                  else if (user.type === 'twitchgroup') bot.whisper(user.username, _.values(data.recenttracks.track[0].artist)[0]+' - '+data.recenttracks.track[0].name)
                                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: _.values(data.recenttracks.track[0].artist)[0]+' - '+data.recenttracks.track[0].name})
                                  else bot.say(channel,_.values(data.recenttracks.track[0].artist)[0]+' - '+data.recenttracks.track[0].name,4)
                                }
                                catch (e) {
                                  console.critical(e);
                                }
                              },
                              error: function(error) {
                                  console.error('Error: ' + error.message);
                              }
                          }
                      });
                    }
                    // else{
                    //   if (user.type === 'steam') steam_say(user,'Der Bot brauch deinen LastFM Namen um den Aktuellen Track zu erahnen :P')
                    //   else if (user.type === 'twitchgroup') groupirc.say('#jtv','/w '+user.username+' Der Bot brauch deinen LastFM Namen um den Aktuellen Track zu erahnen :P')
                    //   else bot.say(channel,'Der Bot brauch deinen LastFM Namen um den Aktuellen Track zu erahnen :P')
                    // }

                  } else {
                    console.warn('[Block] botsettings.song: '+settingsprivate[channel.substr(1)].botsettings.song);
                  }

              break;
              // case "add":
              //   if(adminCheck(user, channel)){
              //     if (user.type === 'steam') steam_say(user, '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text')
              //     else if (user.type === 'twitchgroup') bot.whisper(user.username, '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text')
              //     else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text'})
              //     else bot.say(channel, '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text',1)
              //   }
              // break;
              case "add":
                if(adminCheck(user, channel)){
                  if (db.settingsprivate[channel.substr(1)].botsettings.addtoggle) {
                    //Da "add" getriggert ist läuft der Command nicht weiter
                    addcommand(channel, cmdall, user)
                  } else {
                    if (user.type === 'steam') steam_say(user, '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text')
                    else if (user.type === 'twitchgroup') bot.whisper(user.username, '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text')
                    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text'})
                    else bot.say(channel, '!add war eigentlich ein dummer move. Neue Commands werden nun einfach überschrieben bzw neu erstellt mit: !command text',1)
                  }
                }
              break;
              case "del":
          	  case "delete":
                if(adminCheck(user, channel)){
                  if(cmd[1] !== undefined) {
                    if (commands[channel.substr(1)].cmd[cmd[1].toLowerCase()]){
                      deletecommand(channel, cmd[1], user);
                    }
                  }
                }
              break;
              case "addmod":
                if(adminCheck(user, channel)){
                  addmod(channel, cmd[1], user)
                }
              break;
              case "delmod":
                if(adminCheck(user, channel)){
                  if(cmd[1] !== undefined){
                    delmod(channel, cmd[1], user)
                  }
                }
              break;
              case "adddomain":
                if(adminCheck(user, channel)){
                  adddomain(channel, cmd[1], user)
                }
              break;
              case "deldomain":
                if(adminCheck(user, channel)){
                  if(cmd[1] !== undefined) {
                    deldomain(channel, cmd[1], user)
                  }
                }
              break;
              case "addignorecmd":
                if(adminCheck(user, channel)){
                  addignorecmd(channel, cmd[1], user)
                  return;
                }
              break;
              case "delignorecmd":
                if(adminCheck(user, channel)){
                  if(cmd[1] !== undefined) {
                    delignorecmd(channel, cmd[1], user)
                    return;
                  }
                }
              break;
              case "addcounter":
                if(adminCheck(user, channel)){
                  addcounter(channel, cmdall, user)
                  return;
                }
              break;
              case "delcounter":
                if(adminCheck(user, channel)){
                  if(cmd[1] !== undefined) {
                    delcounter(channel, cmdall, user)
                    return;
                  }
                }
              break;
              case "addbanwords":
                if(adminCheck(user, channel)){
                  addbanwords(channel, cmdall.substr(12), user)
                }
              break;
              case "delbanwords":
                if(adminCheck(user, channel)){
                  if(cmd[1] !== undefined) {
                    delbanwords(channel,cmdall.substr(12), user)
                  }
                }
              break;
              case "addtowords":
                if(adminCheck(user, channel)){
                  addtowords(channel, cmdall.substr(11), user)
                }
              break;
              case "deltowords":
                if(adminCheck(user, channel)){
                  if(cmd[1] !== undefined) {
                    deltowords(channel, cmdall.substr(11), user)
                  }
                }
              break;
              case "start":
                if(adminCheck(user, channel)){
                  user.channel = channel.substr(1)
                  steam_start(user, cmdall.substr(6))
                }
              break;
              case "steamnotification":
                //if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                if(adminCheck(user, channel)){
                  notification(channel.substr(1), 'steam', user)
                }
              break;
              case "chatnotification":
                //if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                if(adminCheck(user, channel)){
                  notification(channel.substr(1), 'chat', user)
                }
              break;
          	  case "capslock":
                //if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                if(adminCheck(user, channel)){
              		if(!isNaN(cmd[1])){
              			togglecapslock(channel, user, cmd[1])
              		} else {
                    togglecapslock(channel, user)
                  }
                }
              break;
              case "symbols":
                //if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                if(adminCheck(user, channel)){
              		if(!isNaN(cmd[1])){
              			togglesymbols(channel, user, cmd[1])
              		} else {
                    togglesymbols(channel, user)
                  }
                }
              break;
              case "update":
                //if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                if(adminCheck(user, channel)){
                  updatedb(channel, user);
                }
              break;
              case 'mm':
                //if(!(db.settingsprivate[channel.substr(1)].botsettings.mm === false)) return
                if(!(db.settingsprivate[channel.substr(1)].botsettings.mm === false)) {
                  mm(channel, user)
                } else {
                  console.warn('[Block] botsettings.mm: '+settingsprivate[channel.substr(1)].botsettings.mm);
                }
              break;

              case "uptime":
                //if(!(db.settingsprivate[channel.substr(1)].botsettings.uptime === false)) return
                if(!(db.settingsprivate[channel.substr(1)].botsettings.uptime === false)) {
                  uptime(channel, user)
                } else {
                  console.warn('[Block] botsettings.uptime: '+settingsprivate[channel.substr(1)].botsettings.uptime);
                }
              break;

              case "time":
                if(channel == '#gobbtv' || channel == '#spddl_bot'){ // if(channel == '#gobbtv' || channel == '#tabsen_cs' || channel == '#spddl_bot'){
                  var time = momenttz( new Date().toISOString() );
                  if (user.type === 'steam') steam_say(user,'Ger: '+time.tz('Europe/Berlin').format('HH:mm')+' | NA: '+time.tz('America/Los_Angeles').format('h:mma'))
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Ger: '+time.tz('Europe/Berlin').format('HH:mm')+' | NA: '+time.tz('America/Los_Angeles').format('h:mma'))
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Ger: '+time.tz('Europe/Berlin').format('HH:mm')+' | NA: '+time.tz('America/Los_Angeles').format('h:mma')})
                  else bot.say(channel,'Ger: '+time.tz('Europe/Berlin').format('HH:mm')+' | NA: '+time.tz('America/Los_Angeles').format('h:mma'),2)
                  }
              break;

              case "title":
              case "titel":
                //if(!(db.settingsprivate[channel.substr(1)].botsettings.title === false)) return
                //if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                if(!(db.settingsprivate[channel.substr(1)].botsettings.title === false)) {

                  if(adminCheck(user, channel)){
                    if(privatee[channel.substr(1)] && privatee[channel.substr(1)].oauth){
                      if (cmdall.substr(6) !== ''){
                        titelchange(channel, cmdall.substr(6), user);
                      }else{
                        if (user.type === 'steam') steam_say(user,'Und wie lautet der neue Titel? (!titel 24H Stream ᶘ ᵒᴥᵒᶅ)')
                        else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Und wie lautet der neue Titel? (!titel 24H Stream ᶘ ᵒᴥᵒᶅ)')
                        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Und wie lautet der neue Titel? (!titel 24H Stream ᶘ ᵒᴥᵒᶅ)'})
                        else bot.say(channel,'Und wie lautet der neue Titel? (!titel 24H Stream ᶘ ᵒᴥᵒᶅ)',6)
                      }
                    }else{
                      if (user.type === 'steam') steam_say(user,'(keine Rechte) Bitte einmal auf http://bot.spddl.de anmelden')
                      else if (user.type === 'twitchgroup') bot.whisper(user.username, '(keine Rechte) Bitte einmal auf http://bot.spddl.de anmelden')
                      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '(keine Rechte) Bitte einmal auf http://bot.spddl.de anmelden'})
                      else bot.say(channel,'@'+channel.substr(1)+', (keine Rechte) Bitte einmal auf http://bot.spddl.de anmelden',8)
                    }
                  }

                } else {
                  console.warn('[Block] botsettings.title: '+settingsprivate[channel.substr(1)].botsettings.title);
                }

              break;

              case "game":
                //if(!(db.settingsprivate[channel.substr(1)].botsettings.game && true)) return
                //if(!(db.settingsprivate[channel.substr(1)].botsettings.game === false)) return
                //if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                if(!(db.settingsprivate[channel.substr(1)].botsettings.game === false)) {

                  if(adminCheck(user, channel)){
                    if(privatee[channel.substr(1)] && privatee[channel.substr(1)].oauth){
                      gamechange(channel, cmdall.substr(5), user);
                    }else{
                      if (user.type === 'steam') steam_say(user,'(keine Rechte) Bitte einmal auf http://bot.spddl.de anmelden')
                      else if (user.type === 'twitchgroup') bot.whisper(user.username, '(keine Rechte) Bitte einmal auf http://bot.spddl.de anmelden')
                      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '(keine Rechte) Bitte einmal auf http://bot.spddl.de anmelden'})
                      else bot.say(channel,'@'+channel.substr(1)+', (keine Rechte) Bitte einmal auf http://bot.spddl.de anmelden',8)
                    }
                  }

                } else {
                  console.warn('[Block] botsettings.game: '+settingsprivate[channel.substr(1)].botsettings.game);
                }

              break;

              case "giveaway": // [TODO]
                //console.log("case giveaway "+channel+' '+user["user-type"]+' '+user.username)
                if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                    bot.say(channel,'/me GIVEAWAY!! GIVEAWAY!!');
                    //groupirc.say('#jtv','/w '+channel.substr(1)+' Um das giveaway zu verfolgen http://bot.spddl.de/giveaway/'+channel.substr(1))
                    bot.whisper(channel.substr(1), 'Um das Giveaway zu starten http://bot.spddl.de/giveaway')
                    //bot.say(channel,'/me Jeder Sub der etwas im Chat schreibt ist dabei!'); // TODO config aus der JSON laden und die Nachricht anpassen
                    settings[channel.substr(1)].giveaway = true
                }
              break;

          //      case "subcheck":
          //        if(adminCheck(user, channel)){
          //          if(privatee[channel.substr(1)] && privatee[channel.substr(1)].oauth){
          //             //subcheck(channel, cmd[1])
          //             //subcheck('#gobbtv', cmd[1])
          //             subcheck('#gobbtv', cmd[1], function(user, data){
          //               console.log(user+', '+data)
          //             })
          //          }else{
          //            bot.say(channel,'Ohne Rechte keine Kekse');
          //          }
          //        }
          //        break;
              case "lastupdated":
                //if(user["user-type"] === "mod" || user.username === channel.substr(1)){
                if(adminCheck(user, channel)){
                  if (user.type === 'steam') steam_say(user,'Last Updated: '+commands.lastupdated)
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Last Updated: '+commands.lastupdated)
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Last Updated: '+commands.lastupdated})
                  else bot.say(channel,'Last Updated: '+commands.lastupdated)
                  console.info('Last Updated: (commands) '+commands.lastupdated+'  Last Updated: (db.settingsprivate) '+settingsprivate.lastupdated);
                }
              break;

              case "twitch":
          		  twitchstatus(channel, user);
              break;

               case "setfollows":
                if(user == 'spddl'){
                  if(cmd[1] !== undefined){
                    streamdata[channel.substr(1)].offset = cmd[1]
                    channel,streamdata[channel.substr(1)].setfollows = true
                    bot.say("Follows sind nun eingeschaltet | Offset: "+cmd[1])
                  }else{
                    streamdata[channel.substr(1)].setfollows = !streamdata[channel.substr(1)].setfollows
                    bot.say(channel,streamdata[channel.substr(1)].setfollows === true ? "Follows sind nun eingeschaltet" : "Follows sind nun ausgeschaltet");
                  }
                  streamdata.lastupdated = new Date();
                	jf.writeFileSync(streamfile, streamdata)
                }
              break;
           case "facebooknews":
          			if(commands[channel.substr(1)].botsettings.facebookapi){
                  fbtoken(channel);
          			} else {
          				console.log('geht nicht')
          				bot.say(channel,'Die Facebook ID ist in der Datenbank nicht hinterlegt.');
          			}
              break;

              case "steamprofil":
            		if(user["user-type"] === "mod" || user.username === channel.substr(1)){
            			if(db.settingsprivate[channel.substr(1)].botsettings.steamid || ''){
            				steamstatus(channel,user);
            			} else {
            				//bot.say(channel,'Die Steam ID ist nicht in der Datenbank hinterlegt.')
                    if (user.type === 'steam') steam_say(user,'Die Steam ID ist nicht in der Datenbank hinterlegt.')
                    else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Die Steam ID ist nicht in der Datenbank hinterlegt.')
                    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Die Steam ID ist nicht in der Datenbank hinterlegt.'})
                    else bot.say(channel,'Die Steam ID ist nicht in der Datenbank hinterlegt.')
            			}
            		}
              break;

              case "lasttweet":
                if (db.settingsprivate[channel.substr(1)].botsettings.twittername || '') {
                  T.get('statuses/user_timeline', { screen_name: settingsprivate[channel.substr(1)].botsettings.twittername }, function (err, data, response) {
                    if (user.type === 'steam') steam_say(user,'last Tweet: '+data[0].text)
                    else if (user.type === 'twitchgroup') bot.whisper(user.username, 'last Tweet: '+data[0].text)
                    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'last Tweet: '+decodeURI(data[0].text)})
                    else bot.say(channel,'last Tweet: '+data[0].text,3)
                  })
                }
              break;

              case "news":
                if(channel == '#matthias_mase_meyer' || channel == '#spddl_bot'){
                  console.log(loadrss('http://overwatcher.eu/?feed=rss2',function(data){
                    if (user.type === 'steam') steam_say(user,data.title+' '+data.link)
                    else if (user.type === 'twitchgroup') bot.whisper(user.username, data.title+' '+data.link)
                    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: data.title+' '+data.link})
                    else bot.say(channel,data.title+' '+data.link,2)
                  }));
                } else if (channel == '#tahsinofficial' || channel == '#spddl_bot') {+
                  console.log(loadrss('http://fabito.net/gcg/devblog/index.php/feed/',function(data){
                    if (user.type === 'steam') steam_say(user,data.title+' '+data.link)
                    else if (user.type === 'twitchgroup') bot.whisper(user.username, data.title+' '+data.link)
                    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: data.title+' '+data.link})
                    else bot.say(channel,data.title+' '+data.link,2)
                  }));
                }
              break;

              default: // TODO @Name @chat
              //if(cmd[0].length > 1){  bot.say(channel,"I'm sorry, "+user+", but I do not understand the ["+cmd[0]+"] command. Try typing \"!help\" to get the available commands."); }
              cmd[0] = cmd[0].toLowerCase()
              var newcmd = cmdall.substr(++cmd[0].length)

              if(channel.substr(1) !== 'false'){
                if(commands[channel.substr(1)].cmd[cmd]){ // wenn im json gefunden

                  // if (regexname.test(commands[channel.substr(1)].cmd[cmd])) commands[channel.substr(1)].cmd[cmd].replace(/@name/g,user.username)

                  if (user.type === 'steam') steam_say(user, commands[channel.substr(1)].cmd[cmd])
                  else if (user.type === 'twitchgroup') bot.whisper(user.username, commands[channel.substr(1)].cmd[cmd])
                  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: commands[channel.substr(1)].cmd[cmd]})
                  else bot.say(channel, commands[channel.substr(1)].cmd[cmd])
                }else{
                  if((cmd[0].length > 1) && (cmd[1] !== undefined)){ // wenn ein Wert dahinter steht
                    if(adminCheck(user, channel)){
                      if(commands[channel.substr(1)].cmd[cmd] != newcmd){
                        if (!settingsprivate[channel.substr(1)].botsettings.addtoggle) {
                          addcommand(channel, cmdall, user)
                        }
                      }
                      return
                    }else{
                      if(db.settingsprivate[channel.substr(1)].botsettings.wrongcommandmsg && true){  //console.log("I'm sorry, user, but I do not understand the ['+cmd[0]+'] command.");
                        if (user.type === 'steam') steam_say(user,', you do not have permission')
                        else if (user.type === 'twitchgroup') bot.whisper(user.username, 'you do not have permission')
                        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'you do not have permission'})
                        else bot.say(channel,user.username+", you do not have permission")
                      }
                      return
                    }
                  }else{
                    closest(channel,cmd[0],function (c){ // wenn im nicht json gefunden
                    	if(typeof c.cmd == 'undefined'){
                        if(db.settingsprivate[channel.substr(1)].botsettings.wrongcommandmsg && true){  //console.log("I'm sorry, user, but I do not understand the ['+cmd[0]+'] command.");
                          if (user.type === 'steam') steam_say(user,"I'm sorry, "+user.username+", but I do not understand the ["+cmd[0]+"] command.")
                          else if (user.type === 'twitchgroup') bot.whisper(user.username, " I'm sorry, "+user.username+", but I do not understand the ["+cmd[0]+"] command.")
                          else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: " I'm sorry, "+user.username+", but I do not understand the ["+cmd[0]+"] command."})
                          else bot.say(channel,"I'm sorry, "+user.username+", but I do not understand the ["+cmd[0]+"] command.")
                        }
                    	}else{
                    		//console.log('you mean that? (!'+c.cmd+') - '+c.text);
                    		if (user.type === 'steam') steam_say(user,'Did you mean: ( !'+c.cmd+' )? - '+c.text)
                    		else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Did you mean: ( !'+c.cmd+' )? - '+c.text)
                        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Did you mean: ( !'+c.cmd+' )? - '+c.text})
                    		else bot.say(channel,'Did you mean: ( !'+c.cmd+' )? - '+c.text)
                    	}
                    })
                  }
                }

              }else{ // Steam Fehlermeldung
                steam_say(user.username.substr(15),'Du bist nicht als Caster in der Datenbank eingetragen')
              }
            }
          }

          getCloset = require('get-closest'),
          function closest(chan,cmd,callback){
            //console.log('closest: '+chan+', '+cmd+', '+settingsprivate[chan.substr(1)].botsettings.wrongcommandlevenshtein);
            "use strict"; // see strict mode
          	let arr = _.keys(commands[chan.substr(1)].cmd)//;arr.shift()
            let closest = getCloset.custom(cmd, arr, function(a, b){
          		let lshtein = new Levenshtein(a, b).distance;
          		if(lshtein < (db.settingsprivate[chan.substr(1)].botsettings.wrongcommandlevenshtein || 3)) return lshtein
          		else return
            });
          	callback({'cmd': arr[closest], 'text':commands[chan.substr(1)].cmd[arr[closest]]}) //return arr[closest];
          }
*/
