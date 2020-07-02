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
  greenlockExpressOptions.server = 'https://acme-v02.api.letsencrypt.org/directory'
  // greenlockExpressOptions.server = 'staging'
}

// [le/lib/core.js] Check Expires At 2018-05-01T15:20:50.000Z
// [le/lib/core.js] Check Renewable At 2018-04-24T15:20:50.000Z // Eine Woche bevor es ausläuft

// console.log(util.inspect('greenlockExpressOptions', greenlockExpressOptions, false, null, true))

const lex = require('greenlock-express').create(greenlockExpressOptions)
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
