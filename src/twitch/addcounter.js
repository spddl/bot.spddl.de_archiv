function addcounter (channel, cmd, user) {
  // console.info('addcounter fn: '+channel+', '+cmd+', '+user)

  cmd = cmd.substr(11)
  var n = cmd.indexOf(' ')
  instruction = cmd.substr(0, n)
  instruction = instruction.toLowerCase()
  value = cmd.substr(++n)

  if (commands[channel.substr(1)].counter[instruction]) { // console.log('diesen Counter gibt es schon');
    if (Object.keys(commands[channel.substr(1)].counter[instruction])[0] === [value]) { // console.log('auch der Text ist gleich');
      if (user.type === 'steam') steamSay(user, 'Diesen Counter gibt es schon.')
      else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Diesen Counter gibt es schon.')
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Diesen Counter gibt es schon.' })
      else bot.say(channel, 'Diesen Counter gibt es schon.')
      return
    } else { // console.log('anderer Text');
      commands[channel.substr(1)].counter = _.extend(commands[channel.substr(1)].counter, { [instruction]: { [value]: 0 } }) // TODO kann man evtl. verkürzen
      if (user.type === 'steam') steamSay(user, 'Der neue Text wurde übernommen, der Counter wurde nicht Resetet')
      else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Der neue Text wurde übernommen, der Counter wurde nicht Resetet')
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Der neue Text wurde übernommen, der Counter wurde nicht Resetet' })
      else bot.say(channel, 'Der neue Text wurde übernommen, der Counter wurde nicht Resetet')
    }
  } else { // console.log('neuer Counter');
    commands[channel.substr(1)].counter = _.extend(commands[channel.substr(1)].counter, { [instruction]: { [value]: 0 } })
    if (user.type === 'steam') steamSay(user, 'Counter !' + instruction + ' wurde übernommen und fängt bei 0 an.')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Counter !' + instruction + ' wurde übernommen und fängt bei 0 an.')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Counter !' + instruction + ' wurde übernommen und fängt bei 0 an.' })
    else bot.say(channel, 'Counter !' + instruction + ' wurde übernommen und fängt bei 0 an.')
  }
  command_save()
}
