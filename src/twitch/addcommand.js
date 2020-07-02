function addcommand (channel, cmd, user) {
  // console.info(channel+', '+cmd+', %j',user)
  console.info(channel + ', ' + cmd)
  // var newcmd = cmdall.substr(++cmd[0].length)

  if (db.settingsprivate[channel.substr(1)].botsettings.addtoggle) {
    cmd = cmd.substr(4)
    console.log('toggle aktiv:' + cmd)
  }

  // cmd = cmd.substr(4);

  console.log('[' + cmd + ']')
  var n = cmd.indexOf(' ')
  instruction = cmd.substr(0, n)
  instruction = instruction.toLowerCase()
  // console.log('['+instruction+']')
  value = cmd.substr(++n)
  // console.info('value: |'+value)
  // console.info('value.length: |'+value.length)
  // console.log('['+value+']')
  commands[channel.substr(1)].cmd[instruction] = value
  command_save()
  // bot.say(channel, 'Command !'+instruction+' ['+value+'] wurde übernommen.')

  if (user.type === 'steam') steamSay(user, 'Command !' + instruction + ' [' + value + '] wurde übernommen.')
  else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Command !' + instruction + ' [' + value + '] wurde übernommen.')
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Command !' + instruction + ' [' + value + '] wurde übernommen.' })
  else bot.say(channel, 'Command !' + instruction + ' [' + value + '] wurde übernommen.')
}
