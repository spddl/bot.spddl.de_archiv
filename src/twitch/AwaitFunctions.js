const AwaitFunctions = function (name, cmdtext, msg, user, channel) {
  return new Promise(resolve => {
    channel = channel.substr(1) // entfernt die #
    // console.log('%j',user)
    console.log('Functions: name;' + name + ', text;' + cmdtext + ', msg;' + msg + ', channel;' + channel)
    // Functions: name;{counter}, text;hat nun schon {counter} mal wow gesagt!!, msg;!wow, channel;spddl_bot
    // console.log(util.inspect(user, false, null, true))
    // console.log( msg.substr(1).split(' ')[0] ); // Nur der Befehl
    // follow => ich brauche nur den String von msg ab der ersten leerzeile
    // (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '')
    let msgarr
    switch (name.toLowerCase()) { // TODO: moar
      case '{nick}':
        resolve(user['display-name'] || user.username)
        break
      case '{userid}': // debug
        console.log(user)
        resolve(user['user-id'])
        break
      case '{arg}':
        resolve((msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''))
        break
      case '{add}':
        // resolve(cmd.add(user, channel, msg))
        resolve(cmd.add(user, channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '')))
        break
      case '{del}':
        // done(cmd.add(user, channel, msg))
        resolve(cmd.del(user, channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '')))
        break
      case '{pubg}': // username, action, platform, mode
        msgarr = msg.split(' ')
        resolve(cmd.pubg(msgarr[0], msgarr[1], msgarr[2], msgarr[3], msgarr[4]))
        break
      case '{mm}':
        resolve(cmd.mm())
        break
      case '{uptime}':
        resolve(cmd.uptime(channel, ClientID))
        break
      case '{subage}':
        resolve(cmd.subage(user, channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''), ClientID)) // TODO: Kirby only?
        break
      case '{subs}':
        resolve(cmd.subs(user, channel, ClientID)) // TODO: Kirby only? // TODO target
        break
      case '{follow}':
      case '{follower}':
        // TODO: msg.replace(text, '')
        // console.log('target?? ' + (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '' ))
        resolve(cmd.follower(user, channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''), ClientID))
        break
      case '{twitchstatus}':
        resolve(cmd.twitchstatus(channel, user, ClientID))
        break
      case '{titelchange}':
        resolve(cmd.titelchange(channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''), ClientID))
        break
      case '{gamechange}':
        resolve(cmd.gamechange(channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''), ClientID))
        break
      case '{permit}':
        resolve(permit(user, channel, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '')))
        break
      case '{steaminvite}': // TODO Kirby only
        resolve(SteamInvite(user, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : '')))
        break
      case '{counter}':
        // wäre gut wenn der Streamer ein Dropdown menu/Input Feld und ein Input Feld bekommt
        resolve(cmd.counter(channel, msg))
        break
      case '{streamstart}':
        user.channel = channel.substr(1)
        steamStart(user, (msg.indexOf(' ') !== -1 ? msg.substr(msg.indexOf(' ') + 1) : ''))
        resolve('')
        break
      case '{weather}':
        msgarr = msg.split(' ')
        resolve(cmd.weather(channel, user, msgarr[1], msgarr[2]))
        break

      case '{warteschlange_start}':
        if (!db.settingsprivate[channel].botsettings.warteschlange) { console.log('warteschlange off'); return resolve('Warteschlange deaktiviert') }
        msgarr = msg.split(' ')
        resolve(cmd.warteschlange_start(channel, msgarr[1]))
        break
      case '{warteschlange_list}': // !warteschlange = Anzahl in der Warteschlange
        console.log(db.settingsprivate[channel].botsettings.warteschlange)
        // if (!db.settingsprivate[channel].botsettings.warteschlange) { console.log('warteschlange off'); return resolve('') }
        resolve(cmd.warteschlange_list(channel, false))
        break
      case '{warteschlange_add}': // !gamen zum Eintragen in die Liste
        if (!db.settingsprivate[channel].botsettings.warteschlange) { console.log('warteschlange off'); return resolve('') }
        msgarr = msg.split(' ')
        resolve(cmd.warteschlange_add(user, channel, msgarr[1]))
        break
      case '{warteschlange_remove}':
        if (!db.settingsprivate[channel].botsettings.warteschlange) { console.log('warteschlange off'); return resolve('') }
        msgarr = msg.split(' ')
        resolve(cmd.warteschlange_remove(user, channel, msgarr[1]))
        break
      case '{warteschlange_toggle}':
        msgarr = msg.split(' ')
        resolve(cmd.warteschlange_toggle(channel, msgarr[1]))
        break

      case '{faceitelo}':
        resolve(cmd.faceitelo(channel))
        break

      case '{faceitmatchlink}':
        resolve(cmd.faceitmatchlink(channel))
        break

      case '{test}':
        resolve(cmd.test())
        break
      default:
        resolve()
    }
  })
}
