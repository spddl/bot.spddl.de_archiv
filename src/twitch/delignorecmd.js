function delignorecmd (channel, cmd, user) {
  var array = db.settingsprivate[channel.substr(1)].botsettings.ignorecmd
  var index = array.indexOf(cmd)
  if (index > -1) {
    array.splice(index, 1)
    db.savecommand_save()
    if (user.type === 'steam') steamSay(user, cmd + ' wird nun nicht mehr vom Bot ignoriert')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, cmd + ' wird nun nicht mehr vom Bot ignoriert')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: cmd + ' wird nun nicht mehr vom Bot ignoriert' })
    else bot.say(channel, cmd + ' wird nun nicht mehr vom Bot ignoriert')
  } else {
    if (user.type === 'steam') steamSay(user, cmd + ' den Command gibt es nicht auf der Ignoreliste')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, cmd + ' den Command gibt es nicht auf der Ignoreliste')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: cmd + ' den Command gibt es nicht auf der Ignoreliste' })
    else bot.say(channel, cmd + ' den Command gibt es nicht auf der Ignoreliste')
  }
}
