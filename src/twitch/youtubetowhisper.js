function youtubetowhisper (text, chan) {
  // console.log('youtubetowhisper('+text+', '+chan+')');
  var id
  if (text.indexOf('?v=') !== -1) {
    id = text.substr(text.indexOf('?v=') + 3) // bis zum ? / &
  } else {
    id = text.substr(text.indexOf('youtu.be/') + 9) // bis zum ? / &
    id = id.split('?')
    id = id[0]
  }

  id = id.split(' ')
  id = id[0]

  // console.info('yt '+chan+', '+text+', '+id)
  request({ url: 'https://www.googleapis.com/youtube/v3/videos?key=' + config.youtubekey + '&part=snippet&id=' + id, json: true }, function (err, res, body) {
    if (err !== null) { console.emergency('youtubetowhisper err: ' + err) }
    if (body !== undefined) { // Steam API Down?
      try {
        if (body.items && body.items[0] === undefined) { console.warn('body.items[0] === undefined'); return }
        bot.whisper(chan.substr(1), body.items[0].snippet.title)
      } catch (e) {
        console.warn('yt ' + chan + ', ' + text + ',   https://www.googleapis.com/youtube/v3/videos?key=' + config.youtubekey + '&part=snippet&id=' + id)
        console.warn(e)
      }
    } else {
      console.log('yt API is down.')
    }
  })
}
