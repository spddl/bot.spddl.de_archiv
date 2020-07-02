// https://www.chaseadams.io/eslint-disable-rules-with-comment-syntax/
/* eslint no-multiple-empty-lines: ["error", { "max": 2 }] */

// //////////////////////////////////////////////////////////////////////////////
// @import start
// //////////////////////////////////////////////////////////////////////////////
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
  // global.TWITCHTV_AUTHORIZATION = db.settings.password.replace(':', '')
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

// //////////////////////////////////////////////////////////////////////////////
// @import ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @config start
// //////////////////////////////////////////////////////////////////////////////
log.separator(' ' + db.settings.channels.length + ' Channels ', 'info')

const startTime = new Date()
const utc = new Date(startTime.getTime() + startTime.getTimezoneOffset() * 70000)
// var admins = settings.admins

setInterval(function () { // Wird hoffentlich bald durch sockets Ersetzt
  for (var i = 0; i < settings.channels.length; i++) {
    // if (!settingsprivate[settings.channels[i].substr(1)].botsettings.tipeeestream) {
    followeralert(settings.channels[i].substr(1))
    // }
  }
}, 3e5) // 1 Min 6e4 // Twitchalerts 5min (300000 / 3e5) // 4min 24e4

setInterval(function () {
  for (var i = 0; i < settings.channels.length; i++) {
    var x = settings.channels[i].substr(1)
    if (settings[x]) {
      settings[x].messageArray = []
    } else {
      settings[x] = {}
      settings[x].messageArray = []
    }
  }
}, 6e3) // 10 Min 6e5

for (let i = 0; i < settings.channels.length; i++) {
  const chanObj = settings.channels[i].substr(1)
  settings[chanObj] = {}
  settings[chanObj].allowing = []
  settings[chanObj].online = {
    status: false,
    OnCount: 0,
    minOnlineCount: 5,
    OffCount: 0,
    minOfflineCount: 5
  }
  settings[chanObj].giveaway = false // auto: an "true" / aus "false" TODO
  // settings[chanObj].giveawaysimple = false
  settings[chanObj].giveawaymembers = []
  // settings[chanObj].giveawaymembers = [{ username: 'user', msg: 'msg'}]
  // settings[chanObj].giveawaymembers = [{ username: '1user', msg: '1msg'}, { username: '2user', msg: '2msg'}, { username: '3user', msg: '3msg'}, { username: '4user', msg: '4msg'},{ username: '5user', msg: '5msg'},{ username: '6user', msg: '6msg'},{ username: '7user', msg: '7msg'},{ username: '8user', msg: '8msg'},{ username: '9user', msg: '9msg'},{ username: '10user', msg: '10msg'},{ username: '11user', msg: '11msg'},{ username: '12user', msg: '12msg'},{ username: '13user', msg: '13msg'},{ username: '14user', msg: '14msg'}]
  settings[chanObj].giveawaysuspend = []
  settings[chanObj].messageArray = []
  settings[chanObj].follows = []
  // settings[chanObj].roomstate = { "broadcaster-lang": null, "channel": chanObj, "emote-only": null, "r9k": null, "slow": null, "subs-only": null }
  settings[chanObj].roomstate = { 'broadcaster-lang': null, 'emote-only': null, r9k: null, slow: null, 'subs-only': null }

  try {
    // `CREATE TABLE IF NOT EXISTS twitch.spddl (
    //   \`_date\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    //   \`user\` VARCHAR(50) NOT NULL,
    //   \`coins\` INT(10) UNSIGNED NULL DEFAULT NULL,
    //   PRIMARY KEY (\`user\`),
    //   UNIQUE INDEX \`user\` (\`user\`)
    // )
    // COLLATE='latin1_swedish_ci'
    // ENGINE=InnoDB
    // ROW_FORMAT=COMPACT;`
  } catch (err) {
    console.warn('MySQL:', err)
  }

  try {
    /* if (db.settingsprivate[chanObj].settings.twittername){
      twitterlookup(db.settingsprivate[chanObj].botsettings.twittername,function(erg){
        settings[chanObj].twitterid = erg;
      })
    } */
    // if (!settingsprivate[chanObj].botsettings.tipeeestream) {
    followeralert(chanObj, true)
    // }

    // setInterval(function(){  process.nextTick(function x() { settings[chanObj].messageArray = [] }) },600000); // 10 Min

    if (db.settingsprivate[chanObj].botsettings.advertising.length !== 0) { // Werbung
      _.each(db.settingsprivate[chanObj].botsettings.advertising, function (json, index) {
        // console.log('caster: '+chanObj,json);
        cb(chanObj, json.id, json.time, json.text)
      })
    }
  } catch (err) {
    console.log('Neuer Channel? ' + chanObj)
    console.log('-----------------------------')
    console.log('err: ', err)

    db.settingsprivate[chanObj] = {}
    db.settingsprivate[chanObj].botsettings = {}
    db.settingsprivate[chanObj].botsettings.advertising = []
    db.settingsprivate[chanObj].botsettings.alloweddomains = ['youtube.com', 'soundcloud.com', 'youtu.be', 'steamcommunity.com', 'reddit.com']
    db.settingsprivate[chanObj].botsettings.alerts = {}
    db.settingsprivate[chanObj].botsettings.alerts.follower = {}
    db.settingsprivate[chanObj].botsettings.alerts.subscription = {}
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell = {}
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.modsonly = false
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.username = false
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.autodetectlanguage = false
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.voicelanguage = 'Deutsch Female'
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.voicevolume = 1
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.voicepitch = 1
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.voicerate = 1
    db.settingsprivate[chanObj].botsettings.giveaway = {}
    db.settingsprivate[chanObj].botsettings.steam = {}
    db.settingsprivate[chanObj].botsettings.steam.account = []
    db.settingsprivate[chanObj].botsettings.steam.steamgroup = []
    db.settingsprivate[chanObj].botsettings.discord = {}
    db.settingsprivate[chanObj].botsettings.uppercasepercent = '95'
    db.settingsprivate[chanObj].botsettings.symbolspercent = '55'
    db.settingsprivate[chanObj].botsettings.mods = [] // TODO TESTEN MODS
    db.settingsprivate[chanObj].botsettings.towords = []
    db.settingsprivate[chanObj].botsettings.banwords = []
    db.settingsprivate[chanObj].botsettings.ignorecmd = []
    db.settingsprivate[chanObj].botsettings.check24h = false
    db.settingsprivate[chanObj].botsettings.check24hwhisper = false
    db.settingsprivate[chanObj].botsettings.wrongcommandlevenshtein = 3
    db.settingsprivate_save()

    db.commands[chanObj] = {}
    db.commands[chanObj].cmd = {}
    db.commands[chanObj].counter = {}
    db.commands_save()

  //   setTimeout(function () {
  //     console.log('- Restart -')
  //     process.exit(1)
  //   }, 16 * 1000)
  }
}

db.settings.demo = {}
db.settings.demo.giveawaymembers = []

_.each(db.settings.channels, function (data) {
  data = data.substr(1)
  viewerava(data, function (twitchlogo) {
    if (twitchlogo !== null) twitchlogo = twitchlogo.substr(47)
    db.settings.demo.giveawaymembers.push({ username: data, msg: 'Enjoy my stream http://www.twitch.tv/' + data, logo: twitchlogo })
  })
})

function StreamerCheck (name) { // gehört der Name zu einem Streamer
  if (name === undefined) { return false }
  for (var i = 0; i < db.settings.channels.length; ++i) {
    if ((db.settings.channels[i].substr(1)) === name.toLowerCase()) {
      return true
    }
  }
  return false
}

function StreamerModCheck (name, cb) {
  cb(
    _.filter(db.settings.channels, function (caster) { // caster
      return name === caster.substr(1)
    })
    ,
    _.filter(db.settings.channels, function (caster) { // Mods
      // if (db.settingsprivate[caster.substr(1)].botsettings.mods[name]) { return caster.substr(1) }
      try {
        if (db.settingsprivate[caster.substr(1)].botsettings.mods) {
          if (db.settingsprivate[caster.substr(1)].botsettings.mods.toString().toLowerCase().indexOf(name.toLowerCase()) > -1) { return caster.substr(1) } // TODO TESTEN MODS
        } else {
          console.warn('StreamerModCheck', db.settingsprivate[caster.substr(1)].botsettings)
        }
      } catch (e) {
        console.warn(e)
      }
    })
  )
}

// //////////////////////////////////////////////////////////////////////////////
// @config ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @express/passport start
// //////////////////////////////////////////////////////////////////////////////
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Twitch.tv profile is
//   serialized and deserialized.
passport.serializeUser((user, done) => { done(null, user) }) // saved to session

passport.deserializeUser((user, done) => { done(null, user) }) // user object attaches to the request as req.user

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = async function (accessToken, done) {
  // console.log('userProfile (accessToken)', accessToken)
  try {
    const { data } = await httpie.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': TWITCHTV_CLIENT_ID,
        Accept: 'application/vnd.twitchtv.v5+json',
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (data && data.data && data.data[0]) {
      done(null, { data: data.data[0] })
    } else {
      console.warn('data.data[0] gibt es nicht', data)
      done(null, data)
    }
  } catch (error) {
    console.log('error', error)
    done(error)
  }
}
// Use the TwitchtvStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a accessToken, refreshToken, Twitch.tv profile, and scope required),
//   and invoke a callback with a user object.
// passport.use(new TwitchtvStrategy({
//   clientID: TWITCHTV_CLIENT_ID,
//   clientSecret: TWITCHTV_CLIENT_SECRET,
//   callbackURL: TWITCHTV_CALLBACKURL,
//   scope: [
//     'channel:read:subscriptions', // New Twitch API

//     'user_read', // Twitch API v5
//     'channel_check_subscription',
//     'channel_editor',
//     'channel_read',
//     'channel_subscriptions',
//     'communities_edit',
//     'communities_moderate',
//     'user_follows_edit',

//     'channel:moderate', // Chat and PubSub
//     'chat:edit',
//     'chat:read',
//     'whispers:read',
//     'whispers:edit'
//   ]
//   // https://github.com/justintv/Twitch-API/blob/23c3edf7f10f11f165fb2a11f25a0fc24287bd22/v3_resources/subscriptions.md#subscriptions
// }, (accessToken, refreshToken, profile, done) => {
//   console.log({ accessToken, refreshToken, profile })
//   console.log({ username: profile.login, StreamerCheck: StreamerCheck(profile.login) })

//   if (StreamerCheck(profile.login) || config.localhost()) {
//     if (typeof db.privatee[profile.login] === 'undefined') db.privatee[profile.login] = {}
//     console.log('db.privatee[profile.login]', db.privatee[profile.login])

//     db.privatee[profile.login].oauth = accessToken
//     db.privatee[profile.login]._id = profile.id
//     db.privatee[profile.login].lastupdated = new Date()
//     console.log('db.privatee[profile.login]', db.privatee[profile.login])
//     // console.log(db.privatee[profile.login])

//     db.privatee_save()
//     // process.nextTick(function (){ jf.writeFileSync(storage+'private.json', db.privatee) })
//   }

//   // console.error(profile.id);
//   // console.log(util.inspect(profile, false, null, true))
//   log.separator(` Login: ${profile.login || profile.display_name} `, 'info')
//   // https://dev.twitch.tv/docs/v5/guides/using-the-twitch-api/ TODO userid
//   // asynchronous verification, for effect...
//   // To keep the example simple, the user's Twitch.tv profile is returned to
//   // represent the logged-in user.  In a typical application, you would want
//   // to associate the Twitch.tv account with a user record in your database,
//   // and return that user instead.
//   return done(null, profile)
// }))

// var scopes = ['identify', 'email', /* 'connections', (it is currently broken) */ 'guilds', 'guilds.join']
// passport.use(new DiscordStrategy({
//   clientID: DISCORD_CLIENT_ID,
//   clientSecret: DISCORD_CLIENT_SECRET,
//   callbackURL: DISCORD_CALLBACKURL
// }, function (accessToken, refreshToken, profile, cb) {
//   console.log('profile.id: ' + profile.id)
//   /* if(StreamerCheck(profile.username)){
//     if (typeof privatee[profile.username] === 'undefined') privatee[profile.username] = {}
//     privatee[profile.username].oauth = accessToken
//     privatee[profile.username].lastupdated = new Date()

//     process.nextTick(function (){ jf.writeFileSync(storage+'private.json', privatee) });
//   }
//   console.separator('Login: '+profile.username,'alert'); */

//   // User.findOrCreate({ discordId: profile.id }, function (err, user) {
//   //   return cb(err, user)
//   // })
// }))

// //////////////////////////////////////////////////////////////////////////////
// @express/passport ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @express start
// //////////////////////////////////////////////////////////////////////////////
const app = express()

const morgan = require('morgan') // https://github.com/expressjs/morgan
app.use(morgan('spddl'))
app.use(morgan('combined'))

// const expressWinston = require('express-winston')
// app.use(expressWinston.logger({
//   transports: [
//     new winston.transports.Console()
//     // new winston.transports.Console({
//     //   // json: true,
//     //   colorize: true
//     // })
//     // new winston.transports.Papertrail({
//     //   host: 'logs2.papertrailapp.com',
//     //   port: 47664,
//     //   program: 'Express'
//     // })
//   ],
//   // level: 'http',
//   // msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
//   // expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
//   colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
//   meta: false,
//   ignoreRoute: (req, res) => { return req.headers['user-agent'] === 'HetrixTools.COM Uptime Monitoring Bot. https://hetrixtools.com/uptime-monitoring-bot.html' } // A function to determine if logging is skipped, defaults to returning false. Called _before_ any later middleware.
// }))

app.use(compression())

app.disable('x-powered-by')

app.use(helmet.hsts({ // https://www.npmjs.com/package/helmet
  maxAge: 31536000000,
  includeSubdomains: true,
  force: true
}))

app.use(favicon(path.join(__dirname, 'client', 'lib', 'favicon.ico'), 'max-age=31536000'))

// -----------------------------------------------------------------------------
// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See
// http://expressjs.com/api#app-settings for more details.
// app.enable('trust proxy') // TODO kann weg?

// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.
// app.use(function (req, res, next) { // TODO kann weg?
//   if (req.secure) {
//     //console.alert('request was via https, so do no special handling');      // request was via https, so do no special handling
//     next();
//   } else {
//     //console.alert('request was via http, so redirect to https');      // request was via http, so redirect to https
//     if(config.localhost() /*|| startrequestCertificate*/){
//       next()
//     } else {
//       res.redirect('https://' + req.headers.host + req.url)
//     }
//   }
// })
// -----------------------------------------------------------------------------

app.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  res.send('user-agent: *\nAllow: /$\nDisallow: /')
})

app.get('/commands/:id?', function (req, res) { // http://expressjs.com/api.html#res.json
  // console.log(req.params.id);
  if (StreamerCheck(req.params.id) || req.params.id === 'demo') {
    var tempjson = {}
    _.each(db.commands[req.params.id].cmd, function (json, key) {
      tempjson[key] = json.text
    })
    res.jsonp(tempjson) // res.jsonp(Object.assign({},commands[req.params.id],settingsprivate[req.params.id]))
  } else {
    res.status(404).send('Sorry cant find that! [' + req.params.id + ']')
  }
})

// Configure view engine to render EJS templates.
app.engine('ejs', function (filePath, options, callback) {
  ejs.__express(filePath, options, function (err, html) {
    if (err) return callback(err)
    callback(null, minify(html, { // https://www.npmjs.com/package/html-minifier
      collapseWhitespace: true
      // quoteCharacter: true,
      // removeAttributeQuotes: true
    }))
  })
})

app.set('views', path.join(__dirname, 'views'))
if (!config.localhost()) {
  if (app.get('env') === 'production') {
    console.log('process.env.NODE_ENV: ' + app.get('env'))
  } else {
    console.log(chalk.red('process.env.NODE_ENV: ' + app.get('env')))
  }
}
app.set('view engine', 'ejs')
if (!config.localhost()) { app.set('view cache', true) }

app.get('/follower/:id?/:debug?', function (req, res) { // http://expressjs.com/api.html#res.json
  // if(req.params.debug)  console.log('[GET] /follower/:id '+req.params.id+' :debug '+req.params.debug);
  // else console.log('[GET] /follower/:id '+req.params.id);

  if (StreamerCheck(req.params.id) || req.params.id === 'demo') {
    if (req.params.debug === 'debug') {
      res.render('follower', { user: req.params.id, local: config.localhost(), debugg: true, titel: false })
    } else {
      res.render('follower', { user: req.params.id, local: config.localhost(), debugg: false, titel: req.params.debug })
    }
  } else {
    console.log('404 nicht gefunden')
    res.status(404).send('Sorry cant find that! [' + req.params.id + ']')
  }
})

app.get('/magicconchshell/:id?/:debug?', function (req, res) { // http://expressjs.com/api.html#res.json
  // if(req.params.debug)  console.log('[GET] /magicconchshell/:id '+req.params.id+' :debug '+req.params.debug);
  // else console.log('[GET] /magicconchshell/:id '+req.params.id);

  if (StreamerCheck(req.params.id) || req.params.id === 'demo') {
    if (req.params.debug === 'debug') {
      res.render('magicconchshell', { user: req.params.id, local: config.localhost(), debugg: true, titel: false })
    } else {
      res.render('magicconchshell', { user: req.params.id, local: config.localhost(), debugg: false, titel: req.params.debug })
    }
  } else {
    console.log('404 nicht gefunden')
    res.status(404).send('Sorry cant find that! [' + req.params.id + ']')
  }
})

app.get('/magicconchshell_hosting/:id?/:debug?', function (req, res) { // http://expressjs.com/api.html#res.json
  // if(req.params.debug)  console.log('[GET] /magicconchshell_hosting/:id '+req.params.id+' :debug '+req.params.debug);
  // else console.log('[GET] /magicconchshell_hosting/:id '+req.params.id);

  if (StreamerCheck(req.params.id) || req.params.id === 'demo') {
    if (req.params.debug === 'debug') {
      res.render('magicconchshell_hosting', { user: req.params.id, local: config.localhost(), debugg: true, titel: false })
    } else {
      res.render('magicconchshell_hosting', { user: req.params.id, local: config.localhost(), debugg: false, titel: req.params.debug })
    }
  } else {
    console.log('404 nicht gefunden')
    res.status(404).send('Sorry cant find that! [' + req.params.id + ']')
  }
})

app.get('/voice/:id?/:debug?', function (req, res) { // http://expressjs.com/api.html#res.json
  // req.params.debug?console.log("[GET] /voice/:id "+req.params.id+" :debug "+req.params.debug):console.log("[GET] /voice/:id "+req.params.id);

  if (StreamerCheck(req.params.id) || req.params.id === 'demo') {
    if (req.params.debug === 'debug') {
      res.render('voice', { user: req.params.id, local: config.localhost(), debugg: true, titel: false })
    } else {
      res.render('voice', { user: req.params.id, local: config.localhost(), debugg: false, titel: req.params.debug })
    }
  } else {
    console.log('404 nicht gefunden')
    res.status(404).send('Sorry cant find that! [' + req.params.id + ']')
  }
})

// app.get('/chat/:id?', function (req, res) { // http://expressjs.com/api.html#res.json
//   // console.log('[GET] /chat/:id? '+req.params.id);
//   if (StreamerCheck(req.params.id) || req.params.id === 'demo') {
//     res.render('chat')
//   } else {
//     console.log('404 nicht gefunden')
//     res.status(404).send('Sorry cant find that! [' + req.params.id + ']')
//   }
// })

app.get('/chat/:id?', function (req, res) { // http://expressjs.com/api.html#res.json
  // console.log('[GET] /chat/:id? '+req.params.id);
  if (StreamerCheck(req.params.id) || req.params.id === 'demo') {
    res.render('chatroom', { user: req.params.id, local: config.localhost() })
  } else {
    console.log('404 nicht gefunden')
    res.status(404).send('Sorry cant find that! [' + req.params.id + ']')
  }
})

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))

const sessionobj = { // https://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x
  store: new RedisStore({}), // redis server config
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
  maxAge: 2.628e6,
  reapInterval: 86400, // 1 day
  cookie: {}
}
if (!config.localhost()) { sessionobj.cookie.secure = true }
const sessionMiddleware = session(sessionobj)
app.use(sessionMiddleware)

// sessionobj = { // https://github.com/valery-barysok/session-file-store
//  store: new FileStore({ // http://www.webdevelopment-tutorials.com/express-by-examples/10/session-with-file-storage/8/
//    maxAge: 2.628e6,
//    reapInterval: 86400
//  }),
//   secret: 'keyboard cat',
//   resave: true,
//   saveUninitialized: false,
//   maxAge: 2.628e6,
//   reapInterval: 86400, // 1 day
//   cookie: {}
// }
// if (!config.localhost()) { sessionobj.cookie.secure = true }
// app.use(session(sessionobj))

// Initialize Passport and restore authentication state, if any, from the session.
app.use(express.static(path.join(__dirname, 'client'), { index: false, maxage: 31536000000 }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

app.get('/log/:id?', ensureAuthenticated, function (req, res) {
  // req.params.id?console.log("[GET] /log/:id "+req.params.id+" :username " + req.user.login):console.log("[GET] /log/ username "+req.user.login);
  // if (!(req.params.id === undefined)) res.render('log', { user: { username: req.params.id }, local: config.localhost() });
  if (!req.params.id) res.render('log', { user: { username: req.params.id }, local: config.localhost() })
  else if (StreamerCheck(req.user.login)) res.render('log', { user: req.user, local: config.localhost() })
  else res.status(404).send('Sorry cant find that! [' + req.params.id + ']')
})
app.get('/log/demo', function (req, res) {
  res.render('log', { user: { username: 'demo' } })
})

app.get('/giveaway/demo', function (req, res) {
  res.render('giveaway', { user: { username: 'demo' }, giveaway: settings.demo.giveawaymembers }) // TODO ['demo'] geht das noch ?
})
app.get('/giveaway/:id?', ensureAuthenticated, function (req, res) {
  // if (!(req.params.id === undefined) && (req.user.login === "spddl")) res.render('giveaway', { user: { username: req.params.id},giveaway: db.settings[req.params.id].giveawaymembers });
  if (!req.params.id && (req.user.login === 'spddl')) res.render('giveaway', { user: { username: req.params.id }, giveaway: db.settings[req.params.id].giveawaymembers })
  else if (StreamerCheck(req.user.login)) res.render('giveaway', { user: req.user, giveaway: db.settings[req.user.login].giveawaymembers })
  else res.status(404).send('Sorry cant find that! [' + req.params.id + ']')
})

app.get('/:id?', function (req, res) {
  if (req.params.id) { req.params.id = (req.params.id).toLowerCase() }

  if (req.user) { // wenn eingeloggt
    StreamerModCheck(req.user.login, function (caster, mod) {
      console.log(`StreamerModCheck_ caster: ${caster} Mods: ${mod} _ caster.length: ${caster.length} Mods.length: ${mod.length}`)
      // console.log('StreamerModCheck_ caster.length: '+caster.length+' Mods.length: '+mod.length)
      if (req.params.id === undefined) {
        if (req.user.login === 'spddl') {
          console.log('SPDDL! ' + req.user.login)
          ejs.renderFile('./views/switch.ejs', { swwitch: { caster: caster, mod: settings.channels }, user: req.user, local: config.localhost() }, { removeWhitespace: false }, function (err, html) { if (err) console.error(err); res.send(minify(html, { collapseWhitespace: false })) })
        } else if ((caster.length !== 0 && mod.length !== 0) || (mod.length > 0)) {
          console.log('=StreamerModCheck_ caster.length: ' + caster.length + ' Mods.length: ' + mod.length)
          ejs.renderFile('./views/switch.ejs', { swwitch: { caster: caster, mod: mod }, user: req.user, local: config.localhost() }, { removeWhitespace: false }, function (err, html) { if (err) console.error(err); res.send(minify(html, { collapseWhitespace: false })) })
        } else if (caster.length === 0 && mod.length === 0) {
          console.log('ein niemand')
          // if (config.localhost()) { // TODO:
          //   ejs.renderFile('./views/switch.ejs',{ swwitch: {caster: caster, mod: settings.channels}, user: req.user, ClientID: ClientID, local: config.localhost()},{removeWhitespace: false}, function(err, html){ if (err) console.error(err); res.send(minify(html, { collapseWhitespace: false })); })
          // } else {
          ejs.renderFile('./views/index.ejs', { user: req.user, rights: null, local: config.localhost(), annyang: false, blocked: false, userlist: settings.channels, userparam: null }, { removeWhitespace: true }, function (err, html) { if (err) console.error(err); res.send(minify(html, { collapseWhitespace: true })) })
          // }
        } else {
          console.log('nicht spddl aber Host! ' + req.user.login)
          ejs.renderFile('./views/index.ejs', { user: req.user, rights: true, local: config.localhost(), commands: Object.assign({}, db.commands[req.user.login], db.settingsprivate[req.user.login], { roomstate: settings[(req.user.login).toLowerCase()].roomstate }), userparam: null, userlist: settings.channels, annyang: (db.voicecommands[req.user.login] || false), blocked: (db.settingsprivate.blocked.indexOf('#' + req.user.login) !== -1) }, { removeWhitespace: true }, function (err, html) {
            if (err) console.error(err); res.send(minify(html, { collapseWhitespace: true }))
          })
        }
      } else {
        log.separator('jmd mit Bot ID/Streamer: ' + req.params.id + ', Twitch User: ' + req.user.login, 'alert')
        // TODO: prüfen ob der Name ein Streamer ist
        // ejs.renderFile('./views/index.ejs',{ user: req.user, rights: null, annyang: false, blocked: false, userlist: settings.channels, userparam: null },{removeWhitespace: true}, function(err, html){ if (err) console.error(err); res.send(minify(html, { collapseWhitespace: true })); })
        // StreamerCheck(req.params.id)

        if (StreamerCheck(req.params.id)) {
          // console.log('StreamerCheck true '+req.user.login);
          if (req.user.login === 'spddl') {
            ejs.renderFile('./views/index.ejs', { rights: true, local: config.localhost(), commands: Object.assign({}, db.commands[req.params.id], db.settingsprivate[req.params.id], { roomstate: settings[req.params.id].roomstate }), user: req.user, userparam: req.params.id, userlist: db.settings.channels, annyang: (db.voicecommands[req.params.id] || false), blocked: (db.settingsprivate.blocked.indexOf('#' + req.user.login) !== -1) }, { removeWhitespace: true }, function (err, html) { if (err) console.error(err); res.send(minify(html, { collapseWhitespace: true })) })
          } else {
            var checkmodrequest = _.find(mod, function (mods) { return mods === '#' + req.params.id })
            var checkcasterrequest
            if (!checkmodrequest) {
              console.log('!checkmodrequest')
              checkcasterrequest = _.find(caster, function (caster) { return caster === '#' + req.params.id })
            }
            if (checkmodrequest) {
              console.log('checkmodrequest - true')
              console.log('checkmodrequest.substr(1) ' + checkmodrequest.substr(1) + ' req.user.login: ' + req.user.login)
              ejs.renderFile('./views/index.ejs', { user: req.user, rights: true, local: config.localhost(), commands: Object.assign({}, db.commands[checkmodrequest.substr(1)], db.settingsprivate[checkmodrequest.substr(1)], { roomstate: settings[checkmodrequest.substr(1)].roomstate }), userparam: checkmodrequest.substr(1), userlist: db.settings.channels, annyang: false, blocked: (db.settingsprivate.blocked.indexOf('#' + checkmodrequest.substr(1)) !== -1) }, { removeWhitespace: true }, function (err, html) { if (err) console.error(err); res.send(minify(html, { collapseWhitespace: true })) })
            } else if (checkcasterrequest) {
              console.log('checkcasterrequest - true')
              console.log('checkcasterrequest.substr(1) ' + checkcasterrequest.substr(1) + ' req.user.login: ' + req.user.login)
              ejs.renderFile('./views/index.ejs', { user: req.user, rights: true, local: config.localhost(), commands: Object.assign({}, db.commands[checkcasterrequest.substr(1)], db.settingsprivate[checkcasterrequest.substr(1)], { roomstate: settings[checkcasterrequest.substr(1)].roomstate }), userparam: checkcasterrequest.substr(1), userlist: db.settings.channels, annyang: false, blocked: (db.settingsprivate.blocked.indexOf('#' + checkcasterrequest.substr(1)) !== -1) }, { removeWhitespace: true }, function (err, html) { if (err) console.error(err); res.send(minify(html, { collapseWhitespace: true })) })
            } else {
              // Sollte nie eintreffen wenn man nach der Webseite handelt
              log.separator('keine Berechtigung für ' + req.params.id + ' wurde versucht von -> ' + req.user.login + ' ', 'alert')
              res.status(400).send('Bad Request')
            }
          }
        } else { // wenn der Streamer nicht gefunden wurde
          if (req.params.id === 'demo') {
            log.separator(' DEMO login ', 'notice')
            ejs.renderFile('./views/index.ejs', { rights: true, local: config.localhost(), commands: Object.assign({}, db.commands.demo, db.settingsprivate.demo, { roomstate: settings.demo.roomstate }), user: { username: req.user.login }, userparam: 'demo', userlist: db.settings.channels, annyang: false, blocked: false }, { removeWhitespace: true }, function (err, html) { if (err) console.error(err); res.send(minify(html, { collapseWhitespace: true })) })
          } else {
            ejs.renderFile('./views/index.ejs', { user: req.user, rights: null, local: config.localhost(), annyang: false, blocked: false, userlist: db.settings.channels, userparam: null }, { removeWhitespace: true }, function (err, html) { if (err) console.error(err); res.send(minify(html, { collapseWhitespace: true })) })
          }
        }
      }
    })
  } else { // wenn nicht eingeloggt
    if (StreamerCheck(req.params.id)) {
      ejs.renderFile('./views/index.ejs', { rights: false, local: config.localhost(), commands: null, username: null, userparam: req.params.id, userlist: db.settings.channels, annyang: false, blocked: false }, { removeWhitespace: true }, function (err, html) { if (err) console.error(err); res.send(minify(html, { collapseWhitespace: true, quoteCharacter: true, removeAttributeQuotes: true, minifyJS: true })) })
    } else {
      ejs.renderFile('./views/index.ejs', { rights: false, local: config.localhost(), commands: null, username: null, userparam: null, userlist: db.settings.channels, annyang: false, blocked: false }, { removeWhitespace: true }, function (err, html) { if (err) console.error(err); res.send(minify(html, { collapseWhitespace: true, quoteCharacter: true, removeAttributeQuotes: true, minifyJS: true })) })
    }
  }
})

app.get('/helix/users/:name', async (req, res) => {
  try {
    const { data } = await httpie.get(`https://api.twitch.tv/helix/users?login=${req.params.name}`, {
      headers: {
        'Client-ID': ClientID,
        Accept: 'application/vnd.twitchtv.v5+json',
        Authorization: `Bearer ${global.oauth}`
      }
    })
    res.json(data.data[0])
  } catch (error) {
    res.json(error)
  }
})

passport.use('twitch', new OAuth2Strategy({
  authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
  tokenURL: 'https://id.twitch.tv/oauth2/token',
  clientID: TWITCHTV_CLIENT_ID,
  clientSecret: TWITCHTV_CLIENT_SECRET,
  callbackURL: TWITCHTV_CALLBACKURL,
  state: true
}, (accessToken, refreshToken, profile, done) => {
  // profile.accessToken = accessToken
  // profile.refreshToken = refreshToken
  // console.log({ profile })
  // { profile:
  //    { data:
  //       { id: '29218758',
  //         login: 'spddl',
  //         display_name: 'spddl',
  //         type: '',
  //         broadcaster_type: '',
  //         description: '',
  //         profile_image_url:
  //          'https://static-cdn.jtvnw.net/jtv_user_pictures/spddl-profile_image-383ac69764a1ee3a-300x300.jpeg',
  //         offline_image_url: '',
  //         view_count: 16332 },
  //      accessToken: '73xsmzedhgzo4ipiueqf25esr3chol',
  //      refreshToken: 'l4qemveozrmk2x4r74935glde7zmb8amctly67u2l8qtfmg4vn' } }
  const _profile = profile.data
  console.log({ accessToken, refreshToken, _profile })
  console.log({ username: _profile.login, StreamerCheck: StreamerCheck(_profile.login) })

  if (StreamerCheck(_profile.login) || config.localhost()) {
    if (typeof db.privatee[_profile.login] === 'undefined') db.privatee[_profile.login] = {}
    console.log(`db.privatee[${_profile.login}]\\/\\/\\/\\/\\/\\/\\/\\/`, db.privatee[_profile.login])
    db.privatee[_profile.login].oauth = accessToken
    db.privatee[_profile.login].refreshToken = refreshToken
    db.privatee[_profile.login]._id = _profile.id
    db.privatee[_profile.login].lastupdated = new Date()
    console.log(`db.privatee[${_profile.login}]/\\/\\/\\/\\`, db.privatee[_profile.login])
    db.privatee_save()
  }

  log.separator(` Login: ${_profile.login || _profile.display_name} `, 'info')

  done(null, _profile)
}
))

app.get('/auth/twitchtv/callback', function (req, res, next) {
  passport.authenticate('twitch', function (err, user, info) {
    console.log({ err, user, info })
    if (err) { return next(err) }
    if (!user) { return res.redirect('/') } // login
    req.logIn(user, function (err) {
      if (err) { return next(err) }
      let returnTo = '/'
      if (req && req.session && req.session.returnTo) {
        returnTo = req.session.returnTo
      }
      return res.redirect(returnTo) // richtiger Login
    })
  })(req, res, next)
})

// Set route to start OAuth link, this is where you define scopes to request
app.get('/auth/twitchtv', passport.authenticate('twitch', {
  scope: [
    'channel:read:subscriptions', // New Twitch API

    'user_read', // Twitch API v5
    'channel_check_subscription',
    'channel_editor',
    'channel_read',
    'channel_subscriptions',
    'communities_edit',
    'communities_moderate',
    'user_follows_edit',

    'channel:moderate', // Chat and PubSub
    'chat:edit',
    'chat:read',
    'whispers:read',
    'whispers:edit'
  ]
}))

/* std
var greenlockExpressOptions = {
  email: 'email@provider.com',
  agreeTos: true,
  approvedDomains: ['bot.spddl.de'],
  debug: false
}
var httpserver, httpsserver
if (config.localhost()) {
  greenlockExpressOptions.server = 'staging'
} else {
  greenlockExpressOptions.server = 'https://acme-v01.api.letsencrypt.org/directory'
}

var lex = require('greenlock-express').create(greenlockExpressOptions)

if (config.localhost()) {
  httpserver = http.createServer(lex.middleware(app)).listen(80, function () {})
} else {
  httpserver = http.createServer(lex.middleware(require('redirect-https')())).listen(80)
  httpsserver = https.createServer(lex.httpsOptions, lex.middleware(app)).listen(443)
}
*/

const greenlockExpressOptions = {
  packageRoot: __dirname,
  cluster: false,
  version: 'draft-11',
  email: 'email@provider.com',
  agreeTos: true,
  approvedDomains: ['bot.spddl.de'],
  // challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/root/letsencrypt' }) },
  // store: require('le-store-certbot').create({ webrootPath: '/root/letsencrypt' }),
  // debug: true,
  debug: false,
  configDir: require('path').join(require('os').homedir(), 'acme', 'etc') // '/root/acme/etc'
  // renewWithin: (10 * 24 * 60 * 60 * 1000) // 10 Tage
  // renewWithin: (91 * 24 * 60 * 60 * 1000), // 91 Tage
  // renewBy: (90 * 24 * 60 * 60 * 1000) // 90 Tage
}
let httpserver
let httpsserver
// https://crt.sh/?q=bot.spddl.de // https://www.timeanddate.de/stadt/info/zeitzone/utc
if (config.localhost()) {
  greenlockExpressOptions.server = 'staging'
} else {
  // greenlockExpressOptions.server = 'https://acme-v01.api.letsencrypt.org/directory'
  // greenlockExpressOptions.server = 'https://acme-v02.api.letsencrypt.org/directory'
  greenlockExpressOptions.server = 'staging'
}

// [le/lib/core.js] Check Expires At 2018-05-01T15:20:50.000Z
// [le/lib/core.js] Check Renewable At 2018-04-24T15:20:50.000Z // Eine Woche bevor es ausläuft

// console.log(util.inspect('greenlockExpressOptions', greenlockExpressOptions, false, null, true))

// const lex = require('greenlock-express').create(greenlockExpressOptions)
const lex = require('greenlock-express').init(greenlockExpressOptions).serve(app)

if (config.localhost()) {
  httpserver = http.createServer(lex.middleware(app)).listen(8080, function () {})
  httpserver.on('request', (request, response) => {
    // the same kind of magic happens here!
  })
} else {
  httpserver = http.createServer(lex.middleware(require('redirect-https')())).listen(80)
  httpsserver = https.createServer(lex.httpsOptions, lex.middleware(app)).listen(443)

  // httpserver = http.createServer(lex.middleware(app)).listen(80, function () {})
  // httpserver.on('request', (request, response) => {
  //   // the same kind of magic happens here!
  // })
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) { return next() }
  req.session.returnTo = req.path
  res.redirect('/auth/twitchtv')
}

// //////////////////////////////////////////////////////////////////////////////
// @express ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @asyncQueue start
// //////////////////////////////////////////////////////////////////////////////
global.bot = {}
global.bot.limit = 0

var q = async.priorityQueue(function (c, cb) {
  global.bot.limit++
  // if(global.bot.limit % 5 === 0) console.log('\x1b[35m['+global.bot.limit+']\x1b[39m')

  switch (c.cmd) {
    case 'say': client.say(c.chan, c.msg); break
    case 'timeout': client.timeout(c.chan, c.user, c.time, c.reason); break
    case 'ban': client.ban(c.chan, c.user, c.reason); break
    case 'whisper': client.whisper(c.chan, c.msg); break
  }

  setTimeout(function () {
    global.bot.limit--
    cb()
  }, 30000) // 30 Sek
}, 99) // 100

q.saturated = function () {
  log.separator(' saturated ', 'emergency')
}
// //////////////////////////////////////////////////////////////////////////////
// @asyncQueue ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @twitch start
// //////////////////////////////////////////////////////////////////////////////
/* eslint no-undef: 0 */

const client = new irc.client({ // eslint-disable-line new-cap
  options: {
    debug: true
    // debugIgnore: ['chat', 'action', 'ping', 'part', 'join']
  },
  connection: {
    cluster: 'aws',
    secure: true,
    reconnect: true
  },
  identity: {
    username: db.settings.botName,
    password: db.settings.password // "password": "oauth:", // https://dev.twitch.tv/console/apps
    // password: 'oauth:',
  },
  channels: config.localhost() ? (localhostobj.twitch ? ['#spddl_bot', '#spddl'] : []) : db.settings.channels // botchannels TODO:
  // channels: []
})

// const delay = (time = 1000) => {
//   return new Promise(function (resolve, reject) {
//     setTimeout(() => {
//       resolve()
//     }, time)
//   })
// }
// const joinQueue = async.queue(async (task, callback) => {
//   console.log('joinQueue', task.channel)
//   switch (task.cmd) {
//     case 'join':
//       // await twitchJs.chat.join(task.channel)
//       try {
//         await client.join(task.channel)
//       } catch (error) {
//         console.warn('joinQueue', task.channel, error)
//       }
//       break
//     case 'part':
//       // await twitchJs.chat.part(task.channel)
//       await client.part(task.channel)
//       break
//   }
//   await delay(30000) // 30 Sek
//   callback()
// }, 3)

// const TwitchChannel = (config.localhost() ? (localhostobj.twitch ? ['#spddl_bot', '#spddl'] : []) : db.settings.channels)
// TwitchChannel.forEach(channel => {
//   // joinQueue.unshift({ cmd: 'join', channel })
//   joinQueue.push({ cmd: 'join', channel })
// })

const kirbyMods = {}

const bot = { // [Prio] niedriger ist wichtiger
  say: function (chan, msg, prio) {
    q.push({ cmd: 'say', chan: chan, msg: msg }, prio, err => {
      err && console.error(err)
    })
  },
  timeout: function (chan, user, time, reason) {
    q.push({ cmd: 'timeout', chan: chan, user: user, time: time, reason: reason }, 8, err => {
      err && console.error(err)
    })
  },
  ban: function (chan, user, reason) {
    q.push({ cmd: 'ban', chan: chan, user: user, reason: reason }, 9, err => {
      err && console.error(err)
    })
  },
  whisper: function (chan, msg, prio) {
    q.push({ cmd: 'whisper', chan: chan, msg: msg }, prio, err => {
      err && console.error(err)
    })
  }
}

client.on('join', function (chan, username) {
  try {
    // console.log('debug 614, chan: '+chan+'  username: '+username+' '+settingsprivate[chan.substr(1)].botsettings.check24h);
    if (db.settingsprivate[chan.substr(1)].botsettings.check24h || false) {
      check24h(true, username, function (result, time) {
        if (result) {
          // let diff = time-86400000
          // bot.timeout(chan.substr(1), username, Math.round(time/1000), 'Check24h: '+username+' bekommt einen TO: '+moment.utc(diff).format('HH:mm:ss')) // umrechnen von MS zu Sekunden
          bot.timeout(chan.substr(1), username, Math.round(time / 1000), 'Check24h: ' + username + ' bekommt einen TO: ' + moment.utc(time).format('HH:mm:ss')) // umrechnen von MS zu Sekunden
          if (db.settingsprivate[chan.substr(1)].botsettings.check24hwhisper || false) bot.whisper(chan.substr(1), ' ' + username + ' bekommt einen TO: ' + moment.utc(time).format('HH:mm:ss'))
          log.separator('check24h fn: ' + chan + ', ' + username + ', ' + time, 'emergency')
          io.of('/info/' + chan.substr(1)).emit('incomingmsg', { msg: 'check24h: TimeOut für ' + username + ' ' + moment.utc(time).format('HH:mm:ss') })
        }
      })
    } else if (db.settingsprivate[chan.substr(1)].botsettings.check24hwhisper || false) {
      check24h(true, username, function (result, time) {
        if (result) {
          // bot.timeout(chan.substr(1), username, Math.round(time/1000), 'Check24h: '+username+' bekommt einen TO: '+moment.utc(time).format("HH:mm:ss")); // umrechnen von MS zu Sekunden
          // let diff = time-86400000
          if (db.settingsprivate[chan.substr(1)].botsettings.check24hwhisper || false) bot.whisper(chan.substr(1), ' ' + username + ' wurde vor ' + moment.utc(time).format('HH:mm:ss') + ' auf Twitch erstellt.')
          log.separator('check24h fn: ' + chan + ', ' + username + ', ' + time, 'emergency')
          io.of('/info/' + chan.substr(1)).emit('incomingmsg', { msg: 'check24h: wurde vor ' + username + ' ' + moment.utc(time).format('HH:mm:ss') + ' auf Twitch erstellt.' })
        }
      })
    }
  } catch (e) {
    console.error('ERROR check24h, chan: ' + chan + '  username: ' + username + ' ' + e)
  }
})

function check24h (info, username, callback) {
  // TODO hier brauchen wir die ID des users
  requestjson.createClient('https://api.twitch.tv/kraken/users/').get(username, { headers: { 'Client-ID': ClientID, Accept: 'application/vnd.twitchtv.v3+json' } }, function (err, res, body) {
    let found = false
    let founddiff = null
    if (!err && res.statusCode === 200) {
      let diff = (Date.now() - moment(body.created_at).valueOf())
      if (diff < 8.64e7) { // 86400 Sekunden = 8.64e7 ms = 24 Stunden
        if (info) { diff = 8.64e7 - diff /* damit die andere Hälfte des Tages getimeoutet wird */ }
        found = true
        founddiff = diff
        // callback(true, diff)
        console.log('[check24h] Now: ' + moment.utc().format() + ' Twitch: ' + body.created_at + ', ' + diff + ' < 86400000')
      } else {
        // callback(false, null)
      }
    } else {
      // callback(false, null) // Error
    }
    callback(found, founddiff) // Error
  })
}


client.on('disconnected', function (reason) {
  log.separator(' Twitch disconnected ' + reason + ' ', 'notice')
}).on('logon', function () {
  log.separator(' Twitch bot logon', 'notice')
}).on('notice', function (channel, msgid, message) {
  if (msgid === 'msg_banned') { client.part(channel) }
  if (msgid !== 'timeout_success') {
    log.notice(channel + ', ' + msgid + ', ' + message)
  }
  // }).on("pong", function (latency){  log.notice('pong '+latency) 0.009 - 0.01
  // }).on("connecting", function (address, port){ log.notice('Bot Address: '+address+', port: '+port)
  // }).on("ban", function (channel, username, reason) { log.notice('BAN: '+channel+', > '+username+', '+reason)
  // }).on("timeout", function (channel, username, reason, duration) { log.notice('TO: '+channel+', > '+username+', '+reason+' ('+duration+')')
}).on('serverchange', function (channel) {
  log.separator(' serverchange: ' + channel + ' ', 'notice')
}).on('roomstate', function (channel, state) {
  if (settings[channel.substr(1)]) { settings[channel.substr(1)].roomstate = state } else { settings[channel.substr(1)] = {}; settings[channel.substr(1)].roomstate = state } // console.log('roomstate: '+channel+', '+state); console.info('roomstate: '+channel+' '+(state["broadcaster-lang"] === null ? '' : "broadcaster-lang: "+state["broadcaster-lang"]) , (state.r9k === false ? '' : " r9k: "+state.r9k) , (state.slow === false ? '' : " slow: "+state.slow) , (state['subs-only'] === false ? '' : " subs-only: "+state['subs-only']))
}).on('reconnect', function () {
  log.separator(' Twitch reconnect ', 'notice')
})

// if (config.localhost()) { client.on("pong", function (latency){ log.notice('pong '+latency) }) }

if (!config.localhost() || localhostobj.twitch) {
  client.connect()
}

client.on('whisper', function (from, user, message, self) { // client.on("whisper", function (user, message) {
  if (self) { return } // Don't listen to my own messages..
  console.log('Whisper: ' + user.username + ': ' + message)
  user.type = 'twitchgroup'

  // groupirc.say('#jtv','/w '+user.username+' ECHO: '+message) // debug
  // if (adminCheck(user, '#'+user.username) ){
  //   // if(message.substr(0,4) === "!ads"){
  //   //     if(adminCheck(user, '#'+user.username)){
  //   //       advertising('#'+user.username, message, user.username);
  //   //       return;
  //   //     }
  //   // }
  //   if(message.substr(0,1) === "!") {
  //     parseCmd(message.substr(1),'#'+user.username,user);
  //     return
  //   }
  // }
})

client.on('hosted', function (channel, username, viewers) {
  // channel: String - Channel name being hosted
  // username: String - Username hosting you
  // viewers: Integer - Viewers count

  if (db.settingsprivate.blocked.indexOf(channel) !== -1) { return }
  bot.whisper(channel, `Wird nun von ${username} gehostet mit ${viewers}`)
})

client.on('hosting', function (channel, target, viewers) { // Channel is now hosted by another broadcaster. This event is fired only if you are logged in as the broadcaster.
  if (db.settingsprivate.blocked.indexOf(channel) !== -1) { return }
  if (!((viewers === '-') || (viewers === 0))) {
    client.say(channel, 'https://www.twitch.tv/' + target + (viewers === 1 ? ' wird gehostet mit ' + viewers + ' Viewer' : ' wird gehostet mit ' + viewers + ' Viewern'), 1)
  }
})

client.on('emoteonly', function (channel, enabled) {
  try {
    if (enabled) {
      log.separator(' ' + channel + ' emoteonly: AN', 'info')
    } else {
      log.separator(' ' + channel + ' emoteonly: AUS', 'info')
    }
  } catch (e) {
    console.warn(e)
  }
})

client.on('followersonly', function (channel, enabled, length) {
  try {
    if (enabled) {
      log.separator(' ' + channel + ' followersonly: ' + length, 'info')
    } else {
      log.separator(' ' + channel + ' followersonly: AUS', 'info')
    }
  } catch (e) {
    console.warn(e)
  }
})

function methodsPlanCheck (methodsPlan) {
  let m
  switch (methodsPlan) {
    case 'Prime': m = { v: 'Prime', n: 5 }; break
    case '1000': m = { v: '$4.99', n: 5 }; break
    case '2000': m = { v: '$9.99', n: 10 }; break
    case '3000': m = { v: '$24.99', n: 25 }; break
  }
  return m
}


client.on('cheer', function (channel, userstate, message) {
  console.log('cheer', channel, userstate.bits, userstate['display-name'], message)
  if (channel === '#kirby') {
    setTimeout(function () {
      bot.say('#kirby', '!add ' + (userstate.bits / 5) + ' ' + userstate['display-name'], 2)
    }, 2000)
  }
})

client.on('subgift', function (chan, username, streakMonths, recipient, methods, userstate) {
  console.log('subgift', { chan, username, streakMonths, recipient, methods, userstate })
  let plan
  try {
    const months = (userstate && userstate['msg-param-months']) || 1 // könnte auch "true" sein :/
    plan = methodsPlanCheck(methods.plan)
    console.log('subgift:', chan, username, plan.v, recipient, months)
    if (chan === '#kirby') {
      setTimeout(() => { // Kirby
        // bot.say(chan, '!add ' + (plan.n / 5 * 100) + ' ' + recipient, 2)
        bot.say(chan, '!add ' + (months * plan.n / 5 * 100) + ' ' + recipient, 2)
      }, 2000)
    }
  } catch (e) {
    console.warn(methods, e)
  }
})

client.on('subscription', function (chan, username, methods, message, userstate) { // Username has subscribed to a channel.
  const plan = methodsPlanCheck(methods.plan)
  // console.log('subscription: ' + chan + ', ' + username + ', ' + plan.v)
  io.of('/subscriber/' + chan.substr(1)).emit('incomingmsg', { channel: chan, user: username })
  if (chan === '#kirby') {
    if (db.settingsprivate[chan.substr(1)].botsettings.alerts.subscription.sub1) {
      let msg = db.settingsprivate[chan.substr(1)].botsettings.alerts.subscription.sub1
      msg = msg.replace(new RegExp('{SUBNICK}', 'g'), username)
      bot.say(chan, msg, 1)
    } else {
      bot.say(chan, '!sub New Subscription [' + username + ']', 1)
    }

    setTimeout(() => {
      bot.say(chan, '!add ' + (plan.n / 5 * 100) + ' ' + username, 2)
    }, 2000)
  }
})

client.on('resub', function (chan, username, _months, message, userstate, methods) { // https://docs.tmijs.org/v1.2.1/Events.html#resub
  // https://github.com/tmijs/tmi.js/issues/325
  // try {
  //   console.log({ chan, username, _months, message, userstate, methods })
  //   console.log("userstate['msg-param-cumulative-months']", userstate['msg-param-cumulative-months'], _months)
  // } catch (e) {
  //   console.log('msg-param-cumulative-months', e)
  // }

  try {
    const months = (userstate && userstate['msg-param-cumulative-months']) || 0
    const plan = methodsPlanCheck(methods.plan)

    // console.log('subanniversary:', chan, ',', username, ',', months, ',', _months, ',', plan, ',', methods, ',', userstate)
    io.of('/subscriber/' + chan.substr(1)).emit('incomingmsg', { channel: chan, user: username, months: months })
    if (chan === '#kirby') {
      if (db.settingsprivate[chan.substr(1)].botsettings.alerts.subscription.resub) {
        let msg = db.settingsprivate[chan.substr(1)].botsettings.alerts.subscription.resub
        msg = msg.replace(new RegExp('{SUBNICK}', 'g'), username)
        msg = msg.replace(new RegExp('{MONTHS}', 'g'), months)
        msg = msg.replace(new RegExp('{POINTS}', 'g'), (months * plan.n / 5 * 100))
        bot.say(chan, msg, 1)
      } else {
        bot.say(chan, '!sub Subscription ' + months + ' months [' + username + ']', 1)
      }

      // Logik dahinter bleibt erst mal HardCode
      setTimeout(() => {
        // if (months > 30) months = 30
        // bot.say(chan, '!add ' + months + '00 ' + username, 2)
        bot.say(chan, '!add ' + (months * plan.n / 5 * 100) + ' ' + username, 2)
      }, 2000)
    }
  } catch (e) {
    console.warn(e)
    console.log(userstate)
  }
})

client.on('cheer', function (channel, userstate, message) {
  try {
    // log.separator(' '+channel+' cheer: '+message, 'info')
    console.log(channel + ' - ' + message + ' - cheer %j', userstate)
  } catch (e) {
    console.warn(e)
  }
})

client.on('mod', function (channel, username) {
  if (username === 'spddl_bot') {
    const index = db.settingsprivate.blocked.indexOf(channel)
    if (index > -1) {
      db.settingsprivate.blocked.splice(index, 1)
      log.notice('UNBLOCK: ' + channel + ' **********************************************************************')
      db.savecommand_save()
    }
  }
})

client.on('action', function (channel, user, message, self) {
  chathandle(channel, user, message, self)
})

client.on('chat', function (channel, user, message, self) {
  chathandle(channel, user, message, self)
})

function withoutEmotes (text, emotes) {
  var splitText = text.split('')
  for (var i in emotes) {
    var e = emotes[i]
    for (var j in e) {
      var mote = e[j]
      if (typeof mote === 'string') {
        mote = mote.split('-')
        mote = [parseInt(mote[0]), parseInt(mote[1])]
        var length = mote[1] - mote[0]
        var empty = Array.apply(null, new Array(length + 1)).map(function () { return '' })
        splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length))
        splitText.splice(mote[0], 1, '')
      }
    }
  }
  return splitText.join('')
}


const FetchAsync = async function (result, cmdtext, msg, user, channel) {
  // try { var text = await Promise.all(result.map(Functions)) }
  // try { var text = await Promise.all(result.map(function(name) { return Functions(name, msg, user, channel) })) }

  if (cmdtext.indexOf('{warteschlange_start}') !== -1 ||
    cmdtext.indexOf('{warteschlange_list}') !== -1 ||
    cmdtext.indexOf('{warteschlange_add}') !== -1 ||
    cmdtext.indexOf('{warteschlange_remove}') !== -1) {
    if (!db.settingsprivate[channel.substr(1)].botsettings.warteschlange) {
      msg = 'Warteschlange deaktiviert'

      if (user.type === 'steam') steamSay(user, msg)
      else if (user.type === 'twitchgroup') bot.whisper(user.username, msg)
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: msg })
      else bot.say(channel, msg, 1)
      return
    }
  }

  try {
    var text = await Promise.all(result.map(function (name) { return AwaitFunctions(name, cmdtext, msg, user, channel) }))
  } catch (err) {
    console.error(err)
  }

  var resultobj = {}
  for (var i = 0; i < result.length; i++) { resultobj[result[i]] = text[i] }

  // console.log(resultobj)
  // console.log('msg',msg)
  // console.log('text',text)
  // console.log('cmdtext',cmdtext)
  // Ersetzt das Ergebnis der funktionen im Text
  msg = cmdtext.replace(PromiseType, function (matched) { return resultobj[matched.toLowerCase()] })

  console.log(channel, msg)

  if (user.type === 'steam') steamSay(user, msg)
  else if (user.type === 'twitchgroup') bot.whisper(user.username, msg)
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: msg })
  else bot.say(channel, msg, 1)

  // if (config.localhost()) { console.timeEnd('1') }
}


const AwaitFunctions = function (name, cmdtext, msg, user, channel) {
  return new Promise(resolve => {
    channel = channel.substr(1) // entfernt die #
    // console.log('%j',user)
    console.log('Functions: name;' + name + ', text;' + cmdtext + ', msg;' + msg + ', channel;' + channel)
    // Functions: name;{counter}, text;hat nun schon {counter} mal wow gesagt!!, msg;!wow, channel;spddl_bot
    // console.log(util.inspect(user, false, null, true))
    // console.log( msg.substr(1).split(' ')[0] ); // Nur der Befehl
    // follow => ich brauche nur den String von msg ab der ersten leerzeile
    // (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '')
    let msgarr
    switch (name.toLowerCase()) { // TODO: moar
      case '{nick}':
        resolve(user['display-name'] || user.username)
        break
      case '{userid}': // debug
        console.log(user)
        resolve(user['user-id'])
        break
      case '{arg}':
        resolve((msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''))
        break
      case '{add}':
        // resolve(cmd.add(user, channel, msg))
        resolve(cmd.add(user, channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '')))
        break
      case '{del}':
        // done(cmd.add(user, channel, msg))
        resolve(cmd.del(user, channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '')))
        break
      case '{pubg}': // username, action, platform, mode
        msgarr = msg.split(' ')
        resolve(cmd.pubg(msgarr[0], msgarr[1], msgarr[2], msgarr[3], msgarr[4]))
        break
      case '{mm}':
        resolve(cmd.mm())
        break
      case '{uptime}':
        resolve(cmd.uptime(channel, ClientID))
        break
      case '{subage}':
        resolve(cmd.subage(user, channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''), ClientID)) // TODO: Kirby only?
        break
      case '{subs}':
        resolve(cmd.subs(user, channel, ClientID)) // TODO: Kirby only? // TODO target
        break
      case '{follow}':
      case '{follower}':
        // TODO: msg.replace(text, '')
        // console.log('target?? ' + (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '' ))
        resolve(cmd.follower(user, channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''), ClientID))
        break
      case '{twitchstatus}':
        resolve(cmd.twitchstatus(channel, user, ClientID))
        break
      case '{titelchange}':
        resolve(cmd.titelchange(channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''), ClientID))
        break
      case '{gamechange}':
        resolve(cmd.gamechange(channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''), ClientID))
        break
      case '{permit}':
        resolve(permit(user, channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '')))
        break
      case '{steaminvite}': // TODO Kirby only
        resolve(SteamInvite(user, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '')))
        break
      case '{counter}':
        // wäre gut wenn der Streamer ein Dropdown menu/Input Feld und ein Input Feld bekommt
        resolve(cmd.counter(channel, msg))
        break
      case '{streamstart}':
        user.channel = channel.substr(1)
        steamStart(user, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''))
        resolve('')
        break
      case '{weather}':
        msgarr = msg.split(' ')
        resolve(cmd.weather(channel, user, msgarr[1], msgarr[2]))
        break

      case '{warteschlange_start}':
        if (!db.settingsprivate[channel].botsettings.warteschlange) { console.log('warteschlange off'); return resolve('Warteschlange deaktiviert') }
        msgarr = msg.split(' ')
        resolve(cmd.warteschlange_start(channel, msgarr[1]))
        break
      case '{warteschlange_list}': // !warteschlange = Anzahl in der Warteschlange
        console.log(db.settingsprivate[channel].botsettings.warteschlange)
        // if (!db.settingsprivate[channel].botsettings.warteschlange) { console.log('warteschlange off'); return resolve('') }
        resolve(cmd.warteschlange_list(channel, false))
        break
      case '{warteschlange_add}': // !gamen zum Eintragen in die Liste
        if (!db.settingsprivate[channel].botsettings.warteschlange) { console.log('warteschlange off'); return resolve('') }
        msgarr = msg.split(' ')
        resolve(cmd.warteschlange_add(user, channel, msgarr[1]))
        break
      case '{warteschlange_remove}':
        if (!db.settingsprivate[channel].botsettings.warteschlange) { console.log('warteschlange off'); return resolve('') }
        msgarr = msg.split(' ')
        resolve(cmd.warteschlange_remove(user, channel, msgarr[1]))
        break
      case '{warteschlange_toggle}':
        msgarr = msg.split(' ')
        resolve(cmd.warteschlange_toggle(channel, msgarr[1]))
        break

      case '{faceitelo}':
        resolve(cmd.faceitelo(channel))
        break

      case '{faceitmatchlink}':
        resolve(cmd.faceitmatchlink(channel))
        break

      case '{test}':
        resolve(cmd.test())
        break
      default:
        resolve()
    }
  })
}


function SteamInvite (user, msg) {
  return new Promise(function (resolve) {
    var url = msg.trim()

    if (url.indexOf('profiles/') !== -1) {
      url = url.slice(url.indexOf('profiles/') + 9)
    }
    if (url.indexOf('id/') !== -1) {
      url = url.slice(url.indexOf('id/') + 3)
    }

    url = url.replace(/\//g, '')

    console.log('url: ' + url)
    if (!isNaN(url)) { url = new SteamID(url) }
    steamCommunity.getSteamUser(url, function (err, data) {
      if (err) { console.log(err) }

      try {
        console.log('data.name: ' + data.name)
        resolve(data.name + ' bekommt eine Gruppen einladung')
      } catch (e) {
        console.warn(e)
      }

      try {
        console.log('data.steamID: ' + data.steamID)
      } catch (e) {
        console.warn(e)
      }

      try {
        steamclient.inviteToGroup(data.steamID, '103582791436262781') // Kirby
      } catch (e) {
        console.warn(e)
      }
    })
  })
}


function permit (user, channel, msg) {
  return new Promise(function (resolve) {
    msg = msg.substr(msg.indexOf(' ') + 1)
    user = msg.toLowerCase()

    try {
      console.log(msg, user)
      console.log(settings[channel].allowing)
    } catch (error) {
      console.warn('permit error', error)
    }

    if (!settings[channel].allowing) settings[channel].allowing = []
    settings[channel].allowing.push(user) // TypeError: Cannot read property 'push' of undefined
    resolve('.me is allowing links from ' + user + ' (2min)')
    setTimeout(noMoreLinks, 120 * 1000, user, channel)
  })
}


function noMoreLinks (user, channel) {
  bot.say(channel, '.me is no longer accepting links from ' + user, 1)
  settings[channel].allowing = _.without(settings[channel].allowing, user)
}


function uniqArray (array) { // TODO: https://dev.to/farskid/detecting-unique-arrays-in-javascript-3f20
  var result = []
  for (var i = 0; i < array.length; i++) {
    if (result.indexOf(array[i].toLowerCase()) < 0) {
      result.push(array[i].toLowerCase())
    }
  }
  return result
}


const PromiseType = /{nick}|{userid}|{arg}|{del}|{mm}|{add}|{uptime}|{subage}|{subs}|{follow}|{twitchstatus}|{titelchange}|{gamechange}|{permit}|{steaminvite}|{counter}|{streamstart}|{weather}|{pubg}|{warteschlange_start}|{warteschlange_list}|{warteschlange_add}|{warteschlange_remove}|{warteschlange_toggle}|{faceitelo}|{faceitmatchlink}|{test}/gi

function permissioncheck (msg, user, channel) {
  'use strict'

  // if (config.localhost()) { log.debug('permissioncheck: ' + msg + ', ' + channel + ', %j', user); console.time('1') }
  // console.log('permissioncheck: ' + msg + ', ' + channel + ', %j', user) // console.time('1')
  const cmd = db.commands[channel.substr(1)].cmd[msg.split(' ')[0]] // TODO dann MUSS der einzugebene Text mit einem Befehl anfangen
  // console.log('permissioncheck', cmd)

  if (cmd) {
    if (cmd.permission) {
      const p = permission(cmd.permission, msg, user, channel)
      // console.log('permission p', p) // true
      if (!p) {
        console.log('Abort!!!!!!!! permission func, keine Rechte')
        return
      }

      // if (cmd.permission.host !== true) { // TODO: oder vergleich mit dem channel
      //   if (user.badges && user.badges.broadcaster !== 1) {
      //     console.info('permission.host: ' + msg)
      //     return false
      //   }
      // }
      // if (cmd.permission.subscriber !== true) {
      //   if (!user.subscriber) {
      //     console.info('permission.subscriber: ' + msg); return false
      //   }
      // }

      // if (cmd.permission.turbo !== true) {
      //   if (!user.turbo) {
      //     console.info('permission.turbo: ' + msg); return false
      //   }
      // }

      // if (cmd.permission.mod !== true) {
      //   if (!user.mod) {
      //     console.info('permission.mod: ' + msg); return false
      //   }
      // }
      // // if (cmd.permission.botmod !== true) {
      // //   if (user.subscriber) {
      // //     console.info('permission.botmodv: ' + msg); return false
      // //     db.settingsprivate[channel.substr(1)].botsettings.mods.some((item) => { return item.toLowerCase() === user.username.toLowerCase() })) { console.info('permission.botmod: ' + msg); return false }
      // //   }
      // // }
      // if (cmd.permission.viewer !== true) {
      //   console.info('permission.viewer: ' + msg); return false
      // }

      // if ((!cmd.permission.host || cmd.permission.host === false) && (user.badges && user.badges.broadcaster === 1)) { console.info('permission.host: ' + msg); return false } // TODO: oder vergleich mit dem channel
      // if ((!cmd.permission.subscriber || cmd.permission.subscriber === false) && user.subscriber) { console.info('permission.subscriber: ' + msg); return false }
      // if ((!cmd.permission.turbo || cmd.permission.turbo === false) && user.turbo) { console.info('permission.turbo: ' + msg); return false }
      // if ((!cmd.permission.mod || cmd.permission.mod === false) && user.mod) { console.info('permission.mod: ' + msg); return false }
      // if ((!cmd.permission.botmod || cmd.permission.botmod === false) && db.settingsprivate[channel.substr(1)].botsettings.mods.some((item) => { return item.toLowerCase() === user.username.toLowerCase() })) { console.info('permission.botmod: ' + msg); return false }
      // if (!cmd.permission.viewer || cmd.permission.viewer === false) { console.info('permission.viewer: ' + msg); return false }
    }

    const FunctionsFound = PromiseType[Symbol.match](cmd.text)
    // console.log('FunctionsFound', FunctionsFound)

    if (FunctionsFound) { // !null
      FetchAsync(uniqArray(FunctionsFound), cmd.text, msg, user, channel)
    } else { // Text Command ohne Funktion
      if (user.type === 'steam') steamSay(user, cmd.text)
      else if (user.type === 'twitchgroup') bot.whisper(user.username, cmd.text)
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: cmd.text })
      else bot.say(channel, cmd.text, 1)
      // if (config.localhost()) { console.timeEnd('1') }
    }

    return true
  } /* else {
    if (config.localhost()) { console.warn('kein Befehl gefunden: '+msg); console.timeEnd('1'); }
    return false
  } */
}

// function permission_x (permission, msg, user, channel) {
//   if ((!permission.host || permission.host === false) && (user.badges && user.badges.broadcaster === 1)) { console.info('permission.host: ' + msg); return false } // TODO: oder vergleich mit dem channel
//   if ((!permission.subscriber || permission.subscriber === false) && user.subscriber) { console.info('permission.subscriber: ' + msg); return false }
//   if ((!permission.turbo || permission.turbo === false) && user.turbo) { console.info('permission.turbo: ' + msg); return false }
//   if ((!permission.mod || permission.mod === false) && user.mod) { console.info('permission.mod: ' + msg); return false }
//   if ((!permission.botmod || permission.botmod === false) && db.settingsprivate[channel.substr(1)].botsettings.mods.some((item) => { return item.toLowerCase() === user.username.toLowerCase() })) { console.info('permission.botmod: ' + msg); return false }
//   // if (!permission.viewer || permission.viewer === false) { console.info('permission.viewer: ' + msg); return false }
//   // console.info('permission.true: ' + msg)
//   return true
// }


function permission (permission, msg, user, channel) {
  // if (!permission(cmd.permission, msg, user, channel)) {
  //   console.log('Abort!!!!!!!!')
  //   return
  // }

  if (permission.host === true) { // TODO: oder vergleich mit dem channel
    // console.info('permission.host: ' + msg)
    // if (user.badges) {
    //   console.log(user.badges.broadcaster)
    //   console.log(typeof user.badges.broadcaster)
    // }
    if (user.badges && user.badges.broadcaster === '1') {
      // console.log('host return true')
      return true
    }
  }
  if (permission.subscriber === true) {
    // console.info('permission.subscriber:', msg, user.subscriber)
    if (user.subscriber) {
      // console.log('host return subscriber')
      return true
    }
  }

  if (permission.turbo === true) {
    // console.info('permission.turbo:', msg, user.turbo)
    if (user.turbo) {
      return true
    }
  }

  if (permission.mod === true) {
    // console.info('permission.mod:', msg, user.mod)
    if (user.mod) {
      return true
    }
  }
  // if (permission.botmod !== true) {
  //   if (user.subscriber) {
  //     console.info('permission.botmodv: ' + msg); return false
  //     db.settingsprivate[channel.substr(1)].botsettings.mods.some((item) => { return item.toLowerCase() === user.username.toLowerCase() })) { console.info('permission.botmod: ' + msg); return false }
  //   }
  // }
  if (permission.viewer === true) {
    // console.info('permission.viewer: ', msg)
    return true
  }

  return false
}


async function chathandle (channel, user, message, self) {
  // console.log({ channel, user, message, self })
  if (db.settingsprivate.blocked.indexOf(channel) !== -1) { return }
  if (self) { return }

  if (user && user['custom-reward-id']) {
    console.log('custom-reward-id', user.username, user['custom-reward-id'], message)
    if (message.toLowerCase() === 'id') {
      bot.say(channel, user['custom-reward-id'], 100)
      return
    }
  }

  // if (user && user.username === 'spddl') { // debug
  //   switch (message) {
  //     case 'mods':
  //       try {
  //         const mods = await client.mod(channel, 'spddl_gaming')
  //         console.log(mods)
  //       } catch (error) {
  //         console.warn(error)
  //       }
  //       break

  //     case 'addmod':
  //       try {
  //         const d1 = await client.mod(channel, 'spddl_gaming')
  //         console.log(d1)
  //       } catch (error) {
  //         console.warn(error)
  //       }
  //       break

  //     case 'delmod':
  //       try {
  //         const d2 = await client.unmod(channel, 'spddl_gaming')
  //         console.log(d2)
  //       } catch (error) {
  //         console.warn(error)
  //       }
  //       break

  //     default:
  //       break
  //   }
  // }

  //  hey hey - wäre es möglich dass man per 10000er nur normale Leute timeouten kann & für 20000 (neue Kachel) dann zusätzlich Mods?
  // Hey: slight_smile: Alles gut ? Wäre es möglich für 15000 Non Mods zu untimeouten & für 25000 Mods zu untimeouten ? Also Quasi opposite von den ersten beiden Schaltflächen ?

  // Timeout für 5 Minuten (10000er nur normale Leute)
  if (channel && channel === '#kirby' && user && user['custom-reward-id']) {
    const BanUser = user['custom-reward-id'] === 'cf8ec3b9-0321-4e7a-b4c1-af2869d365f3'
    const BanMods = user['custom-reward-id'] === '52f10542-381f-4a59-8c2b-986b9bed6245'
    const NonModsUnTimeout = user['custom-reward-id'] === '9a88d396-d4af-4ea8-9ce6-b9df271d38c3'
    const ModsUnTimeout = user['custom-reward-id'] === '1fdbd636-c9ed-45a3-872a-f56722a4d701'

    if (BanUser || BanMods || NonModsUnTimeout || ModsUnTimeout) {
      if (message === 'spddl_bot' || message === 'Klrbybot') {
        bot.say(channel, 'LUL', 100)
      } else {
        const TimeoutSek = 5 * 60
        const moderators = await client.mods(channel)
        console.log(`${moderators}.indexOf(${message}.toLowerCase()) === -1`, (moderators.indexOf(message.toLowerCase()) === -1 ? 'Ist kein Mod' : 'Ist Mod'))

        if (moderators.indexOf(message.toLowerCase()) === -1) {
          if (BanUser) {
            console.log('custom-reward-id: BanUser')
            console.log(`bot.timeout(${channel}, ${message}, ${TimeoutSek}, 'Timeout für 5 Minuten von: ${user.username}')`)
            bot.timeout(channel, message, TimeoutSek, `Timeout für 5 Minuten von: ${user.username}`) // ist kein MOD
          } else if (NonModsUnTimeout) {
            console.log('custom-reward-id: NonModsUnTimeout', { channel, message, time: 1, msg: `unTimeout von: ${user.username}` })
            console.log(`bot.timeout(${channel}, ${message}, 1, 'unTimeout von: ${user.username}')`)
            bot.timeout(channel, message, 1, `unTimeout von: ${user.username}`) // ist kein MOD
          } else if (ModsUnTimeout && kirbyMods[message]) {
            // Wenn der Mod gerade ein Timeout hat ist er atm auch kein Mod
            clearTimeout(kirbyMods[message])
            delete kirbyMods[message]
            console.log('custom-reward-id: ModsUnTimeout')

            console.log(`await clientKirby.timeout(${channel}, ${message}, 1, 'unTimeout')`)
            await clientKirby.timeout(channel, message, 1, 'unTimeout')
            setTimeout(async () => {
              console.log(`await clientKirby.mod(${channel}, ${message})`)
              await clientKirby.mod(channel, message)
            }, 1000)
          }
        } else {
          if (BanMods) {
            console.log('custom-reward-id: BanMods')

            console.log(`await clientKirby.mod(${channel}, ${message})`)
            await clientKirby.unmod(channel, message)
            setTimeout(() => {
              console.log(`bot.timeout(${channel}, ${message}, ${TimeoutSek}, 'Timeout für 5 Minuten von: ${user.username}')`)
              clientKirby.timeout(channel, message, TimeoutSek, `Timeout für 5 Minuten von: ${user.username}`)
            }, 1000)

            kirbyMods[message] = setTimeout(async () => { // TODO: in einer Var speichern, var uuid
              console.log(`await clientKirby.timeout(${channel}, ${message}, 1, 'unTimeout')`)
              await clientKirby.timeout(channel, message, 1, 'unTimeout')
              setTimeout(async () => {
                console.log(`await clientKirby.mod(${channel}, ${message})`)
                await clientKirby.mod(channel, message)
                delete kirbyMods[message]
              }, 1000)
            }, 5 * 60 * 1000)
          }
        }
      }
    }
  }

  // TEST
  if (channel && channel === '#spddl' && message === 'unmod') {
    const TimeoutSek = 5 * 60
    const moderators = await client.mods('#kirby')
    console.log(`${moderators}.indexOf(spddl) === -1`, moderators.indexOf('spddl'.toLowerCase()) === -1)

    const data = await clientKirby.unmod('#kirby', 'spddl')
    console.log('unmod', data)

    setTimeout(() => {
      console.log({ channel: '#kirby', message: 'spddl', time: TimeoutSek, msg: 'Timeout für 5 Minuten von: TEST' })
      clientKirby.timeout('#kirby', 'spddl', TimeoutSek, 'Timeout für 5 Minuten von: TEST')
    }, 1000)

    setTimeout(async () => {
      await clientKirby.timeout('#kirby', 'spddl', 1, 'unTimeout')
      console.log('await clientKirby.mod(#kirby, spddl)')
      setTimeout(async () => {
        try {
          await clientKirby.mod('#kirby', 'spddl')
        } catch (error) {
          console.warn(error)
        }
      }, 1000)
    }, 5 * 60 * 1000)
  }

  if (channel && channel === '#spddl' && message === 'mod') {
    clientKirby.mod('#kirby', 'spddl')
  }

  // #spddl, [object Object], asd, false
  // if (config.localhost()) log.debug('chathandle:  ' + channel + ', %j, ' + message + ', ' + self, user)
  // log.debug('chathandle:  ' + channel + ', %j, ' + message + ', ' + self, user)

  // console.log('%j', user)
  // console.log(util.inspect(user, false, null))

  if (!(user['user-type'] === 'mod' || user.username === channel.substr(1) || user.type === 'discord')) {
    // if(user.type == 'discord') { return }
    if (banwordsCheck(channel, message)) {
      console.info('BANWORDS ' + message)
      bot.timeout(channel, user.username, 20, 'BANWORD: ' + message)
      setTimeout(function () {
        console.log('bot.ban(' + channel + ', ' + user.username + ', BANWORD: ' + message + ')')
        bot.ban(channel, user.username, 'BANWORD: ' + message)
      }, 1500)
      return
    }
    if (towordsCheck(channel, message)) {
      console.info('TOWORDS ' + message)
      // bot.timeout(channel, user.username, 20, 'TOWORDS '+message)
      bot.timeout(channel, user.username, 20)
      return
    }
  }

  try {
    if (!(db.settingsprivate[channel.substr(1)].botsettings.ignorecmd.indexOf(message.toLowerCase().split(' ')[0]) === -1)) {
      // console.log('return 1598?!? // Um andere Bots/Befehle zu zulassen', message.toLowerCase().split(' ')[0])
      // 0 | bot | 2019 - 12 - 30T15: 04: 11.816Z - info: [#kirby]<ougizz>: !ruhe
      // 0 | bot | 2019 - 12 - 30T15: 04: 34.253Z - info: [#kirby]<syncd>: ich brauch absofort wieder gute lobbys
      // 0 | bot | 2019 - 12 - 30T15: 04: 38.728Z - info: [#kirby]<syncd>: das hat mir gerade mehr als den rest gegeben
      // 0 | bot | 2019 - 12 - 30T15: 05: 11.400Z - info: [#kirby]<ougizz>: !poits
      // 0 | bot | 2019 - 12 - 30T15: 05: 15.082Z - info: [#kirby]<ougizz>: !points
      // 0 | bot | 2019 - 12 - 30T15: 05: 15.082Z - info: return 1598 ? !? // Um andere Bots/Befehle zu zulassen
      return
    } // Um andere Bots/Befehle zu zulassen
  } catch (e) {
    console.warn(channel + ' ??'); return
  }

  if (message.substr(0, 1) === '#') {
    // if (user.type === 'discord') return // TODO: evtl. per text etwas wieder geben
    if (user.type === 'discord') if (!db.settingsprivate[channel.substr(1)].botsettings.discord.magicconchshell || false) return // TODO: evtl. per text etwas wieder geben (Fehlermeldung)

    if (AntiKappa.isSpam(message, channel.substr(1))) {
      return // console.log('REJECTED: ' + message); // console.log('REJECTED: ' + text + ' '+AntiKappa.isSpam(text, chan.substr(1)).debug)
    } else {
      settings[channel.substr(1)].messageArray.push(message) // console.log('ACCEPTED: ' + message)
    }

    // console.log('%j',user)
    var voicelanguage = (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicelanguage || 'UK English Female')
    if (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.autodetectlanguage || false) if (franc(message.substr(1), { whitelist: ['deu', 'eng'] }) === 'eng') voicelanguage = 'UK English Female'
    // if(db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.autodetectlanguage && (voicelanguage !== "Deutsch Female")) console.log('lang '+voicelanguage);

    if (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.modsonly || false) {
      if (user['user-type'] === 'mod' || user.username === channel.substr(1)) { // if(adminCheck(user.username, channel))
        io.of('/magicconchshell/' + channel.substr(1)).emit('incomingmsg', {
          user: user.username,
          username: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.username && true),
          color: user.color,
          text: message.substr(1),
          emotes: user.emotes,
          lang: voicelanguage,
          volume: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicevolume || 1),
          pitch: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicepitch || 1),
          rate: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicerate || 1),
          type: user.type
        })
        return
      }
    } else {
      io.of('/magicconchshell/' + channel.substr(1)).emit('incomingmsg', {
        user: user.username,
        username: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.username && true),
        color: user.color,
        text: message.substr(1),
        emotes: user.emotes,
        lang: voicelanguage,
        volume: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicevolume || 1),
        pitch: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicepitch || 1),
        rate: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicerate || 1),
        type: user.type
      })
      return
    }
  }

  // BUG: nach einem giveaway werden Commands nicht mehr erkannt
  if (user.username !== 'jtv') {
    // console.log("user.username !== 'jtv'", user.username + ' ' + channel) // Discord weil ich nur Offline Teste und es diesen Channel hier nicht gibt

    // console.log(channel);
    // console.log(settings[channel.substr(1)].giveaway);

    if (settings[channel.substr(1)].giveaway) {
      console.log('giveaway läuft')
      // wenn ein KeyWord verfügbar ist überprüfe es
      if (db.settingsprivate[channel.substr(1)].botsettings.giveaway.keyword) {
        if (db.settingsprivate[channel.substr(1)].botsettings.giveaway.keyword !== message) { return }
        console.log(db.settingsprivate[channel.substr(1)].botsettings.giveaway.keyword + ' !== ' + message)
      }

      console.log('keyword stimmt')

      if (giveawayCheck(user, channel)) {
        console.log('giveawayCheck')
        console.log(settings[channel.substr(1)].giveawaymembers) // nicht im array

        if (_.findIndex(settings[channel.substr(1)].giveawaymembers, { username: user.username }) === -1) {
          if (settings[channel.substr(1)].giveawaymembers.length === 0) { // ist array leer
            console.log('der erste == 0 ' + user.username)
            viewerava(user.username, function (twitchlogo) {
              if (twitchlogo !== null) twitchlogo = twitchlogo.substr(47)
              settings[channel.substr(1)].giveawaymembers.unshift({ color: user.color, 'display-name': user['display-name'], emotes: user.emotes, subscriber: user.subscriber, turbo: user.turbo, 'user-type': user['user-type'], username: user.username, msg: message, logo: twitchlogo })
              io.of('/giveaway/' + channel.substr(1)).emit('incomingmsg', { color: user.color, 'display-name': user['display-name'], emotes: user.emotes, subscriber: user.subscriber, turbo: user.turbo, 'user-type': user['user-type'], username: user.username, msg: message, logo: twitchlogo })
            })
          } else if (_.findIndex(settings[channel.substr(1)].giveawaymembers, { username: user.username }) === -1) { // falls nicht im Array
            console.log('ein weiterer == -1 ' + user.username)
            viewerava(user.username, function (twitchlogo) {
              if (twitchlogo !== null) twitchlogo = twitchlogo.substr(47)
              settings[channel.substr(1)].giveawaymembers.unshift({ color: user.color, 'display-name': user['display-name'], emotes: user.emotes, subscriber: user.subscriber, turbo: user.turbo, 'user-type': user['user-type'], username: user.username, msg: message, logo: twitchlogo })
              io.of('/giveaway/' + channel.substr(1)).emit('incomingmsg', { color: user.color, 'display-name': user['display-name'], emotes: user.emotes, subscriber: user.subscriber, turbov: user.turbo, 'user-type': user['user-type'], username: user.username, msg: message, logo: twitchlogo })
            })
          } else { console.log(user.username + ' kommt nicht (mehr) ins Giveaway') }
        }
      // } else {
        // console.log('giveawayCheck false %j', user)
      }
    }
  }

  if (db.settingsprivate[channel.substr(1)].botsettings.randomreply || false) {
    if (message === 'cookie') {
      if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Great! You jump off bridges when bots tell you to as well?' })
      else bot.say(channel, 'Great! You jump off bridges when bots tell you to as well?', 1)
      return
    }
  }

  // if(message.substr(0,4) == "!ads") { TODO
  //   if(user["user-type"] === "mod" || user.username === channel.substr(1)){
  //     advertising(channel, message, user.username);
  //     return;
  //   }
  // }

  // TODO ALT
  // if(message.substr(0, 1) == "!") {
  //   parseCmd(message.substr(1),channel,user)
  //   return
  // }
  if (user.type !== 'discord' && user.type !== 'steam' && user.type !== 'twitchgroup') {
    if (message.length > 5) { // mehr als 5 Zeichen
      let isSub = false
      if (user.badges) {
        isSub = 'subscriber' in user.badges || 'founder' in user.badges
      }

      if (!(isSub || user['user-type'] === 'mod' || user.username === channel.substr(1))) { // ist kein Admin
        // if (user.type === 'discord' || user.type === 'steam' || user.type === 'twitchgroup') { return } // Testing
        if (!UserCheck(user, channel, 'uppercase')) {
          // var uppercasetext = uppercase(message)
          // var uppercasetext = uppercase(withoutEmotes(message, user.emotes))
          var uppercasetext = uppercase(withoutEmotes(message, user.emotes).replace(/\s+/g, ''))
          if (uppercasetext >= (db.settingsprivate[channel.substr(1)].botsettings.uppercasepercent / 100)) { // 95% Fast alles groß geschrieben
            bot.timeout(channel, user.username, 20, 'TIMEOUT! (Capslock) Erlaubt sind ' + db.settingsprivate[channel.substr(1)].botsettings.uppercasepercent + '% und das waren: ' + (uppercasetext * 100).toFixed(2) + '%')
            setTimeout(function () {
              if (db.settingsprivate[channel.substr(1)].botsettings.wronguppercasemsg && true) {
                bot.say(channel, user.username + ', calm down! Try that again in 20 secs. BloodTrail [Capslock]', 3)
              }
            }, 1500)
            // checkViolations(user.username)
            return
          }
        }

        if (!UserCheck(user, channel, 'symbols')) {
          // var symbolstext = symbols(message)
          var symbolstext = symbols(message.replace(/\s+/g, ''))
          if (symbolstext >= (db.settingsprivate[channel.substr(1)].botsettings.symbolspercent / 100)) { // 55% über die hälfte nur Symbole
            bot.timeout(channel, user.username, 20, 'TIMEOUT! (Symbols) Erlaubt sind ' + db.settingsprivate[channel.substr(1)].botsettings.symbolspercent + '% und das waren: ' + (symbolstext * 100).toFixed(2) + '%')
            setTimeout(function () {
              if (db.settingsprivate[channel.substr(1)].botsettings.wrongsymbolsmsg && true) {
                bot.say(channel, user.username + ', calm down! Try that again in 20 secs. BloodTrail [Symbols]', 3)
              }
            }, 1500)
            // checkViolations(user.username)
            return
          }
        }
      }
    }

    if (!UserCheck(user, channel, 'postingdomains')) {
      if (!scanForLink(message, channel, user)) {
        // console.log(message+', '+channel+', %j',user)

        let isSub = false
        if (user.badges) {
          isSub = 'subscriber' in user.badges || 'founder' in user.badges
        }

        if (!(isSub || user['user-type'] === 'mod' || user.username === channel.substr(1))) {
          // console.log('user.username: '+user.username);
          if (settings[channel.substr(1)].allowing.indexOf(user.username.toLowerCase()) === -1) {
            bot.timeout(channel, user.username, 20, 'Timeout, da ein Link gepostet wurde ohne !permit')
            setTimeout(function () {
              if (db.settingsprivate[channel.substr(1)].botsettings.wronglinkmsg && true) {
                bot.say(channel, 'Ahem! ' + user.username + ', did you ask for permission to post that link?', 3)
              }
            }, 1500)
            // checkViolations(user.username)
          }
          return
        }
      }
    }
  }

  if ((message.toLowerCase().match('spddl_bot') !== null) && user.username === 'spddl') { bot.say(channel, (Math.random() < 0.5) ? 'Hey spddl! (✌ﾟ∀ﾟ)☞ ' : 'Hey spddl! ༼ つ ◕_◕ ༽つ'); return }

  textScan(message, channel, user.username, user) // damit der Bot auch auf "bot" reagiert
  permissioncheck(message, user, channel)
}

const AntiKappa = {
  // CHANGE SETTINGS HERE
  /* r9kModeBool: true, //personal twitch r9k
    blockExclusiveUpperCaseBool: true, //removes exclusive caps lock
    blockMostlyUpperCaseBool: true, //blocks messages with mostly caps lock
    blockVeryLongMessagesBool: true, //removes long messages which usually contains repetitive copy pastes
    blockRepeatedWordInSentenceBool: true, //removes repeated words, like "Kappa Kappa Kappa"
    blockTypicalSpamBool: true, //removes suspected random spam
    blockNonEnglishCharactersBool: true, //blocks everything that isn't the standard ASCII character set
    */ // CHANGE SETTINGS HERE

  // messageArray: [],
  longMessageCountInt: 140,
  mostlyUpperCaseTheshholdPercentage: 70,
  repeatedWordInSentenceCountInt: 3,
  typicalSpamStringArray: [ // will block the sentence if it contains any of these words, and you have "blockTypicalSpamBool" set to true
    'gachi', 'feelsgoodman', 'feelsbadman', 'kkona'
  ]
}

AntiKappa.isSpam = function (text, chan) {
  // console.log('AntiKappa.isSpam chan '+chan);
  if (text === '') {
    io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: empty' })
    console.log('/magicconchshell/' + chan + '  Reason for removal: empty')
    return true
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockVeryLongMessagesBool || false) {
    if (text.length > AntiKappa.longMessageCountInt) {
      io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: VeryLong' })
      console.log('/magicconchshell/' + chan + '  Reason for removal: VeryLong')
      return true
    }
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockMostlyUpperCaseBool || false) {
    if (AntiKappa.isMostlyUpperCase(text)) {
      io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: MostlyUpperCase' })
      console.log('/magicconchshell/' + chan + '  Reason for removal: MostlyUpperCase')
      return true
    }
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockExclusiveUpperCaseBool || false) {
    if (text === text.toUpperCase()) {
      io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: ExclusiveUpperCase' })
      console.log('/magicconchshell/' + chan + '  Reason for removal: ExclusiveUpperCase')
      return true
    }
  }

  if ((db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockRepeatedWordInSentenceBool || false) && AntiKappa.isRepeatedWordInSentence(text)) {
    io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: RepeatedWordInSentenc' })
    console.log('/magicconchshell/' + chan + '  Reason for removal: RepeatedWordInSentenc')
    return true
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockTypicalSpamBool || false) {
    for (var i = 0; i < AntiKappa.typicalSpamStringArray.length - 1; i++) {
      var entry = AntiKappa.typicalSpamStringArray[i].toUpperCase()
      var compare = text.toUpperCase()
      if (compare.indexOf(entry) > -1) {
        io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: TypicalSpam' })
        console.log('/magicconchshell/' + chan + '  Reason for removal: TypicalSpam')
        return true
      }
    }
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.r9kModeBool || false) {
    if (db.settings[chan].messageArray.indexOf(text) > -1) { // if(AntiKappa.messageArray.indexOf(text) > -1){
      io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: r9kMode' })
      console.log('/magicconchshell/' + chan + '  Reason for removal: r9kMode')
      return true
    }
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockNonEnglishCharactersBool || false) {
    if (AntiKappa.isNonEnglishCharacter(text)) {
      console.log('/magicconchshell/' + chan)
      io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: NonEnglishCharacter' })
      console.log('/magicconchshell/' + chan + '  Reason for removal: NonEnglishCharacter')
      return true
    }
  }
  return false
  // return {r: false, debug: ""}
}

AntiKappa.isRepeatedWordInSentence = function (text) {
  const sortedStringArray = text.split('  ').sort()
  let duplicatesStringArray = []
  for (var i = 0; i < sortedStringArray.length - 1; i++) {
    if (sortedStringArray[i + 1] === sortedStringArray[i] && sortedStringArray[i].length > 3) { // dont take short words like "at", "a", "or" etc because they can be repeated a lot but are not spam per say
      duplicatesStringArray.push(sortedStringArray[i])
    }
  }

  duplicatesStringArray = duplicatesStringArray.filter(Boolean)
  return duplicatesStringArray.length >= AntiKappa.repeatedWordInSentenceCountInt
}

AntiKappa.isMostlyUpperCase = function (text) {
  const textLength = text.length
  let amountUpperCaseInt = 0
  for (var i = 0, len = textLength; i < len; i++) {
    var char = text[i]
    if (char === char.toUpperCase()) {
      amountUpperCaseInt++
    }
  }

  const percentageUpperCase = 100 - (textLength - amountUpperCaseInt) / textLength * 100

  return percentageUpperCase >= AntiKappa.mostlyUpperCaseTheshholdPercentage
}

AntiKappa.isNonEnglishCharacter = function (text) {
  const regex = /[^\u00-\u7F]+/
  // var regex = /[^\u0000-\u007F]+/
  return regex.test(text)
}


// Handle on connect event
client.on('connected', function (address, port) {
  log.notice('*** Bot Connected ***')
  if (!config.localhost()) {
    if (start) { // nur beim "echten Restart" anzeigen
      bot.whisper('spddl', '*** B0t Connected *** ' + utc)
      // bot.whisper('spddl','*** B0t Connected *** '+address+':'+port+' - '+utc)
      // bot.say('#spddl_bot','*** B0t Connected *** '+utc,1)
    }
  }
})

// @ import './twitch/api/GroupUserChatters.js'

function UserCheck (user, channel, type) {
  // ERROR CHECK
  if (config.localhost()) {
    // if (user.type == "twitch") {
    if (!(user.subscriber === true || user.subscriber === false)) { console.warn('user.subscriber, is NOT Boolean') }
    if (!(user.turbo === true || user.turbo === false)) { console.warn('user.turbo, is NOT Boolean') }
    // }
  }

  try { // True Darf das Limit überschreiten
    if (user.subscriber && (db.settingsprivate[channel.substr(1)].botsettings[type].indexOf('sub') !== -1)) return true
    if (user.turbo && (db.settingsprivate[channel.substr(1)].botsettings[type].indexOf('tur') !== -1)) return true
    if (db.settingsprivate[channel.substr(1)].botsettings[type].indexOf('vie') !== -1) return true
    return false
  } catch (e) { // jeder der das nicht definiert hat
    // console.warn(e.message);
    // console.log(channel+' - '+type+', %j',user);
    return false
  }
}


function giveawayCheck (user, channel) {
  // console.log('giveawayCheck('+user.username+', '+channel+')');
  if (!db.settingsprivate[channel.substr(1)].botsettings.giveaway.host === true || false) if (user.username === channel.substr(1)) return false
  if (!db.settingsprivate[channel.substr(1)].botsettings.giveaway.mod === true && true) if (user['user-type'] === 'mod') return false
  if (!db.settingsprivate[channel.substr(1)].botsettings.giveaway.subscriber === true && true) if (user.subscriber === 1) return false
  if (!db.settingsprivate[channel.substr(1)].botsettings.giveaway.turbo === true && true) if (user.turbo === 1) return false
  if (db.settingsprivate[channel.substr(1)].botsettings.giveaway.viewer === true && true) return true
  else return false
}


function viewerava (name, callback) { // TODO gehört zum Giveaway Array
  requestjson.createClient('https://api.twitch.tv/kraken/channels/').get(name, { headers: { 'Client-ID': ClientID } }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      if (!body.logo) callback(null) //  if (!body.logo) callback('http://bot.spddl.de/giveaway/404_user.png')
      else callback(body.logo)
    }
  })
}


// @ import './twitch/counter.js'

function followeralert (user, onstart) {
  // console.log('followeralert('+user+', '+onstart+')')
  if (onstart) {
    requestjson.createClient('https://api.twitch.tv/kraken/channels/').get(user + '/follows?limit=100&direction=desc', { headers: { Accept: 'application/vnd.twitchtv.v3+json', 'Client-ID': ClientID } }, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        if (body.follows && body.follows.length) {
          for (var i = 0; i < body.follows.length; i++) { // for (var n = [], i = 0; i < body.follows.length; i++) {
            db.settings[user].follows.indexOf(body.follows[i].user._id) === -1 && (db.settings[user].follows.push(body.follows[i].user._id))
          }
        }
      }
    })
  } else {
    requestjson.createClient('https://api.twitch.tv/kraken/channels/').get(user + '/follows?limit=25&direction=desc', { headers: { Accept: 'application/vnd.twitchtv.v3+json', 'Client-ID': ClientID } }, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        if (body.follows && body.follows.length) {
          const temparr = []
          for (let n = [], i = 0; i < body.follows.length; i++) {
            db.settings[user].follows.indexOf(body.follows[i].user._id) === -1 && (n.push({ // eslint-disable-line no-unused-expressions
              created_at: moment(body.follows[i].created_at).utc().format('YYYY-MM-DD HH:mm:ss'),
              id: body.follows[i].user._id,
              name: body.follows[i].user.display_name
            }), temparr.push(body.follows[i].user._id))
          }
          // n.length && (console.info('emitting [' + user + '] ' + n.length + ' follows | ' + _.last(n).name + ' ' + _.last(n).created_at), db.settings[user].follows = temparr.concat(db.settings[user].follows).splice(0, 100), (!db.settingsprivate[user].botsettings.tipeeestream ? Alertprocess('fol', user, n, null) : null))
          if (n.length) {
            console.info('emitting [' + user + '] ' + n.length + ' follows | ' + _.last(n).name + ' ' + _.last(n).created_at)
            db.settings[user].follows = temparr.concat(db.settings[user].follows).splice(0, 100)

            if (!db.settingsprivate[user].botsettings.tipeeestream) {
              Alertprocess('fol', user, n, null)
            }
          }
        }
      }
    })
  }
}


function banwordsCheck (channel, words) {
  // console.log('banwordsCheck('+channel+', '+words+')')
  if (db.settingsprivate[channel.substr(1)].botsettings.banwords.length === 0) return false
  //  console.info('.length !== 0 '+commands[channel.substr(1)].botsettings.banwords.length)
  //  console.info('banwordsCheck: '+channel+', '+words.toLowerCase())
  words = ' ' + words + ' ' // TODO work-a-round eignetlich muss ich die Trim funktion auf der Webseite umgehen
  for (var i = 0; i < db.settingsprivate[channel.substr(1)].botsettings.banwords.length; ++i) { // Admins überprüfen
    // console.info('[i] '+i)
    // console.info('banwords[i] '+commands[channel.substr(1)].botsettings.banwords[i].toLowerCase())

    if (words.toLowerCase().indexOf(db.settingsprivate[channel.substr(1)].botsettings.banwords[i].toLowerCase()) !== -1) {
      // console.info('banwordsCheck gefunden: '+channel+' '+words)
      return true
    }
  }
  // console.info('banwordsCheck nicht gefunden '+channel+' '+words)
  return false
}


function towordsCheck (channel, words) {
  if (db.settingsprivate[channel.substr(1)].botsettings.towords.length === 0) return false
  words = ' ' + words + ' '
  for (var i = 0; i < db.settingsprivate[channel.substr(1)].botsettings.towords.length; ++i) { // Admins überprüfen
    if (words.toLowerCase().indexOf(db.settingsprivate[channel.substr(1)].botsettings.towords[i].toLowerCase()) !== -1) {
      // console.info('banwordsCheck gefunden: '+channel+' '+words)
      return true
    }
  }
  // console.info('banwordsCheck nicht gefunden '+channel+' '+words)
  return false
}


function uppercase (string) {
  var chars = string.length
  var uLet = string.match(/[A-Z]/g)
  if (uLet !== null) {
    return (uLet.length / chars)
  }
  return 0
}


function symbols (string) {
  var count = 0
  for (var i = 0; i < string.length; i++) {
    var charCode = string.substring(i, i + 1).charCodeAt(0)
    //                          ß                   ä                   Ä                  ü                   Ü                    ö                   Ö
    //         (!(charCode === 223 || charCode === 228 || charCode === 196 || charCode === 252 || charCode === 220 || charCode === 246 || charCode === 214))
    if (!(charCode === 223 || charCode === 228 || charCode === 196 || charCode === 252 || charCode === 220 || charCode === 246 || charCode === 214)) { // wird ignoriert
      if ((charCode <= 30 || charCode >= 127) || charCode === 65533) {
        // console.log(charCode+' '+string.substring(i, i+1)+' trigger')
        count++
      }
    }
  }
  return Math.ceil((count / string.length) * 100) / 100
}


function textScan (text, channel, from, user) {
  for (var i = 0; i < settings.botNick.length; i++) {
    var nameCheck = text.toLowerCase().match(settings.botNick[i])
    if (nameCheck !== null) {
      getRandomReply('misc', channel, from, user)
      return
    }
  }
  // swearCheck(text, channel, from);
}


function scanForLink (text, chan, user) {
  if (user.type === 'discord') { return true }
  // console.log('scanForLink: %j',user);

  // if ('spddl' == user.username) {
  if (user.username === 'faceit_gg') { // "FACEIT_GG" started playing a csgo match on FACEIT. Match:
    return true
  }
  // const re = /([a-z0-9_-]+\.)+[a-z]{2,4}\/[^ ]*|(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\s|^)((https?:\/\/|www\.)+[a-z0-9_.\/?=&-]+)/gi
  const re = /([a-z0-9_-]+\.)+[a-z]{2,4}\/[^ ]*|(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])|(\s|^)((https?:\/\/|www\.)+[a-z0-9_./?=&-]+)/gi
  // var re = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  // var re = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|coop|de|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|tv|local|internal|xxx|me))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@\/?]*)?)(\s+|$)/gi;
  // console.info('text.match(re) '+text.match(re));
  if (text.match(re) !== null) {
    if (db.settingsprivate[chan.substr(1)].botsettings.youtubetowhisper && true) {
      if ((text.toLowerCase().indexOf('youtube.com') >= 0) || (text.toLowerCase().indexOf('youtu.be') >= 0)) {
        if (user.type !== 'discord') youtubetowhisper(text, chan)
      }
    }

    var array = db.settingsprivate[chan.substr(1)].botsettings.alloweddomains || []
    var len = array.length
    for (var i = 0; i < array.length; i++) {
      if (text.indexOf(array[i]) !== -1) {
        // console.info(text + ' [Link OK]')
        return true
      }
      if (i === len) {
        console.warn(text + ' [TIMEOUT]')
        return false
      }
    }
  } else {
    return true
  }
}


function youtubetowhisper (text, chan) {
  // console.log('youtubetowhisper('+text+', '+chan+')');
  var id
  if (text.indexOf('?v=') !== -1) {
    id = text.substr(text.indexOf('?v=') + 3) // bis zum ? / &
  } else {
    id = text.substr(text.indexOf('youtu.be/') + 9) // bis zum ? / &
    id = id.split('?')
    id = id[0]
  }

  id = id.split(' ')
  id = id[0]

  // console.info('yt '+chan+', '+text+', '+id)
  request({ url: 'https://www.googleapis.com/youtube/v3/videos?key=' + config.youtubekey + '&part=snippet&id=' + id, json: true }, function (err, res, body) {
    if (err !== null) { console.emergency('youtubetowhisper err: ' + err) }
    if (body !== undefined) { // Steam API Down?
      try {
        if (body.items && body.items[0] === undefined) { console.warn('body.items[0] === undefined'); return }
        bot.whisper(chan.substr(1), body.items[0].snippet.title)
      } catch (e) {
        console.warn('yt ' + chan + ', ' + text + ',   https://www.googleapis.com/youtube/v3/videos?key=' + config.youtubekey + '&part=snippet&id=' + id)
        console.warn(e)
      }
    } else {
      console.log('yt API is down.')
    }
  })
}


function getRandomReply (type, channel, from, user) {
  // console.info('getRandomReply('+type+', '+channel+', '+from)
  if (db.settingsprivate[channel.substr(1)].botsettings.randomreply || false) {
    // console.info("sending "+type+" message to "+channel);
    var message = ''
    if (type === 'swear') {
      message = settings.backtalk[Math.floor(Math.random() * settings.backtalk.length)]
      //       checkViolations(from);
    } else if (type === 'misc') {
      message = settings.quotes[Math.floor(Math.random() * settings.quotes.length)]
    }
    message = message.replace('{NICK}', from)
    if (from === 'Steam') steamSay(channel, message)
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: message })
    else bot.say(channel, message, 2)
  }
}


// @ import './twitch/steamstatus.js'

// @ import './twitch/market.js'

// @ import './twitch/knife.js'

// @ import './twitch/isJson.js'

// @ import './twitch/esea.js'

// @ import './twitch/lastesea.js'

// @ import './twitch/giveaway.js'

// @ import './twitch/TwitchPost.js'

function cb (chan, id, time, msg) { // http://crontab.guru/
  console.info('CronJob ' + chan + ', ' + id + ', ' + time + ', ' + msg)
  var chanID = chan + id
  // console.log('\"Seconds: 0-59\" \"Minutes: 0-59\" \"Hours: 0-23\" \"Day of Month: 1-31\" \"Months: 0-11\" \"Day of Week: 0-6\"')

  global[chanID] = new CronJob('0 ' + time, function () {
    // if (settings[chan].online.status === true) {
    if (settings[chan].online.status || settings[chan].online.OnCount !== 0) {
      bot.say('#' + chan, msg)
    }
  }, null, true, 'Europe/Berlin')
}


// @ import './twitch/cbstop.js'

// @ import './twitch/advertising.js'

// @ import './twitch/addcommand.js'

// @ import './twitch/deletecommand.js'

// @ import './twitch/addmod.js'

// @ import './twitch/delmod.js'

// @ import './twitch/adddomain.js'

// @ import './twitch/deldomain.js'

// @ import './twitch/addignorecmd.js'

// @ import './twitch/delignorecmd.js'

// @ import './twitch/addbanwords.js'

// @ import './twitch/delbanwords.js'

// @ import './twitch/addtowords.js'

// @ import './twitch/deltowords.js'

// @ import './twitch/addcounter.js'

// @ import './twitch/delcounter.js'

function channelonline () {
  let temparr = _.shuffle(settings.channels)
  const tempIsLive = []
  requestjson.createClient('https://api.twitch.tv/helix/').get('streams?user_login=' + JSON.stringify(temparr.join('&user_login=')).replace(/(#|"|\[|\])/g, ''), { headers: { 'Client-ID': ClientID, Authorization: `Bearer ${global.oauth}` } }, function (err, res, body) { // hole mir die Aktuellen Daten aus der Steam API
    if (err) { console.warn('channelonline', err); return }
    if ((body !== undefined) && (res.statusCode === 200)) { // twitch API Down?
      for (let i = 0, len = body.data.length; i < len; i++) { // Check wer alles Online ist
        const player = body.data[i].user_name.toLowerCase() // ohne #
        if (!settings[player].online.status) {
          if (settings[player].online.OnCount < settings[player].online.minOnlineCount) {
            settings[player].online.OnCount++
            console.log(`player ${player} OnCount: ${settings[player].online.OnCount}, OffCount: ${settings[player].online.OffCount}`)
            settings[player].online.OffCount = 0
          }
          if (settings[player].online.OnCount >= settings[player].online.minOnlineCount) {
            settings[player].online.status = true
            settings[player].online.OnCount = 0
            settings[player].online.OffCount = 0
            /* // TODO: online msg

            */
            if (start) {
              log.separator(' ' + player + ' is Online ', 'notice')

              // Warteschlange Kirby
              if (player === 'kirby') {
                cmd.warteschlange_clear(player)
              }

              // STEAM
              if (db.settingsprivate[player].botsettings.automaticannouncements || false) {
                steamStart({ username: 'AutomaticAnnouncements_' + player, channel: player }, '')
              }

              // DISCORD
              // console.log(`db.settingsprivate[${player}].botsettings.discord.onlinemsg ${db.settingsprivate[player].botsettings.discord.onlinemsg}`)
              if (db.settingsprivate[player].botsettings.discord.onlinemsg || false) {
                if (db.settingsprivate[player].botsettings.discord.onlinemsg) {
                  dc.sendMessage({ to: db.settingsprivate[player].botsettings.discord.onlinemsg, message: db.settingsprivate[player].botsettings.discord.online })
                } else {
                  dc.sendMessage({ to: db.settingsprivate[player].botsettings.discord.onlinemsg, message: '`[' + player + ' ist Online]` https://www.twitch.tv/' + player })
                }
              }
              console.log('CO', settings[player].online)
            } else {
              // console.log(util.inspect(settings[player].online, false, null, true))
              if (!settings[player].online.status) {
                log.notice(player + ' ist Online')
              }
            }
            // tempIsLive.push(player)
          }
        }
        tempIsLive.push(player)
        temparr = temparr.filter(function (e) { return e !== '#' + player }) // löscht die die Online sind
      }

      // alle die Live sind für Discord
      if (tempIsLive.length) {
        if (tempIsLive.length === 1) dc.setPresence({ idle_since: Date.now(), game: { name: String(tempIsLive), type: 1, url: 'https://www.twitch.tv/' + tempIsLive[0] } })
        else dc.setPresence({ idle_since: Date.now(), game: { name: String(tempIsLive), type: 1, url: 'http://www.multitwitch.tv/' + tempIsLive.join('/') } }) // dont work :/
        dc.setPresence({ idle_since: Date.now(), game: { name: String(tempIsLive), type: 1, url: 'https://www.twitch.tv/' + tempIsLive[0] } }) // https://izy521.gitbooks.io/discord-io/content/Methods/Client.html
      } else {
        dc.setPresence({ game: null })
      }

      for (let i = 0, len = temparr.length; i < len; i++) { // Check wer alles Offline ist
        const player = temparr[i].substr(1)

        if (settings[player].online.status) {
          if (settings[player].online.OffCount < settings[player].online.minOfflineCount) {
            settings[player].online.OffCount++
            console.log('player ' + player + ' OffCount: ' + settings[player].online.OffCount + ', OnCount: ' + settings[player].online.OnCount)
            settings[player].online.OnCount = 0
          }
          if (settings[player].online.OffCount >= settings[player].online.minOfflineCount) {
            settings[player].online.status = false
            settings[player].online.OffCount = 0
            settings[player].online.OnCount = 0
            /* // TODO: offline msg

            */
            log.separator(' ' + player + ' ist OFFLINE ', 'notice')

            // DISCORD
            console.log('db.settingsprivate[' + player + '].botsettings.discord.onlinemsg', db.settingsprivate[player].botsettings.discord.onlinemsg)
            if (db.settingsprivate[player].botsettings.discord.onlinemsg || false) {
              dc.sendMessage({ to: db.settingsprivate[player].botsettings.discord.onlinemsg, message: db.settingsprivate[player].botsettings.discord.offline })
            } else {
              dc.sendMessage({ to: db.settingsprivate[player].botsettings.discord.onlinemsg, message: '`[' + player + ' ist Offline]`' })
            }
            console.log('CO', settings[player].online)
          }
        }
      }
    }
    // console.log(settings)
    // console.log(util.inspect(settings, false, null, true))
  })
}

setInterval(() => { channelonline() }, 30000) // 1min
channelonline()

const KirbyCommunityChannel = {}
function CommunityChannelOnline () {
  // kirby.botsettings.CommunityStreams
  if (!db.settingsprivate.kirby.botsettings.CommunityStreams) { return }
  const channels = db.settingsprivate.kirby.botsettings.CommunityStreams.split(',') || []
  let temparr = _.shuffle(channels)

  for (let i = 0, len = channels.length; i < len; i++) {
    if (!KirbyCommunityChannel[channels[i]]) {
      KirbyCommunityChannel[channels[i]] = {
        status: false,
        OnCount: 0,
        minOnlineCount: 5,
        OffCount: 0,
        minOfflineCount: 5
      }
    }
  }
  // console.log('KirbyCommunityChannel', temparr)

  const tempIsLive = []
  // curl -H 'Client-ID: ' -X GET 'https://api.twitch.tv/helix/streams?user_login=kirby'
  // curl -H 'Client-ID: ' -X GET 'https://api.twitch.tv/helix/streams?user_login=kirby&user_login=lirik'
  // https://api.twitch.tv/helix/streams?client_id=&user_login=kirby

  //  , Authorization: `Bearer ${global.oauth}`
  // , Authorization:
  requestjson.createClient('https://api.twitch.tv/helix/').get('streams?user_login=' + temparr.join('&user_login='), { headers: { 'Client-ID': ClientID, Authorization: `Bearer ${global.oauth}` } }, function (err, res, body) { // hole mir die Aktuellen Daten aus der Steam API
    if (err) { console.warn('CommunityChannelOnline', err); return }
    if ((body !== undefined) && (res.statusCode === 200)) { // twitch API Down?
      for (let i = 0, len = body.data.length; i < len; i++) { // Check wer alles Online ist
        const player = body.data[i].user_name.toLowerCase() // ohne #

        if (!KirbyCommunityChannel[player]) {
          KirbyCommunityChannel[player] = {
            status: false,
            OnCount: 0,
            minOnlineCount: 5,
            OffCount: 0,
            minOfflineCount: 5
          }
        }

        if (!KirbyCommunityChannel[player].status) {
          if (KirbyCommunityChannel[player].OnCount < KirbyCommunityChannel[player].minOnlineCount) {
            KirbyCommunityChannel[player].OnCount++
            console.log('player ' + player + ' OnCount: ' + KirbyCommunityChannel[player].OnCount + ', OffCount: ' + KirbyCommunityChannel[player].OffCount)
            KirbyCommunityChannel[player].OffCount = 0
          }
          if (KirbyCommunityChannel[player].OnCount >= KirbyCommunityChannel[player].minOnlineCount) {
            KirbyCommunityChannel[player].status = true
            KirbyCommunityChannel[player].OnCount = 0
            KirbyCommunityChannel[player].OffCount = 0

            if (start) {
              log.separator('Community: ' + player + ' is Online ', 'notice')
              // DISCORD
              dc.sendMessage({ to: '479934273458143242', message: '`[' + player + ' ist Online]` https://www.twitch.tv/' + player })

              // console.log(settings)
            } else {
              // console.log(util.inspect(KirbyCommunityChannel[player].online, false, null, true))
              // if (!KirbyCommunityChannel[player].status) {
              log.notice('Community' + player + ' ist Online')
              // }
            }
          }
        }
        tempIsLive.push(player)
        temparr = temparr.filter(function (e) { return e !== player }) // löscht die die Online sind
      }

      for (let i = 0, len = temparr.length; i < len; i++) { // Check wer alles Offline ist
        const player = temparr[i] // .substr(1) // mit #
        if (KirbyCommunityChannel[player].status) {
          if (KirbyCommunityChannel[player].OffCount < KirbyCommunityChannel[player].minOfflineCount) {
            KirbyCommunityChannel[player].OffCount++
            console.log('player ' + player + ' OffCount: ' + KirbyCommunityChannel[player].OffCount + ', OnCount: ' + KirbyCommunityChannel[player].OnCount)
            KirbyCommunityChannel[player].OnCount = 0
          }
          if (KirbyCommunityChannel[player].OffCount >= KirbyCommunityChannel[player].minOfflineCount) {
            KirbyCommunityChannel[player].status = false
            KirbyCommunityChannel[player].OffCount = 0
            KirbyCommunityChannel[player].OnCount = 0
            log.separator('Community: ' + player + ' ist OFFLINE ', 'notice')
            // console.log(settings)
          }
        }
      }
    } else { // TODO name ist falsch und wird gelöscht
      try {
        console.log('CommunityChannelOnline', 'https://api.twitch.tv/helix/streams?user_login=' + temparr.join(','))
        console.warn('res.statusCode', res.statusCode)
        console.warn('headers', { 'Client-ID': ClientID, Authorization: `Bearer ${global.oauth}` })
        console.warn('body', body)
        console.warn('err', err)
      } catch (e) {
        console.log(e)
      }
    }
  })
}

setInterval(() => { CommunityChannelOnline() }, 38400)
CommunityChannelOnline()

// @ import './twitch/getStatus.js'

// @ import './twitch/notification.js'

setInterval(() => { io.of('/follower/demo').emit('incomingmsg', { created_at: +new Date(), id: 9999, name: Math.random().toString(36).replace(/[^a-z]+/g, '') }) }, 10000) // 10sek
setInterval(() => { io.of('/subscriber/demo').emit('incomingmsg', { texttext: Math.random().toString(36).replace(/[^a-z]+/g, ''), lang: 'Deutsch Female' }) }, 12000) // 12sek
setInterval(() => { io.of('/submit/demo').emit('incomingmsg', { user: Math.random().toString(36).replace(/[^a-z]+/g, ''), text: Math.random().toString(36).replace(/[^a-z]+/g, '') + ' 1234-5678-9012-3456', lang: 'Deutsch Female' }) }, 9000) // 9sek
setInterval(() => { io.of('/magicconchshell/demo').emit('incomingmsg', { user: Math.random().toString(36).replace(/[^a-z]+/g, ''), text: 'Lorem Kappa ipsum dolor sit amet, consectetuer adipiscing bleedPurple duDudu KappaRoss elit. Aenean commodo ligula eget dolor. Aenean massa.', emotes: { 25: ['7-11'], 62834: ['71-76'], 62835: ['59-69'], 70433: ['78-86'] }, lang: 'Deutsch Female', volume: 1, pitch: 1, rate: 1 }) }, 10000) // 10sek // "emote":{"25":["7-11"],"62834":["71-76"],"62835":["59-69"],"70433":["78-86"]} // "emotes":"62835:59-69/25:7-11/62834:71-76/70433:78-86"

const TwitchRealtime = require('twitch-realtime') // https://docs.fuechschen.org/twitch-realtime/TwitchRealtime.html

// TODO:
// channels: config.localhost() ? (localhostobj.twitch ? ['#spddl_bot', '#spddl'] : []) : db.settings.channels // botchannels TODO:
const TwitchRealtimeOptions = { // https://dev.twitch.tv/docs/pubsub
  // defaultTopics: db.settings.channels.map(chan => `video-playback.${chan.substr(1)}`)
  defaultTopics: db.settings.channels.map(chan => `video-playback.${chan.substr(1)}`).concat(db.settingsprivate.kirby.botsettings.CommunityStreams.split(',').map(chan => `video-playback.${chan}`))
}
let TRT = new TwitchRealtime(TwitchRealtimeOptions)

TRT.on('connect', () => {
  // TODO: topicCount
  console.log(new Date().toJSON(), 'connect')
})

TRT.on('stream-down', data => {
  const chan = data.channel
  if (db.settings.channels.indexOf(`#${chan}`) !== -1) {
    log.separator(` ${chan} ist OFFLINE (TRT)`, 'notice')
    settings[chan].online.status = false
    settings[chan].online.OffCount = 0
    settings[chan].online.OnCount = 0

    // DISCORD
    console.log(`db.settingsprivate[${chan}].botsettings.discord.onlinemsg`, db.settingsprivate[chan].botsettings.discord.onlinemsg)
    if (db.settingsprivate[chan].botsettings.discord.onlinemsg || false) {
      dc.sendMessage({ to: db.settingsprivate[chan].botsettings.discord.onlinemsg, message: db.settingsprivate[chan].botsettings.discord.offline })
    } else {
      dc.sendMessage({ to: db.settingsprivate[chan].botsettings.discord.onlinemsg, message: '`[' + chan + ' ist Offline]`' })
    }
  } else if (db.settingsprivate.kirby.botsettings.CommunityStreams.split(',').indexOf(chan) !== -1) {
    log.separator(` Community: ${chan} is OFFLINE (TRT) `, 'notice')
    KirbyCommunityChannel[chan].status = false
    KirbyCommunityChannel[chan].OffCount = 0
    KirbyCommunityChannel[chan].OnCount = 0
  } else {
    console.warn('unbekannter Channel')
  }
  // if (settings[chan]) {
  //   console.log('TRT', settings[chan])
  // } else if (KirbyCommunityChannel[chan]) {
  //   console.log('TRT', KirbyCommunityChannel[chan])
  // }
})

TRT.on('stream-up', data => {
  // console.log(new Date().toJSON(), 'stream-up', data)
  const chan = data.channel
  if (db.settings.channels.indexOf(`#${chan}`) !== -1) {
    settings[chan].online.status = true
    settings[chan].online.OnCount = 0
    settings[chan].online.OffCount = 0

    if (start) {
      log.separator(` ${chan} is Online (TRT) `, 'notice')

      // Warteschlange Kirby
      if (chan === 'kirby') {
        cmd.warteschlange_clear(chan)
      }

      // STEAM
      if (db.settingsprivate[chan].botsettings.automaticannouncements || false) {
        steamStart({ username: 'AutomaticAnnouncements_' + chan, channel: chan }, '')
      }

      // DISCORD
      // console.log(`db.settingsprivate[${chan}].botsettings.discord.onlinemsg ${db.settingsprivate[chan].botsettings.discord.onlinemsg}`)
      if (db.settingsprivate[chan].botsettings.discord.onlinemsg || false) {
        if (db.settingsprivate[chan].botsettings.discord.onlinemsg) {
          dc.sendMessage({ to: db.settingsprivate[chan].botsettings.discord.onlinemsg, message: db.settingsprivate[chan].botsettings.discord.online })
        } else {
          dc.sendMessage({ to: db.settingsprivate[chan].botsettings.discord.onlinemsg, message: '`[' + chan + ' ist Online]` https://www.twitch.tv/' + chan })
        }
      }
    } else {
      log.notice(` ${chan} is Online (TRT) `)
    }
  } else if (db.settingsprivate.kirby.botsettings.CommunityStreams.split(',').indexOf(chan) !== -1) {
    KirbyCommunityChannel[chan].status = true
    KirbyCommunityChannel[chan].OnCount = 0
    KirbyCommunityChannel[chan].OffCount = 0
    if (start) {
      log.separator(` Community: ${chan} is Online (TRT) `, 'notice')
      // DISCORD
      dc.sendMessage({ to: '479934273458143242', message: '`[' + chan + ' ist Online]` https://www.twitch.tv/' + chan })
    } else {
      log.notice(' Community' + chan + ' ist Online (TRT) ')
    }
  } else {
    console.warn('unbekannter Channel (TRT)')
  }
  if (settings[chan]) {
    console.log('TRT', settings[chan])
  } else if (KirbyCommunityChannel[chan]) {
    console.log('TRT', KirbyCommunityChannel[chan])
  }
})
// TRT.on('viewcount', data => { console.log(new Date().toJSON(), 'viewcount', data) }) //  viewcount { time: 1577307422.873425, channel: 'schulzew', viewers: 0 }
TRT.on('warn', data => { console.log(new Date().toJSON(), 'warn', data) })
TRT.on('whisper', data => { console.log(new Date().toJSON(), 'whisper', data) })
TRT.on('bits', data => { console.log(new Date().toJSON(), 'bits', data) })
TRT.on('close', data => { console.log(new Date().toJSON(), 'close', data) })
TRT.on('debug', data => { console.log(new Date().toJSON(), 'debug', data) })
TRT.on('raw', data => {
  // console.log(new Date().toJSON(), 'raw', data)
  // if (data.type !== 'PONG') {
  //   if (data.type === 'MESSAGE' && (data.data.message.indexOf('{"type":"viewcount",') === 0 || data.data.message.indexOf('{"type":"commercial",') === 0)) {
  //     // ignore
  //   } else {
  //     console.log(new Date().toJSON(), 'TwitchRealtime', data)
  //   }
  // }
})

const readyState = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']
// if (!config.localhost() || localhostobj.steam) {
setInterval(() => {
  if (TRT._ws.readyState !== 1) {
    console.warn('TRT._ws.readyState', readyState[TRT._ws.readyState]) // https://developer.mozilla.org/de/docs/Web/API/WebSocket/readyState
    TRT = new TwitchRealtime(TwitchRealtimeOptions)
  }
}, 1000 * 60 * 30) // 30min
// }

// setTimeout(async () => {
//   console.log('readyState', TRT._ws.readyState)
//   if (TRT._ws.readyState === 1) { // https://developer.mozilla.org/de/docs/Web/API/WebSocket/readyState
//     await TRT.listen('video-playback.gronkh')
//     // await TRT.unlisten
//   }
// }, 250)


// //////////////////////////////////////////////////////////////////////////////
// @twitch ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @twitchKirby start
// //////////////////////////////////////////////////////////////////////////////
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

// //////////////////////////////////////////////////////////////////////////////
// @twitchKirby ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @backup start
// //////////////////////////////////////////////////////////////////////////////
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

// //////////////////////////////////////////////////////////////////////////////
// @backup ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @socket start
// //////////////////////////////////////////////////////////////////////////////
/* eslint no-undef: 0 */
let io

if (config.localhost()) io = socket.listen(httpserver)
else io = socket.listen(httpsserver)

io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next)
})
io.sockets.on('connection', function (socket) {
  try {
    // console.log('socket.request.session.passport.user', socket.request.session.passport.user)
    // console.log('socket.request.session.passport', socket.request.session.passport)
    // console.log('socket.request.session', socket.request.session)
    // console.log('socket.request', socket.request)
    if (socket.request.session.passport) {
      log.separator('Socket.io Login: ' + socket.request.session.passport.user.login, 'info')
    } else {
      // log.separator('Socket.io ID/NS: ' + socket.nsp, 'info') // D/NS: [object Object]---
      log.separator('Socket.io ID/NS: %j', socket.nsp, 'info')
    }
  } catch (error) {
    console.log(error)
  }
  // console.log('[WS] client connected! [] - '+socket.handshake.headers.referer); //'%s', socket.request.connection.remoteAddress)

  socket.on('endGiveaway', function (end) {
    // bot.say('#'+giveawayhost,'Gewonnen hat: '+end.winner)
    settings[giveawayhost].giveawaymembers = [] // reset
    // settings[giveawayhost].giveawaysuspend = []
    settings[giveawayhost].giveaway = false
    // socket.emit('giveaway_array', settings[giveawayhost].giveawaymembers) // reset Page
  })

  socket.on('uptime', function () {
    socket.emit('uptime', process.uptime()) // in Sekunden
    console.log(process.uptime())
  })

  socket.on('memoryUsage', function () {
    socket.emit('memoryUsage', util.inspect(process.memoryUsage())) // in JSON
  })
})

const namespaces = [
  io.of('/follower/demo'),
  io.of('/magicconchshell/demo')
]

for (i in settings.channels) {
  if (i === 'last' || i === 'remove') { break }
  namespaces.push(io.of('/follower/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/subscriber/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/info/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/magicconchshell/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/submit/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/giveaway/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/' + settings.channels[i].substr(1))) // Index
}

for (i in namespaces) {
  if (i === 'last' || i === 'remove') { break }
  namespaces[i].on('connection', handleConnection(namespaces[i]))
}

function handleConnection (ns) {
  return function (socket) { // connection
    console.log(chalk.green('[WS] client connected!') + ' [' + ns.name + '] - ' + socket.handshake.headers.referer) // '%s', socket.request.connection.remoteAddress)
    // console.log(util.inspect(socket, false, null));
    /*   socket.on('setUsername',setUsernameCallback (socket,ns)); */
    socket.on('msg', msgCallback(socket, ns))
    socket.on('disconnect', disconnectCallback(socket, ns))
    socket.on('error', clienterrorCallback(socket, ns))
    socket.on('startGiveaway', startGiveawayCallback(socket, ns))
    socket.on('startChatGiveaway', startChatGiveawayCallback(socket, ns))
    socket.on('reconnect', reconnectCallback(socket, ns))
    socket.on('connecting', connectingCallback(socket, ns))
    socket.on('reconnecting', reconnectingCallback(socket, ns))
    socket.on('connect_failed', connectFailedCallback(socket, ns))
    socket.on('reconnect_failed', reconnectFailedCallback(socket, ns))
    socket.on('close', closeCallback(socket, ns))
    socket.on('clienterror', clienterrorCallback(socket, ns))
    socket.on('annyang', annyangCallback(socket, ns))
    socket.on('client', clientCallback(socket, ns))
    socket.on('botdisconnect', botdisconnectCallback(socket, ns))
    socket.on('TwitchConnection', TwitchConnectionCallback(socket, ns))
  }
}

function botdisconnectCallback (socket, ns) {
  return function () {
    let user
    try {
      user = socket.request.session.passport.user.username
    } catch (error) {
      console.log(error)
    }

    const chan = ns.name.substr(1)
    log.separator('[WS] BotDisconnect: user [' + user + '], chan [' + chan + ']', 'alert')
    log.separator(' ' + db.settings.channels.length + ' Channels ', 'info')

    if (user === chan) {
      client.part(user)
      db.settingsprivate.blocked.push('#' + user)
      db.settingsprivate_save()
      console.log('Bot disconnect.')
    } else {
      console.log('nur der Mod')
    }
  }
}

function clienterrorCallback (socket, ns) { // Miesmuschel
  return function (msg) {
    console.warn('[WS] reported a client error %j', msg)
  }
}

function reconnectCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] reconnect ' + msg)
    // socket.broadcast.send("It works!")
  }
}
function connectingCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] connecting ' + msg)
    // socket.broadcast.send("It works!")
  }
}
function reconnectingCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] reconnecting ' + msg)
    // socket.broadcast.send("It works!")
  }
}

function connectFailedCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] connect_failed ' + msg)
    // socket.broadcast.send("It works!")
  }
}
function reconnectFailedCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] reconnect_failed ' + msg)
    // socket.broadcast.send("It works!")
  }
}
function closeCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] close ' + msg)
    // socket.broadcast.send("It works!")
  }
}

function TwitchConnectionCallback (socket, ns) {
  return function (data) {
    console.log('[WS] TwitchConnection [' + ns.name + ']: ' + util.inspect(data, false, null))
    // TODO prüfen ob der
    if (client.getChannels().indexOf(data.name) !== -1) {
      console.log('gefunden')
    } else {
      console.log('nicht gefunden')
    }
  }
}

function annyangCallback (socket, ns) {
  return function (data) {
    // TODO: chathandle(channel, user, message, self)
    console.log('[WS] annyang [' + ns.name + ']: ' + util.inspect(data, false, null))

    switch (data.event) {
      case 'hallo':
        io.of(ns.name).emit('client', { msg: data.event, host: ns.name })
        break
      case 'muschel':
        var voicelanguage = 'Deutsch Female'
        if (db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.autodetectlanguage) if (franc(data.parameter, { whitelist: ['deu', 'eng'] }) === 'eng') voicelanguage = 'UK English Female'
        io.of('/magicconchshell/' + ns.name.substr(1)).emit('incomingmsg', {
          user: ' ',
          text: data.parameter,
          emotes: '',
          lang: voicelanguage,
          volume: db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicevolume,
          pitch: db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicepitch,
          rate: db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicerate
        })
        break
      default:
        if (data.parameter) chathandle('#' + ns.name.substr(1), { username: ns.name.substr(1), type: 'annyang' }, '!' + data.event + ' ' + data.parameter, false)
        else chathandle('#' + ns.name.substr(1), { username: ns.name.substr(1), type: 'annyang' }, '!' + data.event, false)
    }

    // if (data.event == "hallo") {return}

    /*
      switch (data.event) { // TODO: eigentlich brauch es doch nur ein Event für alles
        case 'wow':
          counter('wow','bot.spddl.de', ns.name.substr(1), function(data){
            bot.say('#'+ns.name.substr(1), data)
          })
        break;

        case 'fack':
          counter('fack','bot.spddl.de', ns.name.substr(1), function(data){
            console.log('fack: '+data);
            bot.say('#'+ns.name.substr(1), data)
          })
        break;

        case 'test alert':
          io.of('/magicconchshell/'+ns.name.substr(1)).emit('incomingmsg', {'user': '', 'text': 'Alarm !!', 'emotes': '', 'lang': 'Deutsch Female', 'volume': 1, 'pitch': 1, 'rate': 1})
        break;

        case 'hallo':
          io.of(ns.name).emit('client', {'msg': data.event, 'host': ns.name});
        break;

        case 'weather':
          weather('#'+ns.name.substr(1), ns.name, data.city);
          io.of(ns.name).emit('client', {'msg': 'Wetter für '+data.city});
        break;

        case 'muschel':
          var voicelanguage = 'Deutsch Female'
          if(db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.autodetectlanguage) if(franc(data.frage, {'whitelist' : ['deu', 'eng']}) === 'eng') voicelanguage = 'UK English Female'
          io.of('/magicconchshell/'+ns.name.substr(1)).emit('incomingmsg', {'user': ' ', 'text': data.frage, 'emotes': '', 'lang': voicelanguage, 'volume': db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicevolume, 'pitch': db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicepitch, 'rate': db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicerate })
        break;

        default:
          console.log('[annyang] nix gefunden');
      }  */
  }
}

// const compareMe = function (obj1, obj2, parentKey) {
//   parentKey = parentKey || '';
//   _.each(_.keys(obj1), function (key) {
//     if(_.isObject(obj1[key]) ) {
//       console.log(obj1[key], obj2[key], parentKey + key + '.')
//       compareMe(obj1[key], obj2[key], parentKey + key + '.')
//     } else {
//       if (!_.has(obj2, key) || !_.isEqual(obj1[key], obj2[key])) {
//         console.log(parentKey + key+': '+obj1[key]+' > '+obj2[key]);
//       }
//     }
//   })
// };

function clientCallback (socket, ns) {
  return function (data) {
    // console.log('client: ['+ns.name+'] '+util.inspect(data, false, null))
    // console.log('client: ['+ns.name+']')
    let user
    try {
      user = socket.request.session.passport.user.username
    } catch (error) {
      console.log(error)
    }
    const chan = ns.name.substr(1)

    if (!(user === chan || user === 'spddl' || db.settingsprivate[chan].botsettings.mods || db.settingsprivate[chan].botsettings.mods.some((item) => { return item.toLowerCase() === user.toLowerCase() }))) {
      log.separator('Twitch User: ' + user + ' hat keine Berechtigung für ' + chan, 'alert')
      return false
    }

    if (data.type === 'array') {
      db.settingsprivate[chan].botsettings[data.name] = data.value
      db.settingsprivate_save()
      /* if (data.type == 'alloweddomains') {
        //console.log('!!alloweddomains');
        settingsprivate[ns.name.substr(1)].botsettings.alloweddomains = data.value
        settingsprivate_save()
      } else if (data.type == 'ignorecmd') {
        //console.log('!!ignorecmd');
        settingsprivate[ns.name.substr(1)].botsettings.ignorecmd = data.value
        settingsprivate_save()
      } else if (data.type == 'mods') {
        //console.log('!!ignorecmd');
        settingsprivate[ns.name.substr(1)].botsettings.mods = data.value
        settingsprivate_save()
      } else if (data.type == 'towords') {
        //console.log('!!towords '+ns.name.substr(1));
        settingsprivate[ns.name.substr(1)].botsettings.towords = data.value // settingsprivate[data.model].botsettings.towords = data.value
        settingsprivate_save()
      } else if (data.type == 'banwords') {
        //console.log('!!banwords');
        settingsprivate[ns.name.substr(1)].botsettings.banwords = data.value
        settingsprivate_save() */
    } else if (data.type === 'cmd') {
      // console.log('!!cmd ' + data.value)
      console.log('!!cmd', util.inspect(data.value, false, null, true))
      // try {
      //   // compareMe(db.commands[chan].cmd, data.value)
      // } catch (error) {
      //   console.warn(error)
      // }

      var key = Object.keys(data.value)[0]
      // console.log("key: "+key)
      if (data.value[key].permission) {
        _.each(_.keys(data.value[key].permission), function (keyy) {
          if (!data.value[key].permission[keyy]) { // Damit alle "false" gelöscht werden
            delete data.value[key].permission[keyy]
          }
        })
      }

      if (data.action === 'new') {
        console.log('neu angelegt: ' + key + ', ' + util.inspect(data.value[key], false, null, true))
        db.commands[chan].cmd[key] = data.value[key]
      } else if (data.action === 'del') {
        console.log('gelöscht: ' + key)
        delete db.commands[chan].cmd[key]
      } else {
        console.log('geändert: ' + key + ', ' + util.inspect(data.value[key], false, null, true))
        db.commands[chan].cmd[key] = data.value[key]
      }

      // console.log("");
      // console.log(data);
      // console.log("");

      // console.log(db.commands[chan].cmd);

      // var count = Object.keys(data.value[key]).length;
      // console.log("count: "+count);
      // console.log(Object.keys(data.value[key]));
      // if (count == 0) {
      //   console.log('gelöscht '+key);
      //   delete db.commands[chan].cmd[key]
      // } else {
      //   console.log();
      //   db.commands[chan].cmd[key] = data.value[key]
      // }

      // db.commands[chan].cmd[key] = data.value[key]
      db.commands_save()

      // var myObject = { '!add': { text: '{add} dings :P', permission: { viewer: true } } }

      // var count = Object.keys(myObject).length;
      // console.log(count);
    } else if (data.type === 'annyang') {
      console.log('!!annyang')
      db.voicecommands[chan] = data.value
      db.voicecommands_save()
    } else if (data.type === 'counter') {
      console.log('!!counter') // TODO
      // db.settingsprivate.spddl.botsettings.banwords = data.value
    } else if (data.type === 'ads') {
      console.log('!!ads') // TODO
      // db.settingsprivate.spddl.botsettings.banwords = data.value
    } else if (data.type === 'steam') {
      console.log('!!steam')
      steam_start({ username: 'Webseite_' + data.chan, channel: data.chan }, '')
    } else if (data.type === 'steamaccount') {
      console.log('!!steamaccount')
      db.settingsprivate[chan].botsettings.steam.account = data.value
      db.settingsprivate_save()
      SteamUsernamefn()
    } else if (data.type === 'steamgroup') {
      console.log('!!steamgroup')
      db.settingsprivate[chan].botsettings.steam.steamgroup = data.value
      db.settingsprivate_save()
      SteamChatterroomfn()
    } else if (data.type === 'giveawaysuspend') {
      console.log('!!giveawaysuspend')
      db.settingsprivate[chan].botsettings.giveaway.giveawaysuspend = data.value
      db.settingsprivate_save()
    } else if (data.type === 'cron') {
      console.log('!!cron')
      console.info(data.value) // { time: '0,10,25 * * * *', text: 'asdasdasd', id: 0 }

      if (cronfunc.test(chan, data.value.id)) {
        console.log('cronfunc.test TRUE')
        cronfunc.del(chan, data.value.id)
        for (let i = 0, len = db.settingsprivate[chan].botsettings.advertising.length; i < len; i++) {
          if (db.settingsprivate[chan].botsettings.advertising[i].id === data.value.id) {
            console.log('gefunden: ' + i)
            db.settingsprivate[chan].botsettings.advertising.splice(i, 1)
            break
          }
        }
      } else {
        // console.warn('cronfunc.test FALSE')
      }
      cb(chan, data.value.id, data.value.time, data.value.text)
      db.settingsprivate[chan].botsettings.advertising.push(data.value)
      db.settingsprivate_save()
    } else if (data.type === 'crondelete') {
      console.log('!!crondelete')
      if (cronfunc.test(chan, data.value)) {
        cronfunc.del(chan, data.value)
      } else {
        console.info('CronJob: ' + data.value + ' wurde nicht gefunden')
      }
      for (let i = 0, len = db.settingsprivate[chan].botsettings.advertising.length; i < len; i++) {
        if (db.settingsprivate[chan].botsettings.advertising[i].id === data.value) {
          console.log('gefunden: ' + i)
          db.settingsprivate[chan].botsettings.advertising.splice(i, 1); break
        }
      }
      // db.settingsprivate[chan].botsettings.advertising.splice(data.value, 1)
      console.log(db.settingsprivate[chan].botsettings.advertising)
      db.settingsprivate_save()
    } else {
      console.log('!!String')
      // console.log("settingsprivate."+data.model+" = "+data.value)
      // eval("settingsprivate."+chan+" = "+data.value)
      eval('db.settingsprivate.' + data.model + ' = ' + data.value) // eslint-disable-line no-eval
      db.settingsprivate_save()
    }
  }
}

function startGiveawayCallback (socket, ns) {
  return function (data) {
    console.log('[WS] #' + data + ' Giveaway startet ' + vsettings[data].giveawaymembers.length + ' Teilnehmer auf: ' + data + ' [' + ns.name + '] - ' + socket.handshake.headers.referer)
    if (settings[data].giveawaymembers.length !== 0) {
      console.log('#' + data, 'Die Auslosung beginnt') // bot.say('#'+data,'Die Auslosung beginnt') // [DEBUG]
      db.settings[data].giveawaymembers = [] // reset
      db.settings[data].giveawaysuspend = db.settingsprivate[data].botsettings.giveaway.giveawaysuspend // Bots
      // settings[giveawayhost].giveawaysuspend = []
      db.settings[data].giveaway = true
    }
  }
}

function startChatGiveawayCallback (socket, ns) {
  return function (data) {
    console.log('[WS] startChatGiveawayCallback #' + data + ' [' + ns.name + '] - ' + socket.handshake.headers.referer)
    bot.say('#' + data, '.me GIVEAWAY!! GIVEAWAY!!')
    console.log(db.settingsprivate[data].botsettings.giveaway.keyword)
    if (db.settingsprivate[data].botsettings.giveaway.keyword) {
      setTimeout(function () {
        bot.say('#' + data, '.me KeyWord: ' + db.settingsprivate[data].botsettings.giveaway.keyword, 10)
      }, 100)
    }
    db.settings[data].giveawaymembers = []
    db.settings[data].giveaway = true
  }
}

// function errorCallback (socket, ns) {
//   return function (msg) {
//     console.log('[WS] Socket.io reported a generic error ' + msg + ' [' + ns.name + '] - ' + socket.handshake.headers.referer)
//   }
// }

function msgCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] msgCallback ' + msg)
  }
}

function disconnectCallback (socket, ns) {
  return function (msg) {
    // console.log('[WS] Disconnected '+msg+' - '+ns.name); // Disconnected transport close
    // console.log('[WS] Disconnected '+msg+' ['+ns.name+'] - '+socket.handshake.headers.referer); // Disconnected transport close
    console.log('[WS] Disconnected ' + msg + ' [' + ns.name + '] - ' + socket.handshake.headers.referer)
  }
}

// function FollowerAPILOOP () {
//   // console.time('FollowerAPILOOP')
//   for (let i = 0, l = settings.channels.length; i < l; i++) {
//     const channel = settings.channels[i].substr(1)
//     if (streamdata[channel].setfollows && streamdata[channel].setsubscriptions) FollowerAPI('follows', channel, true)
//     else if (streamdata[channel].setfollows) FollowerAPI('follows', channel)
//     else if (streamdata[channel].setsubscriptions) FollowerAPI('subscriptions', channel)
//     // if(i == --l){console.timeEnd('FollowerAPILOOP')}
//   }
// }

// add new last() method:
if (!Array.prototype.last) {
  Array.prototype.last = () => { // eslint-disable-line no-extend-native
    return this[this.length - 1]
  }
}

/* TODO
function FollowerAPI(type, host, sub){
  if (streamdata[host].offset != 0){
    var i = streamdata[host].offset; offset = '&direction=ASC&offset='+ ++i
  }else{ offset = '' }

  //console.info('FollowerAPI: '+type+', '+host+', '+sub+', '+offset)
  if(sub){ FollowerAPI('subscriptions', host)}
  https.get('https://api.twitch.tv/kraken/channels/'+host+'/'+type+'?limit=1'+offset+'&client_id=', function(r) {
// https://api.twitch.tv/kraken/channels/spddl/follows?direction=ASC&limit=1&offset=184&client_id=
// https://api.twitch.tv/kraken/channels/spddl/follows?limit=25&direction=desc&client_id= // TwitchAlerts

      r.setEncoding('utf8');
      var b = '';
      r.on('data', function(chunk) { b += chunk });
      r.on('end', function() {
        //console.info(b)
        //if(!isJson(b)){return false;}
        if(b.match('<html><body><h1>502 Bad Gateway</h1>') !== null){console.critical('[TwitchAPI] 502 Bad Gateway');return}
        if(b.match('<html><body><h1>503 Service Unavailable</h1>') !== null){console.critical('[TwitchAPI] 503 Service Unavailable');return}
        if(b.match('<html><body><h1>504 Gateway Time-out</h1>') !== null){console.critical('[TwitchAPI] 504 Gateway Time-out');return}

        var body = JSON.parse(b) // <html><body><h1>503 Service Unavailable</h1>

          if(body.error == 'Unauthorized'){
            streamdata[host].setsubscriptions = false
            console.critical(host+' Subscriptions ausgeschaltet');
            streamdata.lastupdated = new Date();
            jf.writeFileSync(streamfile, streamdata)
            return
          }

          if(body.follows.length != 0 && (body.follows[0].user.name != streamdata[host].follows.last().name)){

            console.info('Neuer Follower: '+host+', '+body.follows[0].user.name+' seit: '+body.follows[0].created_at+' Total: '+body._total+' DEBUG:'+streamdata[host].follows.last().name)+' '+(body.follows[0].user.name != streamdata[host].follows.last().name)
            streamdata[host].follows.push({ name: body.follows[0].user.name, created_at: body.follows[0].created_at});
            streamdata[host].follows_total = body._total
            if (streamdata[host].offset != 0){
              streamdata[host].offset = ++streamdata[host].offset
            }
            streamdata.lastupdated = new Date();
            jf.writeFileSync(streamfile, streamdata)
            if(sub){
              Alertprocess('sub', host, body.follows[0].user.name, body._total) // TODO
            }else{
              Alertprocess('fol', host, body.follows[0].user.name, body._total) // TODO
            }
          }

      });

    }).on('error', function(e) {
      console.error('ERROR: ' + e.message)
    })
}
*/

// //////////////////////////////////////////////////////////////////////////////
// @socket ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @helper/alertprocess start
// //////////////////////////////////////////////////////////////////////////////


function Alertprocess (type, host, name, total) { // TODO
  // if (config.localhost()) { console.info('Alertprocess: '+type+', '+host+', '+name+', '+total) }
  console.info('Alertprocess: ' + type + ', ' + host + ', %j, ' + total, name)

  // Twitchchat
  if (db.settingsprivate[host].botsettings.alerts.chat || false) {
    if (type === 'fol') {
      _.each(name, function (value) {
        if (db.settingsprivate[host].botsettings.alerts.follower.text || false) {
          let msg = db.settingsprivate[host].botsettings.alerts.follower.text
          msg = msg.replace(new RegExp('{NAME}', 'g'), value.name)
          bot.say('#' + host, msg, 1)
        } else {
          bot.say('#' + host, value.name + ' verfolgt dich.')
        }
      })
    } else {
      bot.say('#' + host, name + ' hat dich abonniert.')
    }
  }

  // Twitch Whisper
  if (db.settingsprivate[host].botsettings.alerts.whisper || false) {
    if (type === 'fol') {
      _.each(name, function (value) {
        if (db.settingsprivate[host].botsettings.alerts.follower.whispertext || false) {
          let msg = db.settingsprivate[host].botsettings.alerts.follower.whispertext
          msg = msg.replace(new RegExp('{NAME}', 'g'), value.name)
          bot.whisper(host, msg)
        } else {
          bot.whisper(host, value.name + ' verfolgt dich.')
        }
      })
    } else {
      bot.say('#' + host, name + ' hat dich abonniert.')
    }
  }

  // Steam
  if (db.settingsprivate[host].botsettings.alerts.steam || false) {
    if (type === 'fol') {
      var steamaccs = _.filtersteam(Steam_username, (val) => val === host)
      if (steamaccs) {
        _.each(steamaccs, function (steamacc) {
          _.each(name, function (value) {
            // console.log('steamacc: '+steamacc);
            if (db.settingsprivate[host].botsettings.alerts.follower.steamtext || false) {
              msg = db.settingsprivate[host].botsettings.alerts.follower.steamtext
              msg = msg.replace(new RegExp('{NAME}', 'g'), value.name)
              steam_say({ source: steamacc, username: host }, msg)
            } else {
              steam_say({ source: steamacc, username: host }, 'Neuer Follower: ' + value.name)
            }
          })
        })
      }
    } else {
      steam_host(host, function (hoster) {
        steam_say(hoster, '[' + total + '] Neuer Abonnent: ' + name)
        if (host !== 'spddl') {
          steam_say('76561198027155016', host + ' [Neuer Abonnent] ' + type + ': ' + name)
        }
      })
    }
  }
  // Website
  if (type === 'fol') {
    io.of('/follower/' + host).emit('incomingmsg', name)
  } else {
    io.of('/subscriber/' + host).emit('incomingmsg', name)
  }
}

// //////////////////////////////////////////////////////////////////////////////
// @helper/alertprocess ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @steam start
// //////////////////////////////////////////////////////////////////////////////
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

// //////////////////////////////////////////////////////////////////////////////
// @steam ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @discord start
// //////////////////////////////////////////////////////////////////////////////
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
  // token: 'MTc2NjE2MTI1ODIyNDAyNTYx.XerUlQ.V9PnbIcQ75pW5rYsl9-NpSxTmUE'
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

// //////////////////////////////////////////////////////////////////////////////
// @discord ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @tipeeestream start
// //////////////////////////////////////////////////////////////////////////////
// @ import './tipeeestream.js'
// //////////////////////////////////////////////////////////////////////////////
// @tipeeestream ende
// //////////////////////////////////////////////////////////////////////////////


// //////////////////////////////////////////////////////////////////////////////
// @deepbot start
// //////////////////////////////////////////////////////////////////////////////
// @ import './deepbot.js'
// //////////////////////////////////////////////////////////////////////////////
// @deepbot ende
// //////////////////////////////////////////////////////////////////////////////
