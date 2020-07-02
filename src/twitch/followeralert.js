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
