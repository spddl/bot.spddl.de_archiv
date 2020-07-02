// Define our dependencies
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
// const request = require('request')
const httpie = require('httpie')
// const handlebars = require('handlebars')

// ClientID = ''
// TWITCHTV_CLIENT_ID = '' // online
// TWITCHTV_CLIENT_SECRET = ''
// TWITCHTV_CALLBACKURL = 'https://bot.spddl.de/auth/twitchtv/callback'

// curl -H "Authorization: OAuth " https://id.twitch.tv/oauth2/validate
// {"client_id":"","login":"spddl_bot","scopes":["channel:moderate","channel:read:subscriptions","channel_check_subscription","channel_editor","channel_read","channel_subscriptions","chat:edit","chat:read","communities_edit","communities_moderate","user_follows_edit","user_read","whispers:edit","whispers:read"],"user_id":"78566427","expires_in":0}

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = '' // online
const TWITCH_SECRET = ''
const SESSION_SECRET = 'catkeyboard'
const CALLBACK_URL = 'http://185.228.47.108:3000/auth/twitch/callback' // You can run locally with - http://localhost:3000/auth/twitch/callback

// Initialize Express and middlewares
const app = express()
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(express.static('public'))
app.use(passport.initialize())
app.use(passport.session())

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = async function (accessToken, done) {
  console.log('userProfile (accessToken)', accessToken)
  try {
    const { data } = await httpie.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
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

passport.serializeUser((user, done) => { done(null, user) }) // saved to session

passport.deserializeUser((user, done) => { done(null, user) }) // user object attaches to the request as req.user

passport.use('twitch', new OAuth2Strategy({
  authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
  tokenURL: 'https://id.twitch.tv/oauth2/token',
  clientID: TWITCH_CLIENT_ID,
  clientSecret: TWITCH_SECRET,
  callbackURL: CALLBACK_URL,
  state: true
}, (accessToken, refreshToken, profile, done) => {
  // profile.accessToken = accessToken
  // profile.refreshToken = refreshToken
  console.log({ accessToken, refreshToken, profile })
  _profile = profile.data
  console.log('db.privatee[profile.login]\\/\\/\\/\\/\\/\\/\\/\\/', _profile.login)

  console.log('db.privatee[profile.login].oauth =', accessToken)
  console.log('db.privatee[profile.login].refreshToken =', refreshToken)
  console.log('db.privatee[profile.login]._id =', _profile.id)
  console.log('db.privatee[profile.login].lastupdated =', new Date())
  console.log()
  console.log('db.privatee[profile.login]/\\/\\/\\/\\/\\/\\/\\/\\', _profile.login)

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

  done(null, _profile)
}
))

// Set route to start OAuth link, this is where you define scopes to request
app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }))

// Set route for OAuth redirect
// app.get('/auth/twitch/callback', passport.authenticate('twitch', { failureRedirect: '/' }, function (req, res) {
//   console.log('/auth/twitch/callback')
//   console.log({ req, res })

//   // req.session.user = req.user
//   // console.log('req.user', req.user)
//   // console.log('req.query', req.query)
//   // res.redirect(req.session.returnTo || '/') // res.redirect('/')
//   delete req.session.returnTo
// }))

app.get('/auth/twitch/callback', function (req, res, next) {
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

// If user has an authenticated session, display it, otherwise display link to authenticate
app.get('/', function (req, res) {
  console.log('/ ')
  if (req.session && req.session.passport && req.session.passport.user) {
    // res.send(JSON.stringify(req.session.passport.user))
    const template = req.session.passport.user
    console.log({ template })
    res.send(`<html><head><title>Twitch Auth Sample</title></head>
<table>
    <tr><th>Access Token</th><td>${template.accessToken}</td></tr>
    <tr><th>Refresh Token</th><td>${template.refreshToken}</td></tr>
    <tr><th>Display Name</th><td>${template.data.display_name}</td></tr>
    <tr><th>Bio</th><td>${template.data.bio}</td></tr>
    <tr><th>Image</th><td>${template.data.logo}</td></tr>
</table></html>`)
    // {"data":[{"id":"29218758","login":"spddl","display_name":"spddl","type":"","broadcaster_type":"","description":"","profile_image_url":"https://static-cdn.jtvnw.net/jtv_user_pictures/spddl-profile_image-383ac69764a1ee3a-300x300.jpeg","offline_image_url":"","view_count":16332}],"accessToken":"u0l5r5leog3qbx7csfpexytb8j9otv","refreshToken":"goly4n97l9dknqkgpiqzh1nzom8xpht16lc735qqy2981qjhtp"}
  } else {
    res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch">connect_dark.png<img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>')
  }
})

app.listen(3000, function () {
  console.log('Twitch auth sample listening on port 3000!')
})
