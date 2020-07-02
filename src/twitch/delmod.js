function delmod (channel, name, user) {
  console.log('delmodfn: ' + channel + ' ' + name)
  //  if(name !== undefined){name = name.toLowerCase()} // TODO}
  // delete settingsprivate[channel.substr(1)].botsettings.mods[name]
  settingsprivate[channel.substr(1)].botsettings.mods = _.without(db.settingsprivate[channel.substr(1)].botsettings.mods, name) // TODO TESTEN MODS
  savecommand_save()
  if (user.type === 'steam') steamSay(user, name + ' ist nun kein Moderator mehr.')
  else if (user.type === 'twitchgroup') bot.whisper(user.username, name + ' ist nun kein Moderator mehr.')
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: name + ' ist nun kein Moderator mehr.' })
  else bot.say(channel, name + ' ist nun kein Moderator mehr.')
}
