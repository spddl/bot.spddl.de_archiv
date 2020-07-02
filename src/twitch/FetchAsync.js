const FetchAsync = async function (result, cmdtext, msg, user, channel) {
  // try { var text = await Promise.all(result.map(Functions)) }
  // try { var text = await Promise.all(result.map(function(name) { return Functions(name, msg, user, channel) })) }

  if (cmdtext.indexOf('{warteschlange_start}') !== -1 ||
    cmdtext.indexOf('{warteschlange_list}') !== -1 ||
    cmdtext.indexOf('{warteschlange_add}') !== -1 ||
    cmdtext.indexOf('{warteschlange_remove}') !== -1) {
    if (!db.settingsprivate[channel.substr(1)].botsettings.warteschlange) {
      msg = 'Warteschlange deaktiviert'

      if (user.type === 'steam') steamSay(user, msg)
      else if (user.type === 'twitchgroup') bot.whisper(user.username, msg)
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: msg })
      else bot.say(channel, msg, 1)
      return
    }
  }

  try {
    var text = await Promise.all(result.map(function (name) { return AwaitFunctions(name, cmdtext, msg, user, channel) }))
  } catch (err) {
    console.error(err)
  }

  var resultobj = {}
  for (var i = 0; i < result.length; i++) { resultobj[result[i]] = text[i] }

  // console.log(resultobj)
  // console.log('msg',msg)
  // console.log('text',text)
  // console.log('cmdtext',cmdtext)
  // Ersetzt das Ergebnis der funktionen im Text
  msg = cmdtext.replace(PromiseType, function (matched) { return resultobj[matched.toLowerCase()] })

  console.log(channel, msg)

  if (user.type === 'steam') steamSay(user, msg)
  else if (user.type === 'twitchgroup') bot.whisper(user.username, msg)
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: msg })
  else bot.say(channel, msg, 1)

  // if (config.localhost()) { console.timeEnd('1') }
}
