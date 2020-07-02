function textScan (text, channel, from, user) {
  for (var i = 0; i < settings.botNick.length; i++) {
    var nameCheck = text.toLowerCase().match(settings.botNick[i])
    if (nameCheck !== null) {
      getRandomReply('misc', channel, from, user)
      return
    }
  }
  // swearCheck(text, channel, from);
}
