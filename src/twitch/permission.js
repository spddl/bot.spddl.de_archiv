function permission (permission, msg, user, channel) {
  // if (!permission(cmd.permission, msg, user, channel)) {
  //   console.log('Abort!!!!!!!!')
  //   return
  // }

  if (permission.host === true) { // TODO: oder vergleich mit dem channel
    // console.info('permission.host: ' + msg)
    // if (user.badges) {
    //   console.log(user.badges.broadcaster)
    //   console.log(typeof user.badges.broadcaster)
    // }
    if (user.badges && user.badges.broadcaster === '1') {
      // console.log('host return true')
      return true
    }
  }
  if (permission.subscriber === true) {
    // console.info('permission.subscriber:', msg, user.subscriber)
    if (user.subscriber) {
      // console.log('host return subscriber')
      return true
    }
  }

  if (permission.turbo === true) {
    // console.info('permission.turbo:', msg, user.turbo)
    if (user.turbo) {
      return true
    }
  }

  if (permission.mod === true) {
    // console.info('permission.mod:', msg, user.mod)
    if (user.mod) {
      return true
    }
  }
  // if (permission.botmod !== true) {
  //   if (user.subscriber) {
  //     console.info('permission.botmodv: ' + msg); return false
  //     db.settingsprivate[channel.substr(1)].botsettings.mods.some((item) => { return item.toLowerCase() === user.username.toLowerCase() })) { console.info('permission.botmod: ' + msg); return false }
  //   }
  // }
  if (permission.viewer === true) {
    // console.info('permission.viewer: ', msg)
    return true
  }

  return false
}
