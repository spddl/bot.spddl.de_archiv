function noMoreLinks (user, channel) {
  bot.say(channel, '.me is no longer accepting links from ' + user, 1)
  settings[channel].allowing = _.without(settings[channel].allowing, user)
}
