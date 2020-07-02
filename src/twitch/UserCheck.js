function UserCheck (user, channel, type) {
  // ERROR CHECK
  if (config.localhost()) {
    // if (user.type == "twitch") {
    if (!(user.subscriber === true || user.subscriber === false)) { console.warn('user.subscriber, is NOT Boolean') }
    if (!(user.turbo === true || user.turbo === false)) { console.warn('user.turbo, is NOT Boolean') }
    // }
  }

  try { // True Darf das Limit überschreiten
    if (user.subscriber && (db.settingsprivate[channel.substr(1)].botsettings[type].indexOf('sub') !== -1)) return true
    if (user.turbo && (db.settingsprivate[channel.substr(1)].botsettings[type].indexOf('tur') !== -1)) return true
    if (db.settingsprivate[channel.substr(1)].botsettings[type].indexOf('vie') !== -1) return true
    return false
  } catch (e) { // jeder der das nicht definiert hat
    // console.warn(e.message);
    // console.log(channel+' - '+type+', %j',user);
    return false
  }
}
