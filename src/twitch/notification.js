function notification (channel, type, user) {
  // TODO testen
  db.settingsprivate[channel].botsettings.alerts[type] = !db.settingsprivate[channel].botsettings.alerts[type]
  if (type === 'chat') {
    console.info('notification TwitchChat toggle')
    if (user.type === 'Steam') steamSay(user, db.settingsprivate[channel].botsettings.alerts[type] === true ? 'Benachrichtigung im TwitchChat ist nun eingeschaltet' : 'Benachrichtigung im TwitchChat ist nun ausgeschaltet')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, db.settingsprivate[channel].botsettings.alerts[type] === true ? 'Benachrichtigung im TwitchChat ist nun eingeschaltet' : 'Benachrichtigung im TwitchChat ist nun ausgeschaltet')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: db.settingsprivate[channel].botsettings.alerts[type] === true ? 'Benachrichtigung im TwitchChat ist nun eingeschaltet' : 'Benachrichtigung im TwitchChat ist nun ausgeschaltet' })
    else bot.say('#' + channel, db.settingsprivate[channel].botsettings.alerts[type] === true ? 'Benachrichtigung im TwitchChat ist nun eingeschaltet' : 'Benachrichtigung im TwitchChat ist nun ausgeschaltet')
  } else { // steam
    console.info('notification steam toggle')
    steamSay(user, db.settingsprivate[channel].botsettings.alerts[type] === true ? 'Steam notification sind nun eingeschaltet' : 'Steam notification sind nun ausgeschaltet')
  }
  db.savecommand_save()
}
