function viewerava (name, callback) { // TODO gehört zum Giveaway Array
  requestjson.createClient('https://api.twitch.tv/kraken/channels/').get(name, { headers: { 'Client-ID': ClientID } }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      if (!body.logo) callback(null) //  if (!body.logo) callback('http://bot.spddl.de/giveaway/404_user.png')
      else callback(body.logo)
    }
  })
}
