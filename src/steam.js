/* eslint no-undef: 0 */
// https://steamladder.com/ladder/playtime/730/

// if we've saved a server list, use it
/* if(fs.existsSync('servers')){ // DEPRECATED
  Steam.servers = JSON.parse(fs.readFileSync('servers'));
} */
const steamadmins = ['76561198027155016'] // http://steamcommunity.com/id/spddl
// var steamadmins = []

function SteamCheck (search, cb) {
  // search = search.toString()
  console.log('SteamCheck:', search, Number(search), (typeof search))
  try {
    const streamer = Object.keys(db.settingsprivate)
    // 103582791435239386 // Kirby
    for (let i = 0; i < streamer.length; i++) {
      // console.log(streamer[i])
      if (db.settingsprivate[streamer[i]].botsettings && db.settingsprivate[streamer[i]].botsettings.steam) {
        // if (search.substr(0,1) < 5) { // Group // TODO Perf
        if (db.settingsprivate[streamer[i]].botsettings.steam.steamgroup) {
          const steamgroup = db.settingsprivate[streamer[i]].botsettings.steam.steamgroup
          for (let ii = 0; ii < steamgroup.length; ii++) {
            // console.log('Number(steamgroup[ii])', Number(steamgroup[ii]), steamgroup[ii].toString(), steamgroup[ii], typeof steamgroup[ii])
            // if (Number(steamgroup[ii]) === search) {
            if (Number(steamgroup[ii]) === search) {
              cb({ result: streamer[i], type: 'steamgroup,number' }) // eslint-disable-line standard/no-callback-literal
              return true
            }
            if (steamgroup[ii].toString() === search) {
              cb({ result: streamer[i], type: 'steamgroup.toString()' }) // eslint-disable-line standard/no-callback-literal
              return true
            }
            if (steamgroup[ii] === search) {
              cb({ result: streamer[i], type: 'steamgroup' }) // eslint-disable-line standard/no-callback-literal
              return true
            }
            if (steamgroup[ii] === search) {
              cb({ result: streamer[i], type: 'steamgroup ==' }) // eslint-disable-line standard/no-callback-literal
              return true
            }
          }
        } else if (db.settingsprivate[streamer[i]].botsettings.steam.account) {
          const account = db.settingsprivate[streamer[i]].botsettings.steam.account
          for (let ii = 0; ii < account.length; ii++) {
            // console.log('Number(steamgroup[ii])', Number(steamgroup[ii]), steamgroup[ii].toString(), steamgroup[ii], typeof steamgroup[ii])
            // if (Number(account[ii]) === search) {
            if (Number(account[ii]) === search) {
              cb({ result: streamer[i], type: 'account,number' }) // eslint-disable-line standard/no-callback-literal
              return true
            }
            if (account[ii].toString() === search) {
              cb({ result: streamer[i], type: 'account.toString()' }) // eslint-disable-line standard/no-callback-literal
              return true
            }
            if (account[ii] === search) {
              cb({ result: streamer[i], type: 'account' }) // eslint-disable-line standard/no-callback-literal
              return true
            }
            if (account[ii] === search) {
              cb({ result: streamer[i], type: 'account ==' }) // eslint-disable-line standard/no-callback-literal
              return true
            }
          }
        }
      }
    }
    console.log('cb()')
  } catch (error) {
    console.log('err SteamCheck')
    console.log(error)
    cb()
  }
}

function SteamChatterroomfn () {
  SteamChatterroom = {}
  _.each(db.settingsprivate, function (db, name) {
    if (typeof db === 'string') { return } // lastupdated work-a-round
    if (Array.isArray(db)) { return } // blocked work-a-round

    try {
      _.each(db.botsettings.steam.steamgroup, function (steamgruppenid) { // falls jmd 2 steamgruppen hat
        SteamChatterroom[steamgruppenid] = name
        if (config.localhost()) { steamlog.info('SteamChatterroomfn() ' + steamgruppenid + ' ' + name) }
      })
    } catch (e) {
      if (config.localhost()) { console.log(db) }
      // if (config.localhost()) { console.log(db.botsettings); }
      console.log('SteamChatterroomfn')
      console.warn(e)
      console.warn(db + ', ' + name)
    }
  })
}
try {
  SteamChatterroomfn()
} catch (e) {
  steamlog.error('SteamChatterroomfn ' + e)
}

function SteamUsernamefn () {
  SteamUsername = {}
  _.each(db.settingsprivate, function (db, name) {
    if (typeof db === 'string') { return } // lastupdated work-a-round (don't work)
    if (name === 'lastupdated') { return } // lastupdated work-a-round
    if (Array.isArray(db)) { return } // blocked work-a-round

    try {
      // if (config.localhost()) { console.log(db.botsettings); }
      _.each(db.botsettings.steam.account, function (steamid) {
        SteamUsername[steamid] = name
        if (config.localhost()) { steamlog.info('SteamUsernamefn() ' + steamid + ' ' + name) }
      })
    } catch (e) {
      console.log('SteamUsernamefn')
      console.warn(e)
      console.warn(db + ', ' + name + ', ' + typeof db)
    }
  })
}
SteamUsernamefn()

// const SteamTotp = require('steam-totp')
// const SteamTotpcode = 'xM/YGplrnwE7AanBvp6hih5VDtU='

const steamuserinfo = require('steam-userinfo')
steamuserinfo.setup(config.steamapikey)
const SteamUser = require('steam-user')
const steamclient = new SteamUser({ enablePicsCache: true })

steamclient.on('loggedOn', function (details) {
  steamlog.notice('Logged into Steam as ' + steamclient.steamID.getSteam3RenderedID())
  steamclient.setPersona(1) // "0": "Offline", "1": "Online", "2": "Busy", "3": "Away", "4": "Snooze", "5": "LookingToTrade", "6": "LookingToPlay", "7": "Max",
  steamclient.gamesPlayed(730) // 440 TF2, 730 CSGO
  setTimeout(function () {
    _.each(steamclient.myGroups, function (relationship, name) {
      if (relationship === 3) { // nur Gruppen in den man auch gejoint ist
        steamclient.joinChat(name, function (result) {
          if (result !== 1) { // wenn Callback nicht OK ist
            try {
              steamlog.info('4233 steamlog.info?: ' + SteamUser.EResult[result]) // steamclient.EResult[result] error!
            } catch (e) {
              console.log('4236 steam error?: ' + e)
            }
          }
        })
      }
    })
  }, 4000)
})

steamclient.on('accountLimitations', function (limited, communityBanned, locked, canInviteFriends) {
  var limitations = []
  if (limited) { limitations.push('LIMITED') }
  if (communityBanned) { limitations.push('COMMUNITY BANNED') }
  if (locked) { limitations.push('LOCKED') }

  if (limitations.length === 0) {
    if (!start) {
      steamlog.info('Our account has no limitations.')
    }
  } else {
    steamlog.info('Our account is ' + limitations.join(', ') + '.')
  }

  if (canInviteFriends) {
    if (!start) {
      steamlog.info('Our account can invite friends.')
    }
  }
})

const SteamUserdb = {}
steamclient.on('licenses', function (licenses) {
  if (!start) { steamlog.info('Our account owns ' + licenses.length + ' license' + (licenses.length === 1 ? '' : 's') + '.') }
}).on('wallet', function (hasWallet, currency, balance) {
  if (!start) { steamlog.info('Our wallet balance is ' + SteamUser.formatCurrency(balance, currency)) }
}).on('newItems', function (count) {
  if (!start) { steamlog.info(count + ' new items in our inventory') }
  // }).on('emailInfo', function(address, validated) {         if (!start) { steamlog.info('Our email address is ' + address + ' and it\'s ' + (validated ? 'validated' : 'not validated')) }
}).on('emailInfo', function (address, validated) {
  if (!start) { steamlog.info('Our email address is ' + (validated ? 'validated' : 'not validated')) }
}).on('vacBans', function (numBans, appids) {
  if (!start) { steamlog.info('We have ' + numBans + ' VAC ban' + (numBans === 1 ? '' : 's') + '.') }
  if (appids.length > 0) { if (!start) { steamlog.info('We are VAC banned from apps: ' + appids.join(', ')) } }
}).on('changelist', function (changenumber, apps, packages) {
  if (apps === 730) { steamlog.info('UPDATE changenumber: ' + changenumber + ', apps: ' + apps + ', packages: ' + packages) }
}).on('error', function (e) {
  steamlog.error((SteamUser.EResult[e.eresult] ? SteamUser.EResult[e.eresult] : e)) // Some error occurred during logon
}).on('webSession', function (sessionID, cookies) {
  if (!start) { steamlog.info('Got web session') } // Do something with these cookies if you wish
}).on('groupEvent', function (sid, headline, date, gid, gameID) {
  console.log('groupEvent ', sid)
  SteamCheck(sid, function (data) { // sid, ist die SteamGroup
    if (data.result) {
      steamlog.info('groupEvent' + headline + ', ' + data.result + ', gid: ' + gid + ', gameID: ' + gameID)
    } else {
      steamlog.info('groupEvent' + headline + ', ' + sid + ', gid: ' + gid + ', gameID: ' + gameID)
      // console.log(data)
    }
  })
}).on('groupAnnouncement', function (sid, headline, gid) {
  // steamID = steamID.getSteamID64()
  // try {
  //   console.log('steamclient groupAnnouncement %j, '+sid.getSteamID64() + ', ' + sid.getSteam3RenderedID(), sid)
  // } catch (error) {
  //   console.log(error)
  // }
  sid = sid.getSteamID64()
  console.log('steamclient groupAnnouncement', sid) // 103582791435239386
  SteamCheck(sid, function (data) { // sid ist die SteamGroup
    console.log(data)
    if (data.result) {
      steamlog.info(headline + ', ' + data.result + ', gid: ' + gid)
    } else {
      steamlog.info(headline + ', ' + sid + ', gid: ' + gid)
      // console.log(data)
    }
  })
}).on('friendRelationship', function (sid, relationship) {
  try {
    steamlog.notice('Friend Relationship from http://steamcommunity.com/profiles/' + sid + ' - ' + SteamUser.EFriendRelationship[relationship])
    steamSay({ source: config.steam_spddl }, 'BOT: Friend Relationship from http://steamcommunity.com/profiles/' + sid + ' - ' + SteamUser.EFriendRelationship[relationship])
  } catch (err) {
    console.warn('friendRelationship: ' + err)
  }
}).on('chatMessage', function (room, chatter, message) { // https://github.com/DoctorMcKay/node-steam-user/blob/8d926b6528361e1735dc7d7aecfd2bb8442bb0a7/README.md#chatmessage
  steamlog.info('Chat: ', room, chatter, message)
  try { // https://github.com/DoctorMcKay/node-steam-user/blob/8d926b6528361e1735dc7d7aecfd2bb8442bb0a7/README.md#id-events
    steamlog.info(chatter.getSteamID64())
    steamlog.info(chatter.getSteam3RenderedID())
  } catch (error) {
    console.log(error)
  }
  // }).on('friendOrChatMessage', function(senderID, message, room) {
  // steamlog.info('friendOrChatMessage '+senderID,message,room);
  // steamuser(senderID, message, room)
}).on('friendTyping', function (senderID) {
  steamlog.info('friendTyping ' + senderID)
  try { // https://github.com/DoctorMcKay/node-steam-user/blob/8d926b6528361e1735dc7d7aecfd2bb8442bb0a7/README.md#id-events
    steamlog.info(senderID.getSteamID64())
  } catch (error) {
    console.log(error)
  }
}).on('friendLeftConversation', function (senderID) {
  steamlog.info('friendLeftConversation ' + senderID)
}).on('friendMessage', function (steamID, message) { // }).on('friendMessage', function(steamID, message) {         steamlog.info("Friend message from " + steamID +" " + steamID.getSteam3RenderedID() + ": " + message);
  steamlog.info('friendMessage ' + steamID + ': ' + message)
  steamSay({ source: config.steam_spddl }, 'BOT: ' + steamID + ', ' + message)
  steamuser(steamID, message)
})

/***************************************
  Eigene Steam Funktionen
***************************************/

function steamuser (steamID, message, room) {
  // console.log(steamID);
  // console.log(SteamUsername);

  if (SteamUsername[steamID]) { // Wenns ein Streamer ist
    steamlog.info('Friend message from ' + SteamUsername[steamID] + ' (' + steamID + '): ' + message)
  } else if (SteamUserdb[steamID]) { // Wenn er schon mal geschrieben hat
    steamlog.info('Friend message from ' + SteamUserdb[steamID] + ' (' + steamID + '): ' + message)
  } else {
    steamlog.info('Friend message from http://steamcommunity.com/profiles/' + steamID + ': ' + message)
    steamuserinfo.getUserInfo(steamID, function (error, data) {
      if (error) steamlog.error(error)
      SteamUserdb[steamID] = data.response.players[0].personaname
    })
  }

  var user = { // TODO: Steam Goupen joinen und IDs erkennen
    username: SteamUsername[steamID],
    source: steamID.toString(),
    msg: message,
    type: 'steam',
    // debugtype: type,
    // chatter: chatter,
    chatterroom: room // SteamChatterroom[steamID]
  }

  if (config.localhost()) steamlog.info('message, %j', user)

  if (user.msg === 'cookie') {
    steamSay(user, 'Great! You jump off bridges when bots tell you to as well?')
    return
  }
  if ((user.msg.toLowerCase().indexOf('bot') !== -1) && user.source === '76561198027155016') {
    steamSay(user, 'Hey spddl! ༼ つ ◕_◕ ༽つ') // (✌ﾟ∀ﾟ)☞
    return
  }
  if (user.msg === 'ping') {
    if (steamAdminCheck(user)) {
      steamSay(user, 'pong')
    }
  }

  /* if(user.message.substr(0,4) == "!ads"){ // TODO
      if(user["user-type"] === "mod" || user.username === channel.substr(1)){
        console.info('ADMIN!  #'+host+', '+message+', '+source+', '+Steam)
        advertising('#'+host, message, Steam);
        return;
      }
      return;
  } */

  // if(user.msg.substr(0,1) === '!'){

  //   //steam_parseCmd(message.substr(1), source);
  //   if(config.localhost()) steamlog.info('steam_parseCmd(msg: '+message.substr(1)+', user: %j )', user)
  //   var msg = user.msg.substr(1).split(' ');
  //   switch(msg[0].toLowerCase() ){
  //     case 'viewer':
  //       steamViewer(user)
  //       return;
  //     break;

  //     case 'follower':
  //     case 'lastfollower':
  //       steamLastFollower(user, msg[1])
  //       return;
  //     break;

  //     default:
  //       if(steamAdminCheck(user)){
  //         steam_AdminCmd(user)
  //       }else{
  //         parseCmd(user.msg.substr(1),'#'+user.username, user); //function parseCmd(cmd,channel,user)
  //       }
  //   }
  //   return;
  // }

  chathandle('#' + user.username, user, user.msg, false)
}

function steamSay (user, msg) {
  // console.info('STEAM steamSay fn %j',user)
  try {
    // steamFriends.sendMessage(user.source || user.chatter, msg); TODO: wenn jmd aus einer Gruppe schreibt sollte auch dort geantwortet werden
    // steamclient.chatMessage(user.source, msg)
    steamclient.chatMessage(user.chatterroom || user.source, msg)
    if (user.source !== config.steam_spddl) {
      steamlog.info(user.chatterroom || user.source + ': %j', msg)
    }
  // steamlog.info(user.username+': %j',msg)
  } catch (e) {
    steamlog.error('steamSay fn: ' + e)
  }
}

// function sendInv (url, user, cb) {
//   console.log('sendInv: ' + url)
//   // http://steamcommunity.com/profiles/76561198027155016
//   // http://steamcommunity.com/id/spddl/
//   url = url.trim()

//   // if (url.indexOf('http://steamcommunity.com/id/') !== -1) {
//   //   url = url.replace('http://steamcommunity.com/id/','')
//   // }
//   // if (url.indexOf('http://steamcommunity.com/profiles/') !== -1) {
//   //   url = url.replace('http://steamcommunity.com/profiles/','')
//   // }

//   if (url.indexOf('profiles/') !== -1) {
//     url = url.slice(url.indexOf('profiles/') + 9)
//   }
//   if (url.indexOf('id/') !== -1) {
//     url = url.slice(url.indexOf('id/') + 3)
//   }

//   url = url.replace(/\//g, '')

//   console.log('url: ' + url)
//   if (!isNaN(url)) { url = new SteamID(url) }
//   steamCommunity.getSteamUser(url, function (err, data) {
//     if (err) { console.log(err) }
//     try {
//       console.log('data.name: ' + data.name)
//       cb(data.name)
//     } catch (e) {
//       console.warn(e)
//     }
//     try {
//       console.log('data.steamID: ' + data.steamID)
//     } catch (e) {
//       console.warn(e)
//     }

//     try {
//       steamclient.inviteToGroup(data.steamID, '103582791436262781') // Kirby
//     } catch (e) {
//       console.warn(e)
//     }
//   })
// }

// function steam_AdminCmd (user) {
//   if (config.localhost()) { steamlog.info('steam_AdminCmd %j', user) }

//   var msgall = user.msg
//   var msg = user.msg.split(' ')

//   console.log('switch: ' + msg[0].toLowerCase().substr(1))

//   switch (msg[0].toLowerCase().substr(1)) {
//     case 'name': // TODO: testen
//       steamFriends.setPersonaName(msgall.substr(5))
//       steamSay(user, 'Name geändert zu:' + msgall.substr(5))
//       break

//     case 'stat':
//     case 'stats':
//       var uptime = new Date(new Date().getTime() - process.uptime() * 1000)
//       steamSay(user, 'process.uptime(): ' + uptime.toLocaleString())
//       steamSay(user, 'process.memoryUsage(): ' + util.inspect(process.memoryUsage()))
//       break

//     case 'ip':
//       steamSay(user, ip + ':' + port)
//       break

//       /* case 'addFriend':
//       steam_addFriend(user, steamID)
//       return true;
//     break;

//     case 'removeFriend':
//       steam_removeFriend(user, steamID)
//       return true;
//     break; */

//       /* case 'start': // Eigentlich unnötig :/
//       steamStart(user, msgall.substr(6))
//     break; */

//     case 'SteamUsername':
//       steamSay(user, 'SteamUsername: \n' + util.inspect(SteamUsername))
//       break

//     case 'SteamChatterroom':
//       steamSay(user, 'SteamChatterroom: \n' + util.inspect(SteamChatterroom))
//       break

//       /*
//     case 'getSessionID':
//       console.log('getSessionID '+community.getSessionID());
//       steamSay(user, community.getSessionID())
//     break;

//     case 'getNotifications':
//       console.log('getNotifications');
//       community.getNotifications(function(cb){
//         console.log(cb);
//         steamSay(user,'%j',cb)
//       })
//     break;

//     case 'loggedIn':
//       console.log('loggedIn');
//       steamSay(user, community.loggedIn(function(cb){
//         console.log(cb);
//         steamSay(user,'%j',cb)
//       }))
//     break;

//     case 'matchmakingstatsrequest':
//       matchmakingStatsRequest(user)
//     break;

//     case 'playerprofilerequest':
//       playerProfileRequest(user)
//     break;

//     case 'requestlivegameforuser':
//       //requestLiveGameForUser(user)
//       if(msg[1] !== undefined){
//         requestLiveGameForUser(user) // für den User selbst
//       }else{
//         requestLiveGameForUser(user, msgall.substr(23)) // für einen anderen Account
//       }
//     break;

//     case 'requestwatchinfofriends':
//       requestWatchInfoFriends(user)
//     break; */

//       //    case 'requestrecentgames': // allg. games
//       //      requestRecentGames(user)
//       //      return true;
//       //    break;

//     default:
//       parseCmd(user.msg.substr(1), '#' + user.username, user)
//   }
// }

function steamAdminCheck (user) {
  if (config.localhost()) { steamlog.info('steamAdminCheck %j', user) }
  for (var i = 0; i < steamadmins.length; i++) {
    if ((steamadmins[i]) === user.source) { return true }
  }
  return false
}

// function steamViewer (user) { // TODO: gibs diese Funktion nicht auch für den normalen TwitchStream? migrieren
//   if (config.localhost()) { steamlog.info('steamViewer %j', user) }
//   // curl -H 'Client-ID: ' -X GET 'https://api.twitch.tv/helix/streams?user_login=kirby'
//   // request({ url: 'https://api.twitch.tv/kraken/streams/' + (user.username || user.chatterroom), json: true, headers: { 'Client-ID': ClientID } }, function (err, res, body) { // hole mir die Aktuellen Daten aus der Steam API
//   request({ url: 'https://api.twitch.tv/helix/streams?user_login=' + (user.username || user.chatterroom), json: true, headers: { 'Client-ID': ClientID } }, function (err, res, body) { // hole mir die Aktuellen Daten aus der Steam API
//     if (err !== null) { console.emergency('fn steamViewer err: ' + err) }
//     if (body !== undefined) { // twitch API Down?
//       if (body.stream !== null) {
//         steamSay(user, 'Viewers ' + body.stream.viewers + ', Followers ' + body.stream.channel.followers + ', Views ' + body.stream.channel.views)
//       } else {
//         steamSay(user, 'Stream offline')
//       }
//     } else {
//       steamlog.critical('twitch WebAPI is down.')
//       steamSay(user, 'twitch WebAPI is down.')
//     }
//   })
// }

// function steamLastFollower (user, num) {
//   if (config.localhost()) { steamlog.info('steamLastFollower %j', user) }
//   if (num === undefined) num = 3
//   request({ url: 'https://api.twitch.tv/kraken/channels/' + (user.username || user.chatterroom) + '/follows?limit=' + num, json: true, headers: { 'Client-ID': ClientID } }, function (err, res, body) {
//     if (err !== null) { steamlog.emergency('fn steamLastFollower err: ' + err) }
//     if (body !== undefined) { // twitch API Down?
//       var adm = '[' + body._total + '] '
//       for (var j = 0; j < body.follows.length; j++) {
//         adm += (j === 0) ? body.follows[j].user.display_name : ', ' + body.follows[j].user.display_name
//       }
//       steamSay(user, adm)
//     } else {
//       steamlog.critical('twitch WebAPI is down.')
//       steamSay(user, 'twitch WebAPI is down.')
//     }
//   })
// }

/***************************************************
      SteamCommunity
***************************************************/

const SteamCommunityobj = require('steamcommunity')
// const SteamID = SteamCommunityobj.SteamID
const steamCommunity = new SteamCommunityobj()

function generateLogon () {
  return {
    accountName: config.steam_name,
    password: config.steam_password
  }
}

function logOnSteam () {
  steamcomlog.info('Logging in to Steam...')
  steamCommunity.login(generateLogon(), function (e, sessionID, cookies, steamguard) {
    if (e) {
      steamcomlog.warn('There was an error logging in ! Error details : ' + e.message)
      setTimeout(logOnSteam, 1000 * 60 * 4) // try to reconnect in 4 minutes
      // setTimeout(logOnSteam, 1000 * 30) // try to reconnect in 30 seconds
    } else {
      steamcomlog.info('Successfully logged in !', steamCommunity.getSessionID())
      steamCommunity.chatLogon() // to appear online
    }
  })
}

function checkSteamLogged () {
  steamCommunity.loggedIn(function (err, loggedIn, familyView) {
    // wenn das nicht klappt console.log(steamCommunity.getSessionID())
    if (err) {
      steamcomlog.info('socket hang up? checkSteamLogged')
      console.log('%j', err)
      logOnSteam()
      setTimeout(checkSteamLogged, 1000 * 60 * 4) // check again in 4 min
    } else if (!loggedIn) {
      // steamcomlog.info("Steam login check : NOT LOGGED IN !")
      steamcomlog.warn('Steam login check : NOT LOGGED IN !')
      logOnSteam()
    } else {
      // steamcomlog.info("Steam login check : already logged in !")
    }
  })
}

steamCommunity.on('sessionExpired', function (err) {
  if (err) { steamcomlog.info(err) }
  logOnSteam()
})

if (!config.localhost() || localhostobj.steam) {
  // setTimeout(checkSteamLogged, 1000*45)
  setInterval(checkSteamLogged, 1000 * 60 * 30) // 30min
}

/*
steamCommunity.postGroupAnnouncement(id,msg,'Enjoy my stream http://www.twitch.tv/'+(user.channel || user.username), function(err){
  if(err) console.error(err)
  else console.info('postGroupAnnouncement on success - Headline: '+msg)
}) */

function twitchtitel (channel, callback) { // twitchtitel lesen
  var url = 'https://api.twitch.tv/kraken/channels/' + channel.substr(1)
  request({
    url: url,
    json: true,
    headers: { 'Client-ID': ClientID }
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('twitchtitel (Status): ' + body.status)
      callback(body.status)
    }
  })
}

_.filtersteam = function (obj, predicate, context) {
  var results = []
  _.each(obj, function (value, index, list) {
    if (predicate(value, index, list)) results.push(index)
  })
  return results
}

function steamStart (user, msg) {
  steamcomlog.info('steamStart %j ' + msg, user)
  let id
  if (user.channel) id = _.filtersteam(SteamChatterroom, (val) => val === user.channel)
  else id = _.filtersteam(SteamChatterroom, (val) => val === user.username)
  if (msg.length !== 0) {
    try {
      _.each(id, function (value) {
        steamcomlog.info('postGroupAnnouncement, id: ' + value + ', msg: ' + msg + ', Enjoy my stream http://www.twitch.tv/' + (user.channel || user.username))
        steamCommunity.postGroupAnnouncement(value, msg, 'Enjoy my stream http://www.twitch.tv/' + (user.channel || user.username), function (err) {
          if (err) steamcomlog.error(err)
          else steamcomlog.info('postGroupAnnouncement on success - Headline: ' + msg)
        })
      })
    } catch (e) {
      steamcomlog.error(e)
    }
  } else {
    if (user.username === undefined) { return }
    twitchtitel('#' + user.channel, function (titel) {
      if (titel.length === 0) titel = user.channel + ' is LIVE' // wenn kein Twitch Titel gesetzt ist

      _.each(id, function (value) {
        // steamcomlog.info('postGroupAnnouncement, id: '+id+', Titel: '+titel+', Enjoy my stream http://www.twitch.tv/'+(user.channel || user.username))
        steamCommunity.postGroupAnnouncement(value, titel, 'Enjoy my stream http://www.twitch.tv/' + (user.channel || user.username), function (err) {
          if (err) steamcomlog.error(err)
          else steamcomlog.info('postGroupAnnouncement on success - Headline: ' + titel)
        })
      })
    })
  }
}

if (!config.localhost() || localhostobj.steam) {
  steamclient.logOn({
    accountName: config.steam_name,
    password: config.steam_password
  })
  logOnSteam()
}
