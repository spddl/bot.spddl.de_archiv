function giveaway (channel, time, user) {
  // TODO
  time = time * 1000
  bot.say(channel, '.me GIVEAWAY!! GIVEAWAY!!')
  bot.say(channel, '.me Jeder Viewer der etwas im Chat schreibt ist dabei egal ob Sub, Mod oder Normalo Viewer')
  if (user.type === 'steam') steamSay(user, 'Jeder Viewer der etwas im Chat schreibt ist dabei egal ob Sub, Mod oder Normalo Viewer')

  settings[channel.substr(1)].giveawaysimple = true
  setTimeout(function () {
    var winner = settings[channel.substr(1)].giveawaymembers[Math.floor(Math.random() * settings[channel.substr(1)].giveawaymembers.length)]
    if (winner === undefined) { winner = 'es hat niemand teilgenommen.' }
    console.info('The Winner Is… ' + winner)
    bot.say(channel, '.me es haben ' + settings[channel.substr(1)].giveawaymembers.length + ' Viewer teilgenommen')
    // bot.say(channel,'/me The Winner Is… '+winner.name+' mit: '+winner.msg);
    bot.say(channel, '.me The Winner Is… ' + winner)

    settings[channel.substr(1)].giveawaysimple = false
    settings[channel.substr(1)].giveawaymembers.length = 0
  }, time)
}
