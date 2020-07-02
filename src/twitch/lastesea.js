// TODO -> .cmd
function lastesea (channel, user, customuserid) {
  userid = customuserid.substr(9) || settingsprivate[channel.substr(1)].botsettings.eseaid

  if (userid) {
    cloudscraper.get('https://play.esea.net/users/' + userid + '?format=json', function (err, res, body) {
      // console.log('err: '+err) //  Error: connect ETIMEDOUT
      if (err !== null) { console.emergency('fn lastesea err: ' + err) }
      if (body !== undefined) { // API Down?
        if (JSON.parse(body).title === 'Error') {
          if (user.type === 'steam') steamSay(user, 'ESEA WebAPI Error')
          else if (user.type === 'twitchgroup') bot.whisper(user.username, 'ESEA WebAPI Error')
          else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'ESEA WebAPI Error' })
          else bot.say(channel, 'ESEA WebAPI Error')
          return
        }
        console.info('  Esea API Daten gefunden')
        body = JSON.parse(body)

        if (body.recent_matches.length === 0) {
          if (user.type === 'steam') steamSay(user, 'kein LastMatch in der ESEA API gefunden')
          else if (user.type === 'twitchgroup') bot.whisper(user.username, 'kein LastMatch in der ESEA API gefunden')
          else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'kein LastMatch in der ESEA API gefunden' })
          else bot.say(channel, 'kein LastMatch in der ESEA API gefunden')
        } else {
          if (customuserid.substr(8)) {
            lastmatch = _.last(_.toArray(body.recent_matches))
            // bot.say(channel,'ESEA LastMatch: ID'+lastmatch.id+' '+lastmatch.result+' ['+lastmatch.map_name+'] frags'+lastmatch.frags+' HSP'+Math.round(lastmatch.hits_head_pct *1000)/1000)
            if (user.type === 'steam') steamSay(user, '(' + body.profile.id + ') ESEA LastMatch: ID' + lastmatch.id + ' ' + lastmatch.result + ' [' + lastmatch.map_name + '] frags:' + lastmatch.frags + ' HSP:' + Math.round(lastmatch.hits_head_pct * 1000) / 1000)
            else if (user.type === 'twitchgroup') bot.whisper(user.username, '(' + body.profile.id + ') ESEA LastMatch: ID' + lastmatch.id + ' ' + lastmatch.result + ' [' + lastmatch.map_name + '] frags:' + lastmatch.frags + ' HSP:' + Math.round(lastmatch.hits_head_pct * 1000) / 1000)
            else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '(' + body.profile.id + ') ESEA LastMatch: ID' + lastmatch.id + ' ' + lastmatch.result + ' [' + lastmatch.map_name + '] frags:' + lastmatch.frags + ' HSP:' + Math.round(lastmatch.hits_head_pct * 1000) / 1000 })
            else bot.say(channel, '(' + body.profile.id + ') ESEA LastMatch: ID' + lastmatch.id + ' ' + lastmatch.result + ' [' + lastmatch.map_name + '] frags:' + lastmatch.frags + ' HSP:' + Math.round(lastmatch.hits_head_pct * 1000) / 1000)
          } else {
            lastmatch = _.last(_.toArray(body.recent_matches))
            // bot.say(channel,'ESEA LastMatch: ID'+lastmatch.id+' '+lastmatch.result+' ['+lastmatch.map_name+'] frags'+lastmatch.frags+' HSP'+Math.round(lastmatch.hits_head_pct *1000)/1000)
            if (user.type === 'steam') steamSay(user, 'ESEA LastMatch: ID' + lastmatch.id + ' ' + lastmatch.result + ' [' + lastmatch.map_name + '] frags:' + lastmatch.frags + ' HSP:' + Math.round(lastmatch.hits_head_pct * 1000) / 1000)
            else if (user.type === 'twitchgroup') bot.whisper(user.username, 'ESEA LastMatch: ID' + lastmatch.id + ' ' + lastmatch.result + ' [' + lastmatch.map_name + '] frags:' + lastmatch.frags + ' HSP:' + Math.round(lastmatch.hits_head_pct * 1000) / 1000)
            else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'ESEA LastMatch: ID' + lastmatch.id + ' ' + lastmatch.result + ' [' + lastmatch.map_name + '] frags:' + lastmatch.frags + ' HSP:' + Math.round(lastmatch.hits_head_pct * 1000) / 1000 })
            else bot.say(channel, 'ESEA LastMatch: ID' + lastmatch.id + ' ' + lastmatch.result + ' [' + lastmatch.map_name + '] frags:' + lastmatch.frags + ' HSP:' + Math.round(lastmatch.hits_head_pct * 1000) / 1000)
          }
        }
      } else {
        console.emergency('ESEA WebAPI is down.')
        if (user.type === 'steam') steamSay(user, 'ESEA WebAPI is down. :steambored:')
        else if (user.type === 'twitchgroup') bot.whisper(user.username, 'ESEA WebAPI is down. ItsBoshyTime')
        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'ESEA WebAPI is down. ItsBoshyTime' })
        else bot.say(channel, 'ESEA WebAPI is down. ItsBoshyTime')
      }
    })
  } else {
    if (user.type === 'steam') steamSay(user, 'Es wurde keine ESEA ID angegeben. :steambored:')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Es wurde keine ESEA ID angegeben. ItsBoshyTime')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Es wurde keine ESEA ID angegeben. ItsBoshyTime' })
    else bot.say(channel, 'Es wurde keine ESEA ID angegeben. ItsBoshyTime')
  }
}
