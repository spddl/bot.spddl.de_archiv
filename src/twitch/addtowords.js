function addtowords (channel, towords, user) {
  console.info(channel + ' ' + towords)
  db.settingsprivate[channel.substr(1)].botsettings.towords.push(towords)
  db.savecommand_save()
  if (user.type === 'steam') steamSay(user, '"' + towords + '" wird nun für 20sek kommentarlos geTimeoutet')
  else if (user.type === 'twitchgroup') bot.whisper(user.username, '"' + towords + '" wird nun für 20sek kommentarlos geTimeoutet')
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '"' + towords + '" wird nun für 20sek kommentarlos geTimeoutet' })
  else bot.say(channel, '"' + towords + '" wird nun für 20sek kommentarlos geTimeoutet')
}
