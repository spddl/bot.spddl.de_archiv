function addignorecmd (channel, cmd, user) {
  console.info(channel + ' ' + cmd)
  for (var i in settingsprivate[channel.substr(1)].botsettings.ignorecmd) { // ob domain schon vorhanden ist
    if (db.settingsprivate[channel.substr(1)].botsettings.ignorecmd[i] === cmd) {
      if (user.type === 'steam') steamSay(user, cmd + ' wird schon vom Bot ignoriert')
      else if (user.type === 'twitchgroup') bot.whisper(user.username, cmd + ' wird schon vom Bot ignoriert')
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: cmd + ' wird schon vom Bot ignoriert' })
      else bot.say(channel, cmd + ' wird schon vom Bot ignoriert')
      return
    }
  }

  db.settingsprivate[channel.substr(1)].botsettings.ignorecmd.push(cmd)
  db.savecommand_save()
  if (user.type === 'steam') steamSay(user, cmd + ' wird nun vom Bot ignoriert')
  else if (user.type === 'twitchgroup') bot.whisper(user.username, cmd + ' wird nun vom Bot ignoriert')
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: cmd + ' wird nun vom Bot ignoriert' })
  else bot.say(channel, cmd + ' wird nun vom Bot ignoriert')
}
