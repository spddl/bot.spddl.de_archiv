function deletecommand (channel, cmd, user) {
  delete commands[channel.substr(1)].cmd[cmd]
  command_save()
  if (user.type === 'steam') steamSay(user, 'Command !' + cmd + ' wurde gelöscht.')
  else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Command !' + cmd + ' wurde gelöscht.')
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Command !' + cmd + ' wurde gelöscht.' })
  else bot.say(channel, 'Command !' + cmd + ' wurde gelöscht.')
}
