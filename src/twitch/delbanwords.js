function delbanwords (channel, banwords, user) {
  var array = db.settingsprivate[channel.substr(1)].botsettings.banwords
  var index = array.indexOf(banwords)
  if (index > -1) {
    array.splice(index, 1)
    db.savecommand_save()
    if (user.type === 'steam') steamSay(user, '"' + banwords + '" wurde aus den "banwords" entfernt')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, '"' + banwords + '" wurde aus den "banwords" entfernt')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '"' + banwords + '" wurde aus den "banwords" entfernt' })
    else bot.say(channel, '"' + banwords + '" wurde aus den "banwords" entfernt')
  } else {
    if (user.type === 'steam') steamSay(user, '"' + banwords + '" gibt es nicht unter den "banwords"')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, '"' + banwords + '" gibt es nicht unter den "banwords"')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '"' + banwords + '" gibt es nicht unter den "banwords"' })
    else bot.say(channel, '"' + banwords + '" gibt es nicht unter den "banwords"')
  }
}
