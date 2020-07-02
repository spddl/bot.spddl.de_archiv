'use strict'

/*
var requestjson = require('request-json');

if(true){
  var ClientID = ''
  var TWITCHTV_CLIENT_ID = ''; // debug
  var TWITCHTV_CLIENT_SECRET = '';
  var TWITCHTV_CALLBACKURL = 'http://192.168.178.20/auth/twitchtv/callback';

  var DISCORD_CLIENT_ID = '';
  var DISCORD_CLIENT_SECRET = '-CO';
  // var DISCORD_CALLBACKURL = 'http://192.168.178.20/auth/discord/callback';
  var DISCORD_CALLBACKURL = 'https://bot.spddl.de/auth/discord/callback';

  var CONSUMER_KEY = ''
  var CONSUMER_SECRET = ''
  var ACCESS_TOKEN = '14573823-'
  var ACCESS_TOKEN_SECRET = ''
}else{
  var ClientID = ''
  var TWITCHTV_CLIENT_ID = ''; // online
  var TWITCHTV_CLIENT_SECRET = '';
  var TWITCHTV_CALLBACKURL = 'https://bot.spddl.de/auth/twitchtv/callback';

  var DISCORD_CLIENT_ID = '';
  var DISCORD_CLIENT_SECRET = '-CO';
  // var DISCORD_CALLBACKURL = 'http://localhost/auth/discord/callback';
  var DISCORD_CALLBACKURL = 'https://bot.spddl.de/auth/discord/callback';

  var CONSUMER_KEY = ''
  var CONSUMER_SECRET = ''
  var ACCESS_TOKEN = ''
  var ACCESS_TOKEN_SECRET = ''
}

var name = "spddl_bot"

// curl -H 'Accept: application/vnd.twitchtv.v5+json' \
// -H 'Client-ID: uo6dggojyb8d6soh92zknwmi5ej1q2' \
// -X GET https://api.twitch.tv/kraken/users?login=dallas,dallasnchains

requestjson.createClient('https://api.twitch.tv/kraken/users?login=').get(name,{headers:{'Accept':'application/vnd.twitchtv.v5+json','Client-ID':ClientID}}, function(err, res, body){
  console.log(body);
  // if (!err && res.statusCode === 200){
  //   if (!body.logo) callback(null) //  if (!body.logo) callback('http://bot.spddl.de/giveaway/404_user.png')
  //   else callback(body.logo)
  // }
});
*/

var console = require('compact-log') // https://www.npmjs.com/package/compact-log
var console = new console({ levelMode: 'SMART' })
var dclog = console.createNamespace({ name: 'Discord', colors: ['bgBlueBright', 'whiteBright'] })
var steamlog = console.createNamespace({ name: 'Steam', colors: ['bgGreenBright', 'black'] })
var steamcomlog = console.createNamespace({ name: 'SteamCommunity', colors: ['bgGreen', 'black'] })

var SteamUser = require('steam-user')
var steamclient = new SteamUser({ enablePicsCache: true })

steamclient.on('loggedOn', function (details) {
  console.log('Logged into Steam as ' + steamclient.steamID.getSteam3RenderedID())
  steamclient.setPersona(1) // 	"0": "Offline",	"1": "Online",	"2": "Busy",	"3": "Away",	"4": "Snooze",	"5": "LookingToTrade",	"6": "LookingToPlay",	"7": "Max",

  sendInv('http://steamcommunity.com/id/spddl/', function (name) {
    console.log('callback: ' + name)
  })
})

steamclient.logOn({
  accountName: '',
  password: ''
})

// var SteamCommunity = require('steamcommunity');
// var community = new SteamCommunity();

// var SteamCommunityobj = require('steamcommunity');
// var SteamID = SteamCommunityobj.SteamID;
var SteamCommunityobj = require('steamcommunity'); var SteamID = SteamCommunityobj.SteamID
var steamCommunity = new SteamCommunityobj()

function generateLogon () {
  return {
    accountName: '',
    password: ''
  }
}

function logOnSteam () {
  steamcomlog.log('Logging in to Steam...')
  steamCommunity.login(generateLogon(), function (e, sessionID, cookies, steamguard) {
    if (e) {
      steamcomlog.error('There was an error logging in ! Error details : ' + e.message)
      setTimeout(logOnSteam, 1000 * 60 * 4) // try to reconnect in 4 minutes
      // setTimeout(logOnSteam, 1000*30); // try to reconnect in 30 seconds
    } else {
      steamcomlog.log('Successfully logged in !')
      // steamcomlog.log(steamCommunity.getSessionID());
      steamCommunity.chatLogon() // to appear online
    }
  })
}

function checkSteamLogged () {
  steamCommunity.loggedIn(function (err, loggedIn, familyView) {
    // wenn das nicht klappt console.log(steamCommunity.getSessionID());
    if (err) {
      steamcomlog.log(' socket hang up? checkSteamLogged')
      console.log('%j', err)
      logOnSteam()
      setTimeout(checkSteamLogged, 1000 * 60 * 4) // check again in 4 min
    } else if (!loggedIn) {
      // steamcomlog.log("Steam login check : NOT LOGGED IN !");
      steamcomlog.error('Steam login check : NOT LOGGED IN !')
      logOnSteam()
    } else {
      // steamcomlog.log("Steam login check : already logged in !");
    }
  })
}

steamCommunity.on('sessionExpired', function (err) {
  if (err) { steamcomlog.log(err) }
  logOnSteam()
})

setInterval(checkSteamLogged, 1000 * 60 * 30) // 30min

logOnSteam()

function sendInv (url, cb) {
  // http://steamcommunity.com/profiles/76561198027155016
  // http://steamcommunity.com/id/spddl/
  url = url.trim()

  // if (url.indexOf('http://steamcommunity.com/id/') !== -1) {
  //   url = url.replace('http://steamcommunity.com/id/','')
  // }
  // if (url.indexOf('http://steamcommunity.com/profiles/') !== -1) {
  //   url = url.replace('http://steamcommunity.com/profiles/','')
  // }

  if (url.indexOf('profiles/') !== -1) {
    url = url.slice(url.indexOf('profiles/') + 9)
  }
  if (url.indexOf('id/') !== -1) {
    url = url.slice(url.indexOf('id/') + 3)
  }

  url = url.replace(/\//g, '')

  console.log(url)

  if (!isNaN(url)) {
    url = new SteamID(url)
  }

  steamCommunity.getSteamUser(url, function (err, data) {
    try {
      console.log(data.name)
      console.log(data.steamID)
      steamclient.inviteToGroup(data.steamID, '')
    } catch (e) {
      console.log(e)
      // console.log(data);
    }
  })
  // steamCommunity.getSteamUser('spddl', function(err,data){
  // console.log(data.name);
  //   console.log(data.steamID);
  //   steamCommunity.inviteToGroup(data.steamID, 'groupSteamID')
  // })
}

// sendInv(' http://steamcommunity.com/profiles/76561198027155016')
// sendInv('http://steamcommunity.com/id/spddl/ ')

// var user = {}
// user.msg = "!invite http://steamcommunity.com/profiles/76561198027155016"
//
// if (user.msg.indexOf('!invite') == 0) {
//   console.log(user.msg.slice(7));
// }

setTimeout(function () {
  // sendInv('http://steamcommunity.com/profiles/76561198169884247/',function(name){
  //   console.log(name);
  // })
  // sendInv('http://steamcommunity.com/profiles/76561198027155016',function(name){
  //   console.log(name);
  // })
  // sendInv('http://steamcommunity.com/id/spddl/',function(name){
  //   console.log(name);
  // })

  // steamCommunity.getSteamUser('spddl', function(err,data){
  //   console.log(data.name);
  //   // steamCommunity.inviteToGroup(data.steamID, 'groupSteamID')
  // })
}, 500)
