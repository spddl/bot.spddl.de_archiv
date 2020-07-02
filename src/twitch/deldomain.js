function deldomain (channel, domain, user) {
  const array = settingsprivate[channel.substr(1)].botsettings.alloweddomains
  const index = array.indexOf(domain)
  if (index > -1) {
    array.splice(index, 1)
    savecommand_save()
    if (user.type === 'steam') steamSay(user, domain + ' ist nun auf der Blacklist')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, domain + ' ist nun auf der Blacklist')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: domain + ' ist nun auf der Blacklist' })
    else bot.say(channel, domain + ' ist nun auf der Blacklist')
  } else {
    if (user.type === 'steam') steamSay(user, domain + ' wurde auf der Whitelist nicht gefunden')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, domain + ' wurde auf der Whitelist nicht gefunden')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: domain + ' wurde auf der Whitelist nicht gefunden' })
    else bot.say(channel, domain + ' wurde auf der Whitelist nicht gefunden')
  }
}
