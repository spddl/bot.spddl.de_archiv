// 'use strict'
process.env.NODE_ENV = 'production'

const util = require('util')
const winston = require('winston')
// const expressWinston = require('express-winston')

const logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({ // https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport
      level: 'silly',
      colorize: true,
      timestamp: true, // PM2 ?
      // timestamp: (process.argv[1].indexOf('ProcessContainerFork.js') === -1), // PM2 ?
      prettyPrint: true,
      humanReadableUnhandledException: true,
      showLevel: true
    })
  ]
})
global.console.error = logger.error
global.console.warn = logger.warn
global.console.info = logger.info
global.console.verbose = logger.verbose
global.console.debug = logger.info // global.console.debug = logger.debug
global.console.silly = logger.silly
global.console.log = logger.info // global.console.log = logger.debug

const config = require('./settings/config.js')()
const irc = require('tmi.js')
const path = require('path')
const db = require('./settings/db.js')
const cmd = require('./settings/cmd.js')
const async = require('async')
const express = require('express')
const helmet = require('helmet') // http://expressjs.com/de/advanced/best-practice-security.html
const favicon = require('serve-favicon')
const compression = require('compression')
const ejs = require('ejs')
const minify = require('html-minifier').minify
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const _ = require('underscore')
const request = require('request')
const requestjson = require('request-json')
const passport = require('passport')
// const TwitchtvStrategy = require('passport-twitch.js').Strategy // https://www.npmjs.com/package/passport-twitch.js
// const DiscordStrategy = require('passport-discord').Strategy
const socket = require('socket.io')
const http = require('http')
const https = require('https')
const CronJob = require('cron').CronJob // https://www.npmjs.com/package/cron
const cronfunc = require('./settings/cronfunc.js')()
const franc = require('franc')
const moment = require('moment')
// const cloudscraper = require('cloudscraper')
const chalk = require('chalk') // https://www.npmjs.com/package/chalk
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
const httpie = require('httpie') // https://github.com/lukeed/httpie

// try {
//   console.log('test', db.settingsprivate['rahyy'].botsettings.discord.onlinemsg)
// } catch (e) {
//   console.warn(e)
// }

// const Raven = require('raven')
// Raven.config('https://2d51322311764194a98e563337de415c:23e01f75390c4a919e42920d4b36bbcf@sentry.io/290074').install()

const Log = require('compact-log') // https://www.npmjs.com/package/compact-log
const log = new Log({ levelMode: 'SMART' })
const dclog = log.createNamespace({ name: 'Discord', colors: ['bgBlueBright', 'whiteBright'] })
const steamlog = log.createNamespace({ name: 'Steam', colors: ['bgGreenBright', 'black'] })
const steamcomlog = log.createNamespace({ name: 'SteamCommunity', colors: ['bgGreen', 'black'] })
// const twitterlog = log.createNamespace({ name: 'Twitter', colors: ['bgCyanBright', 'black'] })
// const Twitchlog = log.createNamespace({ name: 'Twitch', colors: ['bgMagentaBright', 'black'] })
// const Tipeeelog = log.createNamespace({ name: 'Tipeee', colors: ['bgYellowBright', 'black'] })

// const port = process.env.OPENSHIFT_NODE4_PORT || 8080
// const ip = process.env.OPENSHIFT_NODE4_IP || '127.0.0.1'
// const storage = './storage/'

const localhostobj = {
  twitch: true,
  discord: false,
  steam: false,
  twitter: false,
  tipeeestream: false
}

if (config.localhost()) log.separator('DEBUG ON!')

let start = false
setTimeout(function () {
  console.log('start true')
  start = true
// }, 120 * 1000) // 2 min
}, 240 * 1000) // 4 min

// let lastfm = new LastFmNode({ api_key: config.LastFm_api_key, secret: config.LastFm_secret })

let ClientID
let TWITCHTV_CLIENT_ID
let TWITCHTV_CLIENT_SECRET
let TWITCHTV_CALLBACKURL
// let TWITCHTV_AUTHORIZATION
// let DISCORD_CLIENT_ID
// let DISCORD_CLIENT_SECRET
// let DISCORD_CALLBACKURL
// let CONSUMER_KEY
// let CONSUMER_SECRET
// let ACCESS_TOKEN
// let ACCESS_TOKEN_SECRET

// curl -H 'Client-ID: ' -X GET 'https://api.twitch.tv/helix/streams?user_login=kirby'
if (config.localhost()) {
  ClientID = ''
  TWITCHTV_CLIENT_ID = '' // debug
  TWITCHTV_CLIENT_SECRET = ''
  TWITCHTV_CALLBACKURL = 'http://192.168.178.20/auth/twitchtv/callback'
  // TWITCHTV_AUTHORIZATION = db.settings.password.replace('oauth:', '')

  global.ClientID = ''
  global.TWITCHTV_CLIENT_ID = '' // debug
  global.TWITCHTV_CLIENT_SECRET = ''
  global.TWITCHTV_CALLBACKURL = 'http://192.168.178.20/auth/twitchtv/callback'
  // global.TWITCHTV_AUTHORIZATION = db.settings.password.replace('oauth:', '')

  // DISCORD_CLIENT_ID = ''
  // DISCORD_CLIENT_SECRET = ''
  // DISCORD_CALLBACKURL = 'https://bot.spddl.de/auth/discord/callback'
  // CONSUMER_KEY = ''
  // CONSUMER_SECRET = ''
  // ACCESS_TOKEN = ''
  // ACCESS_TOKEN_SECRET = ''
} else {
  ClientID = ''
  TWITCHTV_CLIENT_ID = '' // online
  TWITCHTV_CLIENT_SECRET = ''
  TWITCHTV_CALLBACKURL = 'https://bot.spddl.de/auth/twitchtv/callback'
  // TWITCHTV_AUTHORIZATION = db.settings.password.replace('oauth:', '')

  global.ClientID = ''
  global.TWITCHTV_CLIENT_ID = '' // online
  global.TWITCHTV_CLIENT_SECRET = ''
  global.TWITCHTV_CALLBACKURL = 'https://bot.spddl.de/auth/twitchtv/callback'
  // global.TWITCHTV_AUTHORIZATION = db.settings.password.replace('oauth:', '')
  // DISCORD_CLIENT_ID = ''
  // DISCORD_CLIENT_SECRET = ''
  // DISCORD_CALLBACKURL = 'https://bot.spddl.de/auth/discord/callback'
  // CONSUMER_KEY = ''
  // CONSUMER_SECRET = ''
  // ACCESS_TOKEN = ''
  // ACCESS_TOKEN_SECRET = ''
}
global.oauth = db.settings.password.replace('oauth:', '')
const settings = db.settings

// function settings_save () { // Save function
//   let settingsclone = {}
//   settingsclone.server = settings.server
//   settingsclone.botName = settings.botName
//   settingsclone.botNick = settings.botNick
//   settingsclone.password = settings.password
//   settingsclone.admins = settings.admins
//   settingsclone.discordemail = settings.discordemail
//   settingsclone.discordpassword = settings.discordpassword
//   settingsclone.admins = settings.admins
//   if (config.localhost()) {
//     settingsclone.localchannels = settings.channels
//     // settingsclone.localbotchannels=settings.botchannels
//     settingsclone.channels = settings.onlinechannels
//     // settingsclone.botchannels=settings.onlinebotchannels
//   } else {
//     settingsclone.localchannels = settings.localchannels
//     // settingsclone.localbotchannels=settings.localbotchannels
//     settingsclone.channels = settings.channels
//     // settingsclone.botchannels=settings.botchannels
//   }
//   settingsclone.swears = settings.swears
//   settingsclone.quotes = settings.quotes
//   settingsclone.backtalk = settings.backtalk
//   settingsclone.adminMsgs = settings.adminMsgs
//   jf.writeFileSync(storage + 'settings.json', settingsclone)
//   log.separator('settings_save', 'info')
//   // delete settingsclone
// }

console.info('Last Updated: (commands) ' + db.commands.lastupdated + '  Last Updated: (db.settingsprivate) ' + db.settingsprivate.lastupdated)
