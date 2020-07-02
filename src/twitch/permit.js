function permit (user, channel, msg) {
  return new Promise(function (resolve) {
    msg = msg.substr(msg.indexOf(' ') + 1)
    user = msg.toLowerCase()

    try {
      console.log(msg, user)
      console.log(settings[channel].allowing)
    } catch (error) {
      console.warn('permit error', error)
    }

    if (!settings[channel].allowing) settings[channel].allowing = []
    settings[channel].allowing.push(user) // TypeError: Cannot read property 'push' of undefined
    resolve('.me is allowing links from ' + user + ' (2min)')
    setTimeout(noMoreLinks, 120 * 1000, user, channel)
  })
}
