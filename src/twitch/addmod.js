function addmod (channel, name, user) {
  console.log('addmodfn: ' + channel + ' ' + name)
  // console.log(channel+' '+name)
  //  if(name !== undefined){name = name.toLowerCase()} // TODO}
  // settingsprivate[channel.substr(1)].botsettings.mods[name] = true
  settingsprivate[channel.substr(1)].botsettings.mods.push(name) // TODO TESTEN MODS
  savecommand_save()
  if (user.type === 'steam') steamSay(user, name + ' ist nun Moderator.')
  else if (user.type === 'twitchgroup') bot.whisper(user.username, name + ' ist nun Moderator.')
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: name + ' ist nun Moderator.' })
  else bot.say(channel, name + ' ist nun Moderator.')
}
