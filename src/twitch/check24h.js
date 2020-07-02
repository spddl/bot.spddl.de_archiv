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
