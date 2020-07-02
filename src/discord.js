/* eslint no-undef: 0 */

const discordUsername = { // ServerID unter Server Settings > Widget
  '138313705816457218': 'spddl',
  '172535189598240768': 'fr3ddytv',
  '124300975065399296': 'navidkapio',
  '483216138348658698': 'rahyy',
  '315950427567030282': 'kirby'
}
/* var discord_admin = {
  '138293749468889088': 'spddl',
  '169045298490900480': 'fr3ddytv',
  '2': 'navidkapio'
}; */

const discordRights = { // Die Rollen stehen nicht im "User" console.log(dc.servers[key].members[userID].roles);
  fr3ddytv: {
    discord: { // MOD             // ADMIN
      right: ['172720052812906496', '173856250612809728']
    }
  },
  spddl: {
    discord: { // idk                  spddl
      right: ['173324873899311104', '161430810157645824']

    }
  },
  navidkapio: {
    discord: {
      right: []
    }
  },
  /* "rahyy": { // MOD's - Trio <3
    "discord": { //Baum               Stamm                Blatt                Borke
      "right": ['186950682358710274','186952155704328192','186952714456924160','186952346448822272']
    }
  }, */
  rahyy: { // MOD's - Trio <3
    discord: { // Baum               Stamm                Wurtzeln             Borke
      right: ['193366585266798592', '193367002444726274', '193298891456643072', '193366782499618816']
    }
  },
  kirby: {
    discord: { // Admin
      right: ['316270560596328458']
    }
  }
}

const discord = {}
const discordChannel = {}
// var discord_role = {}

// 138293749468889088, 316283561730637829, nicht beachten pls
// [INFO] 17:08:40 Discord [#undefined] <spddl>: nicht beachten pls - {"username":"spddl","userID":"138293749468889088","channel":"#undefined","channelID":"316283561730637829","role":[],"user-type":"discord","type":"discord"}
// [WRNG] 17:08:40 #undefined ??

/*
function FindRoleID(servid, rolename, cb){
  //console.log('FindRoleID fn: '+servid+' '+typeof rolename)

   for (var key in dc.servers) {
      if (dc.servers.hasOwnProperty(key)) {

        if(key === servid){ // wenn die ServerID stimmt
          for (var name in dc.servers[key].roles) {
            if (dc.servers[key].roles.hasOwnProperty(name)) {

              //console.log('name: '+name+', '+dc.servers[key].roles[name].name+' === '+rolename)

              //if(typeof rolename === 'boolean'){

//                if (discordRights[dc.servers[key].name.toLowerCase()].discord.right.indexOf(name) == -1) {
                  // return true
//                  cb(true);return;
//                }

              //}else{
                if (dc.servers[key].roles[name].name == rolename) {
                  cb(name)
                }
              //}
            }
          }
          console.log('x')
          cb(false)
        }
      }
   }
} */

// function FindRoleID (servid, rolename) {
//   // console.log('FindRoleID fn: '+servid+' '+typeof rolename)
//   for (var key in dc.servers) {
//     if (dc.servers.hasOwnProperty(key)) {
//       if (key === servid) { // wenn die ServerID stimmt
//         for (var name in dc.servers[key].roles) {
//           if (dc.servers[key].roles.hasOwnProperty(name)) {
//             // return null
//             dclog.log('name: ' + name + ', ' + dc.servers[key].roles[name].name + ' === ' + rolename)

//             // if(typeof rolename === 'boolean'){

//             //                if (discordRights[dc.servers[key].name.toLowerCase()].discord.right.indexOf(name) == -1) {
//             // return true
//             //                  cb(true);return;
//             //                }

//             // }else{
//             if (dc.servers[key].roles[name].name === rolename) {
//               return name
//               // cb(name)
//             }
//             // }
//             /*
//                 138313705816457218
//                   name: 138313705816457218 @everyone
//                   name: 161430810157645824 Host
//                   name: 173324873899311104 Bot
//                 172535189598240768
//                   name: 172535189598240768 @everyone
//                   name: 172720052812906496 Moderatoren
//                   name: 172720257666908160 VIP
//                   name: 172720744428601344 Follower
//                   name: 172855432140816384 Botende Bots
//               */
//           }
//         }
//         return false
//       }
//     }
//   }
// }

function DiscordCheck (userID, channelID) {
  // console.log('DiscordCheck fn: '+userID+' '+channelID) // Mod

  for (const key in dc.servers) {
    // if (dc.servers.hasOwnProperty(key)) {
    if (Object.prototype.hasOwnProperty.call(dc.servers, key)) {
      // console.log(key);

      if (key === _.findKey(discordUsername, (val) => val === discordChannel[channelID])) {
        // console.log('DiscordCheck fn: 1');

        // console.log(typeof dc.servers[key].members[userID].roles);
        // console.log(JSON.stringify(dc.servers[key].members[userID].roles));
        // console.error('dc.servers[key].members[userID].roles '+dc.servers[key].members[userID].roles)
        // console.error('discordRights[discordChannel[channelID]].discord.right '+discordRights[discordChannel[channelID]].discord.right)
        // console.log('indexOf '+JSON.stringify(dc.servers[key].members[userID].roles).toString().indexOf(  discordRights[discordChannel[channelID]].discord.right  ));
        if (dc.servers[key].members[userID]) {
          try {
            for (var i = 0, len = dc.servers[key].members[userID].roles.length; i < len; i++) {
              // console.log('discordRights[discordChannel[channelID]].discord.right '+discordRights[discordChannel[channelID]].discord.right);
              // console.log('dc.servers[key].members[userID].roles[i] '+ dc.servers[key].members[userID].roles[i] +', '+dc.servers[key].members[userID].roles.length);
              if (_.indexOf(discordRights[discordChannel[channelID]].discord.right, dc.servers[key].members[userID].roles[i]) !== -1) {
                // console.log('true [MOD]');
                return true
              }
            }
          } catch (e) {
            console.warn(e) // TODO: TypeError: Cannot read property 'roles' of undefined
          }
        }
      }
    }
  }
  return false
}

function discordReload () {
  // console.log('discordReload')
  _.each(dc.servers, function (a, servid, c) {
    discord[discordUsername[servid]] = []
    _.each(a.channels, function (chan) {
      discord[discordUsername[servid]].push(chan.id)
      discordChannel[chan.id] = discordUsername[servid]
    })
  })
  // console.log(discordChannel)
}

// function twitterlookup (screenname, cb) {
//   T.get('users/lookup', { screen_name: screenname }, function (err, data, response) {
//     if (!err && response.statusCode === 200) { cb(data[0].id) } else { cb(err) }
//   })
// }

// function listenTweet (user, screenname, chanid) {
//   console.log('user: ' + user + ', screenname: ' + screenname + ', chanid: ' + chanid) // + ' '+typeof settings[user].twitterid)
//   // if (typeof global.screenname === "object") { global.screenname.removeAllListeners('message') }
//   if (!settings[user]) {
//     settings[user] = {}
//   }
//   if (settings[user].twitterid || false) {
//     if (!global.twitter) { global.twitter = {} }
//     // global.twitter[screenname] = T.stream('statuses/filter', { follow: [settings[user].twitterid] })
//     global.twitter[screenname] = T.stream('statuses/filter', { follow: settings[user].twitterid })
//     global.twitter[screenname].on('error', (err) => { console.log('Twit error!', err) })
//     global.twitter[screenname].on('message', function (msg) {
//       // twitterlog.log(screenname+' == '+msg.user.screen_name+' > '+msg.text);
//       if ((screenname).toLowerCase() === (msg.user.screen_name).toLowerCase()) {
//         // twitterlog.notice(screenname+' == '+msg.user.screen_name+' > '+msg.text);
//         console.log(screenname)
//         dc.sendMessage({ to: chanid, message: screenname + ': ' + msg.text })
//       } else {
//         // twitterlog.info(screenname+' != '+msg.user.screen_name+' > '+msg.text);
//         console.log(screenname)
//         // if (config.localhost()) console.log('wird nicht gepostet '+typeof (screenname).toLowerCase()+', '+typeof (msg.user.screen_name).toLowerCase());
//       }
//     }) // .setMaxListeners(1);
//   } else {
//     // twitterlookup(db.settingsprivate[user].botsettings.twittername,function(erg){ //console.log('twitterlookup '+erg+' chanObj '+chanObj);
//     twitterlookup(screenname, function (erg) {
//       twitterlog.notice('twitterlookup: ' + erg + ', ' + screenname)

//       settings[user].twitterid = erg

//       // if (config.localhost()) console.log('erg: '+erg+', '+screenname);

//       if (!global.twitter) { global.twitter = {} }

//       // global.twitter[screenname] = T.stream('statuses/filter', { follow: [erg] })
//       global.twitter[screenname] = T.stream('statuses/filter', { follow: erg })
//       global.twitter[screenname].on('error', (err) => { console.log('Twit error!', err) })
//       global.twitter[screenname].on('message', function (msg) {
//         try {
//           if (config.localhost()) twitterlog.log(screenname + ' === ' + msg.user.screen_name + ' > ' + msg.text)
//           // twitterlog.log(screenname+' === '+msg.user.screen_name+' > '+msg.text)
//           if ((screenname).toLowerCase() === (msg.user.screen_name).toLowerCase()) {
//             // twitterlog.log(screenname+' === '+msg.user.screen_name+' > '+msg.text)
//             twitterlog.notice(screenname)
//             dc.sendMessage({ to: chanid, message: screenname + ': ' + msg.text })
//           } else {
//             if (config.localhost()) console.log('wird nicht gepostet ' + typeof (screenname).toLowerCase() + ', ' + typeof (msg.user.screen_name).toLowerCase())
//           }
//         } catch (e) {
//           console.error('fn listenTweet msg: %j', msg)
//           console.error('fn listenTweet: %j', e)
//         }
//       }) // .setMaxListeners(1)
//     })
//   }
// }

// https://github.com/Chikachi/DiscordIntegration/wiki/How-to-get-a-token-and-channel-ID-for-Discord
var Discord = require('discord.io') // https://github.com/izy521/discord.io
// npm install woor/discord.io#gateway_v6 / https://github.com/izy521/discord.io/issues/237
var dc = new Discord.Client({
  autorun: config.localhost() ? (!!localhostobj.discord) : true,
  // token: ''
  token: ''
})

dc.on('ready', function () {
  // inv link
  // https://discordapp.com/api/oauth2/authorize?client_id=&scope=bot&permissions=0

  // fs.writeFileSync('./dc.json', util.inspect(dc, false, 9) , 'utf-8');
  setTimeout(function () {
    discordReload()
    // DOKU:  user in der DB, twitter screen_name, discord chan id
    // listenTweet('fr3ddytv','freddy27live', settingsprivate['fr3ddytv'].botsettings.discord.twitternews)
    dclog.notice('Logged in as ' + dc.id + ' - ' + dc.username + '#' + dc.discriminator)
    // {"username":"spddl","userID":"138293749468889088","channel":"#kirby","channelID":"316596093595156481","role":[],"user-type":"discord","type":"discord"}
    // console.log('DiscordCheck: '+DiscordCheck(138293749468889088, 316596093595156481))

    // FindRoleID('186946841923813376', 'Stammm')
    // console.log('STAMM: '+FindRoleID('193296596102938624', 'Stamm'))
    // console.log('Baum: '+FindRoleID('193296596102938624', 'Baum'))
  }, 1000)
})

dc.on('disconnected', function () { // TODO: braucht vermutlich niemand
  // dclog.notice('disconnected // TODO: braucht vermutlich niemand')
  console.log(chalk.whiteBright.bgBlueBright.bold('Discord'), 'disconnected // TODO: braucht vermutlich niemand')
  dc.connect()
})

dc.on('disconnect', function (errMsg, code) {
  // TODO: js throttle
  if (errMsg) console.log(chalk.whiteBright.bgBlueBright.bold('Discord'), 'Disconnect errMsg: ' + errMsg + ' - code: ' + code)
  else console.log(chalk.whiteBright.bgBlueBright.bold('Discord'), 'Disconnect code: ' + code)
  // if (errMsg) dclog.notice('Disconnect errMsg: ' + errMsg + ' - code: ' + code)
  // else dclog.notice('Disconnect code: ' + code)
  setTimeout(() => {
    dc.connect()
  }, 100)
  if (code === 0) return console.error(errMsg)
})

if (!config.localhost() || localhostobj.discord) {
  setInterval(function () {
    if (!dc.connected) {
      console.log(chalk.whiteBright.bgBlueBright.bold('Discord'), 'ist Offline und hat sich nicht selber verbunden')
      // dclog.notice('Discord ist Offline und hat sich nicht selber verbunden')
      dc.connect()
    }
  }, 1000 * 60 * 30) // 30min
}

/* dc.on('presence', function(user, userID, status, gameName, rawEvent) {
  console.log('presence: '+user+', '+userID+', '+status+', '+gameName) // e+', %j',rawEvent)
});

dc.on('debug', function(rawEvent) {
  console.log('debug: %j',rawEvent)
}); */

dc.on('message', function (user, userID, channelID, msg, rawEvent) {
  // console.debug(user + ', ' + userID + ', ' + channelID + ', ' + msg + ', %j', rawEvent)
  if (msg === 'ping') {
    // console.log('ping')
    dc.sendMessage({ to: channelID, message: 'pong' })
    return
  }

  var userobj = {
    username: user,
    userID: userID,
    channel: '#' + discordChannel[channelID], // channel: '#' + discordUsername[channelID], // undefined !!
    channelID: channelID,
    role: [],
    'user-type': (DiscordCheck(userID, channelID) ? 'mod' : 'discord'),
    type: 'discord'
  }

  // console.log('DiscordCheck: '+DiscordCheck(userobj.userID, userobj.channelID));

  if (config.localhost()) console.info(chalk.whiteBright.bgBlueBright.bold('Discord'), '[' + userobj.channel + '/' + channelID + '] <' + userobj.username + '>' + ((userobj['user-type'] === 'mod') ? ' \x1B[31mMOD\x1B[39m' : '') + ': ' + msg + ' - %j', userobj) // dclog.info('[' + userobj.channel + '] <' + userobj.username + '>' + ((userobj['user-type'] == 'mod') ? ' \x1B[31mMOD\x1B[39m' : '') + ': ' + msg + ' - %j', userobj)
  else console.info(chalk.whiteBright.bgBlueBright.bold('Discord'), '[' + userobj.channel + '/' + channelID + '] <' + userobj.username + '>: ' + msg)

  if (userobj['user-type'] === 'mod') {
    if (msg.toLowerCase() === 'channelid') {
      dc.sendMessage({ to: channelID, message: channelID })
    }
  }

  if (channelID in dc.directMessages) {
    dclog.log('privatchat')
    return
  }

  if (dc.id === userID) return // Bot.self

  // return
  // if (!config.localhost()) return;

  // permissioncheck(msg.trim(), userobj, userobj.channel)
  chathandle(userobj.channel, userobj, msg.trim(), false)
})
