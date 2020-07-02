const TwitchRealtime = require('twitch-realtime') // https://docs.fuechschen.org/twitch-realtime/TwitchRealtime.html

// TODO:
// channels: config.localhost() ? (localhostobj.twitch ? ['#spddl_bot', '#spddl'] : []) : db.settings.channels // botchannels TODO:
const TwitchRealtimeOptions = { // https://dev.twitch.tv/docs/pubsub
  // defaultTopics: db.settings.channels.map(chan => `video-playback.${chan.substr(1)}`)
  defaultTopics: db.settings.channels.map(chan => `video-playback.${chan.substr(1)}`).concat(db.settingsprivate.kirby.botsettings.CommunityStreams.split(',').map(chan => `video-playback.${chan}`))
}
let TRT = new TwitchRealtime(TwitchRealtimeOptions)

TRT.on('connect', () => {
  // TODO: topicCount
  console.log(new Date().toJSON(), 'connect')
})

TRT.on('stream-down', data => {
  const chan = data.channel
  if (db.settings.channels.indexOf(`#${chan}`) !== -1) {
    log.separator(` ${chan} ist OFFLINE (TRT)`, 'notice')
    settings[chan].online.status = false
    settings[chan].online.OffCount = 0
    settings[chan].online.OnCount = 0

    // DISCORD
    console.log(`db.settingsprivate[${chan}].botsettings.discord.onlinemsg`, db.settingsprivate[chan].botsettings.discord.onlinemsg)
    if (db.settingsprivate[chan].botsettings.discord.onlinemsg || false) {
      dc.sendMessage({ to: db.settingsprivate[chan].botsettings.discord.onlinemsg, message: db.settingsprivate[chan].botsettings.discord.offline })
    } else {
      dc.sendMessage({ to: db.settingsprivate[chan].botsettings.discord.onlinemsg, message: '`[' + chan + ' ist Offline]`' })
    }
  } else if (db.settingsprivate.kirby.botsettings.CommunityStreams.split(',').indexOf(chan) !== -1) {
    log.separator(` Community: ${chan} is OFFLINE (TRT) `, 'notice')
    KirbyCommunityChannel[chan].status = false
    KirbyCommunityChannel[chan].OffCount = 0
    KirbyCommunityChannel[chan].OnCount = 0
  } else {
    console.warn('unbekannter Channel')
  }
  // if (settings[chan]) {
  //   console.log('TRT', settings[chan])
  // } else if (KirbyCommunityChannel[chan]) {
  //   console.log('TRT', KirbyCommunityChannel[chan])
  // }
})

TRT.on('stream-up', data => {
  // console.log(new Date().toJSON(), 'stream-up', data)
  const chan = data.channel
  if (db.settings.channels.indexOf(`#${chan}`) !== -1) {
    settings[chan].online.status = true
    settings[chan].online.OnCount = 0
    settings[chan].online.OffCount = 0

    if (start) {
      log.separator(` ${chan} is Online (TRT) `, 'notice')

      // Warteschlange Kirby
      if (chan === 'kirby') {
        cmd.warteschlange_clear(chan)
      }

      // STEAM
      if (db.settingsprivate[chan].botsettings.automaticannouncements || false) {
        steamStart({ username: 'AutomaticAnnouncements_' + chan, channel: chan }, '')
      }

      // DISCORD
      // console.log(`db.settingsprivate[${chan}].botsettings.discord.onlinemsg ${db.settingsprivate[chan].botsettings.discord.onlinemsg}`)
      if (db.settingsprivate[chan].botsettings.discord.onlinemsg || false) {
        if (db.settingsprivate[chan].botsettings.discord.onlinemsg) {
          dc.sendMessage({ to: db.settingsprivate[chan].botsettings.discord.onlinemsg, message: db.settingsprivate[chan].botsettings.discord.online })
        } else {
          dc.sendMessage({ to: db.settingsprivate[chan].botsettings.discord.onlinemsg, message: '`[' + chan + ' ist Online]` https://www.twitch.tv/' + chan })
        }
      }
    } else {
      log.notice(` ${chan} is Online (TRT) `)
    }
  } else if (db.settingsprivate.kirby.botsettings.CommunityStreams.split(',').indexOf(chan) !== -1) {
    KirbyCommunityChannel[chan].status = true
    KirbyCommunityChannel[chan].OnCount = 0
    KirbyCommunityChannel[chan].OffCount = 0
    if (start) {
      log.separator(` Community: ${chan} is Online (TRT) `, 'notice')
      // DISCORD
      dc.sendMessage({ to: '479934273458143242', message: '`[' + chan + ' ist Online]` https://www.twitch.tv/' + chan })
    } else {
      log.notice(' Community' + chan + ' ist Online (TRT) ')
    }
  } else {
    console.warn('unbekannter Channel (TRT)')
  }
  if (settings[chan]) {
    console.log('TRT', settings[chan])
  } else if (KirbyCommunityChannel[chan]) {
    console.log('TRT', KirbyCommunityChannel[chan])
  }
})
// TRT.on('viewcount', data => { console.log(new Date().toJSON(), 'viewcount', data) }) //  viewcount { time: 1577307422.873425, channel: 'schulzew', viewers: 0 }
TRT.on('warn', data => { console.log(new Date().toJSON(), 'warn', data) })
TRT.on('whisper', data => { console.log(new Date().toJSON(), 'whisper', data) })
TRT.on('bits', data => { console.log(new Date().toJSON(), 'bits', data) })
TRT.on('close', data => { console.log(new Date().toJSON(), 'close', data) })
TRT.on('debug', data => { console.log(new Date().toJSON(), 'debug', data) })
TRT.on('raw', data => {
  // console.log(new Date().toJSON(), 'raw', data)
  // if (data.type !== 'PONG') {
  //   if (data.type === 'MESSAGE' && (data.data.message.indexOf('{"type":"viewcount",') === 0 || data.data.message.indexOf('{"type":"commercial",') === 0)) {
  //     // ignore
  //   } else {
  //     console.log(new Date().toJSON(), 'TwitchRealtime', data)
  //   }
  // }
})

const readyState = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']
// if (!config.localhost() || localhostobj.steam) {
setInterval(() => {
  if (TRT._ws.readyState !== 1) {
    console.warn('TRT._ws.readyState', readyState[TRT._ws.readyState]) // https://developer.mozilla.org/de/docs/Web/API/WebSocket/readyState
    TRT = new TwitchRealtime(TwitchRealtimeOptions)
  }
}, 1000 * 60 * 30) // 30min
// }

// setTimeout(async () => {
//   console.log('readyState', TRT._ws.readyState)
//   if (TRT._ws.readyState === 1) { // https://developer.mozilla.org/de/docs/Web/API/WebSocket/readyState
//     await TRT.listen('video-playback.gronkh')
//     // await TRT.unlisten
//   }
// }, 250)
