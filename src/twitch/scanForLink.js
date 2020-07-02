function scanForLink (text, chan, user) {
  if (user.type === 'discord') { return true }
  // console.log('scanForLink: %j',user);

  // if ('spddl' == user.username) {
  if (user.username === 'faceit_gg') { // "FACEIT_GG" started playing a csgo match on FACEIT. Match:
    return true
  }
  // const re = /([a-z0-9_-]+\.)+[a-z]{2,4}\/[^ ]*|(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\s|^)((https?:\/\/|www\.)+[a-z0-9_.\/?=&-]+)/gi
  const re = /([a-z0-9_-]+\.)+[a-z]{2,4}\/[^ ]*|(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])|(\s|^)((https?:\/\/|www\.)+[a-z0-9_./?=&-]+)/gi
  // var re = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  // var re = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|coop|de|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|tv|local|internal|xxx|me))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@\/?]*)?)(\s+|$)/gi;
  // console.info('text.match(re) '+text.match(re));
  if (text.match(re) !== null) {
    if (db.settingsprivate[chan.substr(1)].botsettings.youtubetowhisper && true) {
      if ((text.toLowerCase().indexOf('youtube.com') >= 0) || (text.toLowerCase().indexOf('youtu.be') >= 0)) {
        if (user.type !== 'discord') youtubetowhisper(text, chan)
      }
    }

    var array = db.settingsprivate[chan.substr(1)].botsettings.alloweddomains || []
    var len = array.length
    for (var i = 0; i < array.length; i++) {
      if (text.indexOf(array[i]) !== -1) {
        // console.info(text + ' [Link OK]')
        return true
      }
      if (i === len) {
        console.warn(text + ' [TIMEOUT]')
        return false
      }
    }
  } else {
    return true
  }
}
