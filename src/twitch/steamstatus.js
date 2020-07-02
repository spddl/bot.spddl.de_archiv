// TODO -> .cmd
function steamstatus (channel, user) {
  // TODO: überprüfen ob diese Funktion nur mit eingetragener SteamID aufgerufen werden kann
  // console.log('steamstatus start')
  var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + config.steamapikey + '&steamids=' + settingsprivate[channel.substr(1)].botsettings.steamid
  request({
    url: url,
    json: true
  }, function (error, response, body) {
    // console.log(body.response)
    if (!error && response.statusCode === 200) {
      if (body.response.players[0].communityvisibilitystate !== 1) {
        var status
        switch (body.response.players[0].personastate) {
          case 0: status = 'Offline'; break
          case 1: status = 'Online'; break
          case 2: status = 'Busy'; break
          case 3: status = 'Away'; break
          case 4: status = 'Snooze'; break
          case 5: status = 'looking to trade'; break
          case 6: status = 'looking to play'; break
        }
        var gameinfo
        if (body.response.players[0].gameextrainfo !== undefined) {
          gameinfo = ' Spiel: ' + body.response.players[0].gameextrainfo
        } else {
          gameinfo = ''
        }

        // bot.say(channel,'['+status+'] Steam Name: '+body.response.players[0].personaname+gameinfo)
        if (user.type === 'steam') steamSay(user, '[' + status + '] Steam Name: ' + body.response.players[0].personaname + gameinfo)
        else if (user.type === 'twitchgroup') bot.whisper(user.username, '[' + status + '] Steam Name: ' + body.response.players[0].personaname + gameinfo)
        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '[' + status + '] Steam Name: ' + body.response.players[0].personaname + gameinfo })
        else bot.say(channel, '[' + status + '] Steam Name: ' + body.response.players[0].personaname + gameinfo)
      } else {
        // bot.say(channel,'Steam profile ist private')
        if (user.type === 'steam') steamSay(user, 'Steam profile ist private')
        else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Steam profile ist private')
        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Steam profile ist private' })
        else bot.say(channel, 'Steam profile ist private')
      }
    }
  })
}
