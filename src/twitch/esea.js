// TODO -> .cmd
function esea (channel, user, customuserid) {
  // cloudscraper ddos
  userid = customuserid.substr(5) || settingsprivate[channel.substr(1)].botsettings.eseaid
  if (userid) {
    cloudscraper.get('https://play.esea.net/users/' + userid + '?format=json', function (err, res, body) {
      if (err) {
        console.log('Error occurred')
      } else {
        if (err !== null) { console.emergency('fn esea err: ' + err) }
        if (body !== undefined && isJson(body)) { // API Down?
          body = JSON.parse(body)

          if (body.title === 'Error') {
            if (user.type === 'steam') steamSay(user, 'ESEA WebAPI Error')
            else if (user.type === 'twitchgroup') bot.whisper(user.username, 'ESEA WebAPI Error')
            else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'ESEA WebAPI Error' })
            else bot.say(channel, 'ESEA WebAPI Error')
            return
          }
          console.info('  Esea API Daten gefunden')

          // if (JSON.parse(body).box.length !== 0) {
          if (body.box && (body.box.length !== 0)) {
            // body = JSON.parse(body)
            // bot.say(channel,'ESEA: '+body.box[0].alias+'['+Math.round(body.box[0].rws * 100) / 100+'RWS // '+body.box[0].rws_change+'] ['+Math.round(body.box[0].adr * 100) / 100+'ADR]')
            if (user.type === 'steam') steamSay(user, 'ESEA: ' + body.box[0].alias + ' [' + Math.round(body.box[0].rws * 100) / 100 + 'RWS // ' + body.box[0].rws_change + '] [' + Math.round(body.box[0].adr * 100) / 100 + 'ADR]')
            else if (user.type === 'twitchgroup') bot.whisper(user.username, 'ESEA: ' + body.box[0].alias + ' [' + Math.round(body.box[0].rws * 100) / 100 + 'RWS // ' + body.box[0].rws_change + '] [' + Math.round(body.box[0].adr * 100) / 100 + 'ADR]')
            else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'ESEA: ' + body.box[0].alias + ' [' + Math.round(body.box[0].rws * 100) / 100 + 'RWS // ' + body.box[0].rws_change + '] [' + Math.round(body.box[0].adr * 100) / 100 + 'ADR]' })
            else bot.say(channel, 'ESEA: ' + body.box[0].alias + ' [' + Math.round(body.box[0].rws * 100) / 100 + 'RWS // ' + body.box[0].rws_change + '] [' + Math.round(body.box[0].adr * 100) / 100 + 'ADR]')
          } else {
            // body = JSON.parse(body)
            console.log('[ESEA] Box ist leer') // nichts gefunden aus gründen

            if (body.rank_info) { // rank_info kann false sein
              if (customuserid.substr(4)) { // TODO Namen noch ausschreiben
                if (user.type === 'steam') steamSay(user, '(' + body.profile.id + ') ESEA Rank:' + body.rank_info.name + '[' + body.rank_info.poiints + ']')
                else if (user.type === 'twitchgroup') bot.whisper(user.username, '(' + body.profile.id + ') ESEA Rank:' + body.rank_info.name + '[' + body.rank_info.poiints + ']')
                else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '(' + body.profile.id + ') ESEA Rank:' + body.rank_info.name + '[' + body.rank_info.poiints + ']' })
                else bot.say(channel, '(' + body.profile.id + ') ESEA Rank: ' + body.rank_info.name + ' [' + body.rank_info.points + ' punkte]')
              } else {
                if (user.type === 'steam') steamSay(user, 'ESEA Rank:' + body.rank_info.name + '[' + body.rank_info.poiints + ']')
                else if (user.type === 'twitchgroup') bot.whisper(user.username, 'ESEA Rank:' + body.rank_info.name + '[' + body.rank_info.poiints + ']')
                else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'ESEA Rank:' + body.rank_info.name + '[' + body.rank_info.poiints + ']' })
                else bot.say(channel, 'ESEA Rank: ' + body.rank_info.name + ' [' + body.rank_info.points + ' punkte]')
              }
            } else {
              if (customuserid.substr(4)) { // TODO Namen noch ausschreiben
                if (user.type === 'steam') steamSay(user, '(' + body.profile.id + ') Kein ESEA Rank gefunden')
                else if (user.type === 'twitchgroup') bot.whisper(user.username, '(' + body.profile.id + ') Kein ESEA Rank gefunden')
                else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '(' + body.profile.id + ') Kein ESEA Rank gefunden' })
                else bot.say(channel, '(' + body.profile.id + ') Kein ESEA Rank gefunden')
              } else {
                if (user.type === 'steam') steamSay(user, 'Kein ESEA Rank gefunden')
                else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Kein ESEA Rank gefunden')
                else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Kein ESEA Rank gefunden' })
                else bot.say(channel, 'Kein ESEA Rank gefunden')
              }
            }
          }
        } else {
          console.log(body)
          if (body === undefined) {
            console.emergency('ESEA WebAPI is down.')
            if (user.type === 'steam') steamSay(user, 'ESEA WebAPI is down. :steambored:')
            else if (user.type === 'twitchgroup') bot.whisper(user.username, 'ESEA WebAPI is down. ItsBoshyTime')
            else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'ESEA WebAPI is down. ItsBoshyTime' })
            else bot.say(channel, 'ESEA WebAPI is down. ItsBoshyTime')
          } else {
            console.emergency('ESEA Cloudflare')
            if (user.type === 'steam') steamSay(user, 'Cloudflare blockt die Abfrage. :steambored:')
            else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Cloudflare blockt die Abfrage. ItsBoshyTime')
            else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Cloudflare blockt die Abfrage. ItsBoshyTime' })
            else bot.say(channel, 'Cloudflare blockt die Abfrage. ItsBoshyTime')
          }
        }
      }
    })
  } else {
    if (user.type === 'steam') steamSay(user, 'Es wurde keine ESEA ID angegeben. :steambored:')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Es wurde keine ESEA ID angegeben. ItsBoshyTime')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Es wurde keine ESEA ID angegeben. ItsBoshyTime' })
    else bot.say(channel, 'Es wurde keine ESEA ID angegeben. ItsBoshyTime')
  }
}
