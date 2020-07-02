function banwordsCheck (channel, words) {
  // console.log('banwordsCheck('+channel+', '+words+')')
  if (db.settingsprivate[channel.substr(1)].botsettings.banwords.length === 0) return false
  //  console.info('.length !== 0 '+commands[channel.substr(1)].botsettings.banwords.length)
  //  console.info('banwordsCheck: '+channel+', '+words.toLowerCase())
  words = ' ' + words + ' ' // TODO work-a-round eignetlich muss ich die Trim funktion auf der Webseite umgehen
  for (var i = 0; i < db.settingsprivate[channel.substr(1)].botsettings.banwords.length; ++i) { // Admins überprüfen
    // console.info('[i] '+i)
    // console.info('banwords[i] '+commands[channel.substr(1)].botsettings.banwords[i].toLowerCase())

    if (words.toLowerCase().indexOf(db.settingsprivate[channel.substr(1)].botsettings.banwords[i].toLowerCase()) !== -1) {
      // console.info('banwordsCheck gefunden: '+channel+' '+words)
      return true
    }
  }
  // console.info('banwordsCheck nicht gefunden '+channel+' '+words)
  return false
}
