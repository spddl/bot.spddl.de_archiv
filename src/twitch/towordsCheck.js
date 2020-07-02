function towordsCheck (channel, words) {
  if (db.settingsprivate[channel.substr(1)].botsettings.towords.length === 0) return false
  words = ' ' + words + ' '
  for (var i = 0; i < db.settingsprivate[channel.substr(1)].botsettings.towords.length; ++i) { // Admins überprüfen
    if (words.toLowerCase().indexOf(db.settingsprivate[channel.substr(1)].botsettings.towords[i].toLowerCase()) !== -1) {
      // console.info('banwordsCheck gefunden: '+channel+' '+words)
      return true
    }
  }
  // console.info('banwordsCheck nicht gefunden '+channel+' '+words)
  return false
}
