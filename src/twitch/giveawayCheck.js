function giveawayCheck (user, channel) {
  // console.log('giveawayCheck('+user.username+', '+channel+')');
  if (!db.settingsprivate[channel.substr(1)].botsettings.giveaway.host === true || false) if (user.username === channel.substr(1)) return false
  if (!db.settingsprivate[channel.substr(1)].botsettings.giveaway.mod === true && true) if (user['user-type'] === 'mod') return false
  if (!db.settingsprivate[channel.substr(1)].botsettings.giveaway.subscriber === true && true) if (user.subscriber === 1) return false
  if (!db.settingsprivate[channel.substr(1)].botsettings.giveaway.turbo === true && true) if (user.turbo === 1) return false
  if (db.settingsprivate[channel.substr(1)].botsettings.giveaway.viewer === true && true) return true
  else return false
}
