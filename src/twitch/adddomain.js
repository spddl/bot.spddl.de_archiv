function adddomain (channel, domain, user) {
  console.info(channel + ' ' + domain)
  for (var i in settingsprivate[channel.substr(1)].botsettings.alloweddomains) { // ob domain schon vorhanden ist
    if (db.settingsprivate[channel.substr(1)].botsettings.alloweddomains[i] === domain) {
      if (user.type === 'steam') steamSay(user, domain + ' gibt es schon auf der Whitelist')
      else if (user.type === 'twitchgroup') bot.whisper(user.username, domain + ' gibt es schon auf der Whitelist')
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: domain + ' gibt es schon auf der Whitelist' })
      else bot.say(channel, domain + ' gibt es schon auf der Whitelist')
      return
    }
  }

  settingsprivate[channel.substr(1)].botsettings.alloweddomains.push(domain)
  savecommand_save()
  if (user.type === 'steam') steamSay(user, domain + ' ist nun auf der Whitelist')
  else if (user.type === 'twitchgroup') bot.whisper(user.username, domain + ' ist nun auf der Whitelist')
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: domain + ' ist nun auf der Whitelist' })
  else bot.say(channel, domain + ' ist nun auf der Whitelist')
}
