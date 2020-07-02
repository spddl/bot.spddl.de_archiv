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
