function getStatus (channel, user) {
  console.info('getStatus(' + channel + ', ' + user)
  // bot.say(channel,"ItsBoshyTime I have been running since: "+startTime.toDateString()+" "+startTime.toLocaleTimeString()+ ' CST');
  if (user.type === 'steam') steamSay(user, ':steamhappy: I have been running since: ' + utc)
  else if (user.type === 'twitchgroup') bot.whisper(user.username, 'ItsBoshyTime I have been running since: ' + utc)
  else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'ItsBoshyTime I have been running since: ' + utc })
  else bot.say(channel, 'ItsBoshyTime I have been running since: ' + utc)
}
