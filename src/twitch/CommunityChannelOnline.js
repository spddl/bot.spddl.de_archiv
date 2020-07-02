function CommunityChannelOnline () {
  // kirby.botsettings.CommunityStreams
  if (!db.settingsprivate.kirby.botsettings.CommunityStreams) { return }
  const channels = db.settingsprivate.kirby.botsettings.CommunityStreams.split(',') || []
  let temparr = _.shuffle(channels)

  for (let i = 0, len = channels.length; i < len; i++) {
    if (!KirbyCommunityChannel[channels[i]]) {
      KirbyCommunityChannel[channels[i]] = {
        status: false,
        OnCount: 0,
        minOnlineCount: 5,
        OffCount: 0,
        minOfflineCount: 5
      }
    }
  }
  // console.log('KirbyCommunityChannel', temparr)

  const tempIsLive = []
  // curl -H 'Client-ID: ' -X GET 'https://api.twitch.tv/helix/streams?user_login=kirby'
  // curl -H 'Client-ID: ' -X GET 'https://api.twitch.tv/helix/streams?user_login=kirby&user_login=lirik'
  // https://api.twitch.tv/helix/streams?client_id=&user_login=kirby

  //  , Authorization: `Bearer ${global.oauth}`
  // , Authorization:
  requestjson.createClient('https://api.twitch.tv/helix/').get('streams?user_login=' + temparr.join('&user_login='), { headers: { 'Client-ID': ClientID, Authorization: `Bearer ${global.oauth}` } }, function (err, res, body) { // hole mir die Aktuellen Daten aus der Steam API
    if (err) { console.warn('CommunityChannelOnline', err); return }
    if ((body !== undefined) && (res.statusCode === 200)) { // twitch API Down?
      for (let i = 0, len = body.data.length; i < len; i++) { // Check wer alles Online ist
        const player = body.data[i].user_name.toLowerCase() // ohne #

        if (!KirbyCommunityChannel[player]) {
          KirbyCommunityChannel[player] = {
            status: false,
            OnCount: 0,
            minOnlineCount: 5,
            OffCount: 0,
            minOfflineCount: 5
          }
        }

        if (!KirbyCommunityChannel[player].status) {
          if (KirbyCommunityChannel[player].OnCount < KirbyCommunityChannel[player].minOnlineCount) {
            KirbyCommunityChannel[player].OnCount++
            console.log('player ' + player + ' OnCount: ' + KirbyCommunityChannel[player].OnCount + ', OffCount: ' + KirbyCommunityChannel[player].OffCount)
            KirbyCommunityChannel[player].OffCount = 0
          }
          if (KirbyCommunityChannel[player].OnCount >= KirbyCommunityChannel[player].minOnlineCount) {
            KirbyCommunityChannel[player].status = true
            KirbyCommunityChannel[player].OnCount = 0
            KirbyCommunityChannel[player].OffCount = 0

            if (start) {
              log.separator('Community: ' + player + ' is Online ', 'notice')
              // DISCORD
              dc.sendMessage({ to: '479934273458143242', message: '`[' + player + ' ist Online]` https://www.twitch.tv/' + player })

              // console.log(settings)
            } else {
              // console.log(util.inspect(KirbyCommunityChannel[player].online, false, null, true))
              // if (!KirbyCommunityChannel[player].status) {
              log.notice('Community' + player + ' ist Online')
              // }
            }
          }
        }
        tempIsLive.push(player)
        temparr = temparr.filter(function (e) { return e !== player }) // löscht die die Online sind
      }

      for (let i = 0, len = temparr.length; i < len; i++) { // Check wer alles Offline ist
        const player = temparr[i] // .substr(1) // mit #
        if (KirbyCommunityChannel[player].status) {
          if (KirbyCommunityChannel[player].OffCount < KirbyCommunityChannel[player].minOfflineCount) {
            KirbyCommunityChannel[player].OffCount++
            console.log('player ' + player + ' OffCount: ' + KirbyCommunityChannel[player].OffCount + ', OnCount: ' + KirbyCommunityChannel[player].OnCount)
            KirbyCommunityChannel[player].OnCount = 0
          }
          if (KirbyCommunityChannel[player].OffCount >= KirbyCommunityChannel[player].minOfflineCount) {
            KirbyCommunityChannel[player].status = false
            KirbyCommunityChannel[player].OffCount = 0
            KirbyCommunityChannel[player].OnCount = 0
            log.separator('Community: ' + player + ' ist OFFLINE ', 'notice')
            // console.log(settings)
          }
        }
      }
    } else { // TODO name ist falsch und wird gelöscht
      try {
        console.log('CommunityChannelOnline', 'https://api.twitch.tv/helix/streams?user_login=' + temparr.join(','))
        console.warn('res.statusCode', res.statusCode)
        console.warn('headers', { 'Client-ID': ClientID, Authorization: `Bearer ${global.oauth}` })
        console.warn('body', body)
        console.warn('err', err)
      } catch (e) {
        console.log(e)
      }
    }
  })
}
