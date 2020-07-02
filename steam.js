// "use strict";  // Start the server

var config = require('./settings/config.js')(),
    irc = require('tmi.js'),
    //settings = require('./storage/settings'),
    // chathandle = require('./settings/chathandle.js'),
    db = require('./settings/db.js'),
    cmd = require('./settings/cmd.js'),
    fs = require('fs'),
    jf = require('jsonfile'),
    async = require('async'),
    express = require('express'),
    helmet = require('helmet'), // http://expressjs.com/de/advanced/best-practice-security.html
    favicon = require('serve-favicon'),
    compression = require('compression'),
    ejs = require('ejs'),
    minify = require('html-minifier').minify,
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    _ = require('underscore'),
    // _ = require('lodash'),
    request = require('request'),
    requestjson = require('request-json'),
    passport = require('passport'),
    TwitchtvStrategy = require('passport-twitchtv').Strategy,
    DiscordStrategy = require('passport-discord').Strategy,
    socket = require('socket.io'),
    // fb = require('fb'),
    http = require('http'),
    https = require('https'),
    jsonMarkup = require('json-markup'),
    util = require('util'),
    CronJob = require('cron').CronJob, // https://www.npmjs.com/package/cron
    // cronfunc = require('./settings/cronfunc.js')();
    urlencode = require('urlencode'),
    Levenshtein = require('levenshtein'),
    franc = require('franc'),
    moment = require('moment'),
    momenttz = require('moment-timezone'),
    momentcountdown = require('moment-countdown'),
    // Twit = require('twit'),
    // Twitter = require('twitter'),
    cloudscraper = require('cloudscraper'),
    LastFmNode = require('lastfm').LastFmNode,
    prettyHrtime = require('pretty-hrtime'),
    feed = require("feed-read"),
    // ssl = require('./settings/ssl.js'),
    Log = require('compact-log'); // https://www.npmjs.com/package/compact-log
    var log = new Log({ levelMode: 'SMART' });
    var dclog = log.createNamespace({ name: 'Discord', colors: ['bgBlueBright', 'whiteBright'] });
    var steamlog = log.createNamespace({ name: 'Steam', colors: ['bgGreenBright', 'black'] });
    var steamcomlog = log.createNamespace({ name: 'SteamCommunity', colors: ['bgGreen', 'black'] });
    var twitterlog = log.createNamespace({ name: 'Twitter', colors: ['bgCyanBright', 'black'] });
    var Twitchlog = log.createNamespace({ name: 'Twitch', colors: ['bgMagentaBright', 'black'] });
    var Tipeeelog = log.createNamespace({ name: 'Tipeee', colors: ['bgYellowBright', 'black'] });

var port = process.env.OPENSHIFT_NODE4_PORT || 80
  , ip = process.env.OPENSHIFT_NODE4_IP || '127.0.0.1'
  , storage = './storage/';

var start = false
setTimeout(function(){
  console.log('start true');
  start = true;
}, 120*1000); // 2min

////////////////////////////////////////////////////////////////////////////////
//
// @Steam Bot
//
////////////////////////////////////////////////////////////////////////////////

var steamuserinfo = require('steam-userinfo');
steamuserinfo.setup(config.steamapikey);
var SteamUser = require('steam-user');
var steamclient = new SteamUser({"enablePicsCache": true});

steamclient.on('loggedOn', function(details) {
  steamlog.notice('Logged into Steam as ' + steamclient.steamID.getSteam3RenderedID());
  steamclient.setPersona(2); // 	"0": "Offline",	"1": "Online",	"2": "Busy",	"3": "Away",	"4": "Snooze",	"5": "LookingToTrade",	"6": "LookingToPlay",	"7": "Max",
  steamclient.gamesPlayed(730); // 440 TF2, 730 CSGO
});

steamclient.on('accountLimitations', function(limited, communityBanned, locked, canInviteFriends) {
  var limitations = [];
  if(limited) { limitations.push('LIMITED'); }
  if(communityBanned) { limitations.push('COMMUNITY BANNED'); }
  if(locked) { limitations.push('LOCKED'); }

  if(limitations.length === 0) {
    if (!start) {
      steamlog.info("Our account has no limitations.");
    }
  } else {
    steamlog.info("Our account is " + limitations.join(', ') + ".");
  }

  if(canInviteFriends) {
    if (!start) {
      steamlog.info("Our account can invite friends.");
    }
  }
});

var Steam_userdb = {}
steamclient.on("licenses", function (licenses){             if (!start) { steamlog.info("Our account owns " + licenses.length + " license" + (licenses.length == 1 ? '' : 's') + ".") }
  }).on("wallet", function(hasWallet, currency, balance) {  if (!start) { steamlog.info("Our wallet balance is " + SteamUser.formatCurrency(balance, currency)) }
  }).on('newItems', function(count) {                       if (!start) { steamlog.info(count + " new items in our inventory") }
  }).on('emailInfo', function(address, validated) {         if (!start) { steamlog.info("Our email address is " + address + " and it's " + (validated ? "validated" : "not validated")) }
  }).on('vacBans', function(numBans, appids) {              if (!start) { steamlog.info("We have " + numBans + " VAC ban" + (numBans == 1 ? '' : 's') + ".") }
    if(appids.length > 0) {                                 if (!start) { steamlog.info("We are VAC banned from apps: " + appids.join(', ')) } }
  }).on('changelist', function(changenumber, apps, packages) { if (apps == 730) { steamlog.info("UPDATE changenumber: " + changenumber + ", apps: " + apps + ", packages: " + packages) }
  }).on('error', function(e) {                                  steamlog.error((SteamUser.EResult[e.eresult] ? SteamUser.EResult[e.eresult] : e )); // Some error occurred during logon
  }).on('webSession', function(sessionID, cookies) {        if (!start) { steamlog.info("Got web session"); } // Do something with these cookies if you wish
  //}).on('friendMessage', function(steamID, message) {         steamlog.info("Friend message from " + steamID +" " + steamID.getSteam3RenderedID() + ": " + message);
  }).on('friendRelationship', function(sid, relationship) {
    try {
      // TODO schreib das spddl
      steamlog.notice("Friend Relationship from http://steamcommunity.com/profiles/" + sid +" - " + SteamUser.EFriendRelationship[relationship]);
    } catch(err) {
      console.warn(err)
    }
  //}).on('friendOrChatMessage', function(senderID, message, room) {
    // TODO schreib das spddl
		//console.log('friendOrChatMessage '+senderID, message, room);
    //steamuser(senderID, message, room)
  }).on('friendMessage', function(steamID, message) {
    // TODO schreib das spddl
    console.log('['+process.pid+'] friendMessage '+steamID, message);
		steam_say({source: "76561198027155016"},message)
    //steamuser(steamID, message)
  });

/***************************************
  Eigene Steam Funktionen
***************************************/

steamclient.logOn({
	"accountName": config.steam_name,
	"password": config.steam_password
});
// logOnSteam();


function steam_say(user, msg){
  try {
   steamclient.chatMessage(user.chatterroom || user.source, msg)
   steamlog.info(user.chatterroom || user.source+': %j',msg)
   //steamlog.info(user.username+': %j',msg)
  }
  catch (e) {
    steamlog.error("steam_say fn: "+e)
  }
}



