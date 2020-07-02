function delcounter (channel, cmd, user) {
  delete commands[channel.substr(1)].counter[cmd.substr(11)]

  command_save()

  if (user.type === 'steam') steamSay(user, 'Counter !' + cmd + ' wurde gelöscht.')
  else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Counter !' + cmd + ' wurde gelöscht.')
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Counter !' + cmd + ' wurde gelöscht.' })
  else bot.say(channel, 'Counter !' + cmd + ' wurde gelöscht.')
}
