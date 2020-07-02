function deltowords (channel, towords, user) {
  const array = db.settingsprivate[channel.substr(1)].botsettings.towords
  const index = array.indexOf(towords)
  if (index > -1) {
    array.splice(index, 1)
    db.savecommand_save()
    if (user.type === 'steam') steamSay(user, '"' + towords + '" wurde aus den "towords" entfernt')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, '"' + towords + '" wurde aus den "towords" entfernt')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '"' + towords + '" wurde aus den "towords" entfernt' })
    else bot.say(channel, '"' + towords + '" wurde aus den "towords" entfernt')
  } else {
    if (user.type === 'steam') steamSay(user, '"' + towords + '" gibt es nicht unter den "towords"')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, '"' + towords + '" gibt es nicht unter den "towords"')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '"' + towords + '" gibt es nicht unter den "towords"' })
    else bot.say(channel, '"' + towords + '" gibt es nicht unter den "towords"')
  }
}
