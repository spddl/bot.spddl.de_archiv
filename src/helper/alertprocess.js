
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
