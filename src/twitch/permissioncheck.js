function permissioncheck (msg, user, channel) {
  'use strict'

  // if (config.localhost()) { log.debug('permissioncheck: ' + msg + ', ' + channel + ', %j', user); console.time('1') }
  // console.log('permissioncheck: ' + msg + ', ' + channel + ', %j', user) // console.time('1')
  const cmd = db.commands[channel.substr(1)].cmd[msg.split(' ')[0]] // TODO dann MUSS der einzugebene Text mit einem Befehl anfangen
  // console.log('permissioncheck', cmd)

  if (cmd) {
    if (cmd.permission) {
      const p = permission(cmd.permission, msg, user, channel)
      // console.log('permission p', p) // true
      if (!p) {
        console.log('Abort!!!!!!!! permission func, keine Rechte')
        return
      }

      // if (cmd.permission.host !== true) { // TODO: oder vergleich mit dem channel
      //   if (user.badges && user.badges.broadcaster !== 1) {
      //     console.info('permission.host: ' + msg)
      //     return false
      //   }
      // }
      // if (cmd.permission.subscriber !== true) {
      //   if (!user.subscriber) {
      //     console.info('permission.subscriber: ' + msg); return false
      //   }
      // }

      // if (cmd.permission.turbo !== true) {
      //   if (!user.turbo) {
      //     console.info('permission.turbo: ' + msg); return false
      //   }
      // }

      // if (cmd.permission.mod !== true) {
      //   if (!user.mod) {
      //     console.info('permission.mod: ' + msg); return false
      //   }
      // }
      // // if (cmd.permission.botmod !== true) {
      // //   if (user.subscriber) {
      // //     console.info('permission.botmodv: ' + msg); return false
      // //     db.settingsprivate[channel.substr(1)].botsettings.mods.some((item) => { return item.toLowerCase() === user.username.toLowerCase() })) { console.info('permission.botmod: ' + msg); return false }
      // //   }
      // // }
      // if (cmd.permission.viewer !== true) {
      //   console.info('permission.viewer: ' + msg); return false
      // }

      // if ((!cmd.permission.host || cmd.permission.host === false) && (user.badges && user.badges.broadcaster === 1)) { console.info('permission.host: ' + msg); return false } // TODO: oder vergleich mit dem channel
      // if ((!cmd.permission.subscriber || cmd.permission.subscriber === false) && user.subscriber) { console.info('permission.subscriber: ' + msg); return false }
      // if ((!cmd.permission.turbo || cmd.permission.turbo === false) && user.turbo) { console.info('permission.turbo: ' + msg); return false }
      // if ((!cmd.permission.mod || cmd.permission.mod === false) && user.mod) { console.info('permission.mod: ' + msg); return false }
      // if ((!cmd.permission.botmod || cmd.permission.botmod === false) && db.settingsprivate[channel.substr(1)].botsettings.mods.some((item) => { return item.toLowerCase() === user.username.toLowerCase() })) { console.info('permission.botmod: ' + msg); return false }
      // if (!cmd.permission.viewer || cmd.permission.viewer === false) { console.info('permission.viewer: ' + msg); return false }
    }

    const FunctionsFound = PromiseType[Symbol.match](cmd.text)
    // console.log('FunctionsFound', FunctionsFound)

    if (FunctionsFound) { // !null
      FetchAsync(uniqArray(FunctionsFound), cmd.text, msg, user, channel)
    } else { // Text Command ohne Funktion
      if (user.type === 'steam') steamSay(user, cmd.text)
      else if (user.type === 'twitchgroup') bot.whisper(user.username, cmd.text)
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: cmd.text })
      else bot.say(channel, cmd.text, 1)
      // if (config.localhost()) { console.timeEnd('1') }
    }

    return true
  } /* else {
    if (config.localhost()) { console.warn('kein Befehl gefunden: '+msg); console.timeEnd('1'); }
    return false
  } */
}

// function permission_x (permission, msg, user, channel) {
//   if ((!permission.host || permission.host === false) && (user.badges && user.badges.broadcaster === 1)) { console.info('permission.host: ' + msg); return false } // TODO: oder vergleich mit dem channel
//   if ((!permission.subscriber || permission.subscriber === false) && user.subscriber) { console.info('permission.subscriber: ' + msg); return false }
//   if ((!permission.turbo || permission.turbo === false) && user.turbo) { console.info('permission.turbo: ' + msg); return false }
//   if ((!permission.mod || permission.mod === false) && user.mod) { console.info('permission.mod: ' + msg); return false }
//   if ((!permission.botmod || permission.botmod === false) && db.settingsprivate[channel.substr(1)].botsettings.mods.some((item) => { return item.toLowerCase() === user.username.toLowerCase() })) { console.info('permission.botmod: ' + msg); return false }
//   // if (!permission.viewer || permission.viewer === false) { console.info('permission.viewer: ' + msg); return false }
//   // console.info('permission.true: ' + msg)
//   return true
// }
