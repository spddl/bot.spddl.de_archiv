function addbanwords (channel, banwords, user) {
  console.info(channel + ' ' + banwords)
  db.settingsprivate[channel.substr(1)].botsettings.banwords.push(banwords)
  db.savecommand_save()
  if (user.type === 'steam') steamSay(user, '"' + banwords + '" wird nun mit einem PermBan bestraft')
  else if (user.type === 'twitchgroup') bot.whisper(user.username, '"' + banwords + '" wird nun mit einem PermBan bestraft')
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '"' + banwords + '" wird nun mit einem PermBan bestraft' })
  else bot.say(channel, '"' + banwords + '" wird nun mit einem PermBan bestraft')
}
