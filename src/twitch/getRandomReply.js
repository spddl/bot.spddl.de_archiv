function getRandomReply (type, channel, from, user) {
  // console.info('getRandomReply('+type+', '+channel+', '+from)
  if (db.settingsprivate[channel.substr(1)].botsettings.randomreply || false) {
    // console.info("sending "+type+" message to "+channel);
    var message = ''
    if (type === 'swear') {
      message = settings.backtalk[Math.floor(Math.random() * settings.backtalk.length)]
      //       checkViolations(from);
    } else if (type === 'misc') {
      message = settings.quotes[Math.floor(Math.random() * settings.quotes.length)]
    }
    message = message.replace('{NICK}', from)
    if (from === 'Steam') steamSay(channel, message)
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: message })
    else bot.say(channel, message, 2)
  }
}
