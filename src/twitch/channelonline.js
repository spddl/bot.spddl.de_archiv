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
