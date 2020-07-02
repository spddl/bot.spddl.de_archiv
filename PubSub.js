
const TwitchRealtime = require('twitch-realtime')

// let TRT = new TwitchRealtime({
//   defaultTopics: [
//     // 'video-playback.gronkh',
//     'video-playback.schulzew',
//     'video-playback.xatutv',
//     'video-playback.dershakes'
//   ]
// })

const channels = [
  '#kirby',
  '#fr3ddytv',
  '#ladydeaths',
  '#spddl_gaming',
  '#klein_walke',
  '#toni_sosa',
  '#xatutv',
  '#gobbtv',
  '#stv_nash',
  '#navidkapio',
  '#matthias_mase_meyer',
  '#collycs',
  '#kunstfehl9r',
  '#penguinwithbeard',
  '#spddl',
  '#eis_dragon',
  '#know1111ng',
  '#jbreelocher',
  '#voovpingu',
  '#hyde069',
  '#turb0000',
  '#trotakis',
  '#rahyy',
  '#mrsilvertee'
]

const TRT = new TwitchRealtime({
  defaultTopics: channels.map(chan => `video-playback.${chan.substr(1)}`)
})
// setTimeout(async () => {
//   console.log('readyState', TRT._ws.readyState)
//   if (TRT._ws.readyState === 1) { // https://developer.mozilla.org/de/docs/Web/API/WebSocket/readyState
//     await TRT.listen('video-playback.gronkh')
//     // await TRT.unlisten
//   }
// }, 250)

TRT.on('bits', data => { console.log(new Date().toJSON(), 'bits', data) })
TRT.on('close', data => { console.log(new Date().toJSON(), 'close', data) })
TRT.on('connect', () => { console.log(new Date().toJSON(), 'connect') })
TRT.on('debug', data => { console.log(new Date().toJSON(), 'debug', data) })
TRT.on('stream-down', data => { console.log(new Date().toJSON(), 'stream-down', data) })
TRT.on('stream-up', data => { console.log(new Date().toJSON(), 'stream-up', data) })
// TRT.on('viewcount', data => { console.log(new Date().toJSON(), 'viewcount', data) }) //  viewcount { time: 1577307422.873425, channel: 'schulzew', viewers: 0 }
TRT.on('warn', data => { console.log(new Date().toJSON(), 'warn', data) })
TRT.on('whisper', data => { console.log(new Date().toJSON(), 'whisper', data) })
TRT.on('raw', data => {
  // console.log(new Date().toJSON(), 'raw', data)
  if (data.type !== 'PONG') {
    if (data.type === 'MESSAGE' && (data.data.message.indexOf('{"type":"viewcount",') === 0 || data.data.message.indexOf('{"type":"commercial",') === 0)) {
      // ignore
    } else {
      console.log(new Date().toJSON(), 'raw', data)
    }
  }
})

setInterval(() => {
  console.log('')
}, 15 * 1000)

// const tps = require('tps.js')
// let client = new tps.Client({
//   debug: true,
//   topics: ['video-playback.gronkh']

//   // topics: ["whispers.test_account","video-playback.lirik"]
// })

// client.subscribe('video-playback.lirik')
// client.subscribe('video-playback.gronkh')
// // client.subscribe('whispers.spddl')
// client.subscribe('video-playback.rocketbeanstv')

// client.on('connected', function () {
//   console.log('connected')
// })

// client.on('video-playback.rocketbeanstv', function (data) {
//   console.log('video-playback.rocketbeanstv')
//   console.log(data)
// })

// client.on('video-playback.lirik', function (data) {
//   console.log('video-playback.lirik')
//   console.log(data)
// })

// client.on('whispers.spddl', function (data) {
//   console.log('whispers.spddl')
//   console.log(data)
// })

// console.log(client)

// var WebSocket = require('ws') // https://www.npmjs.com/package/ws
// var ws = new WebSocket('wss://pubsub-edge.twitch.tv')

// ws.on('open', function open () {
//   console.log('OPEN')
//   // ws.send('something');
//   ws.send('PING')
//   // ws.send({type: "PING"});
// })

// ws.on('PING', function PING () {
//   console.log('PING1')
// })

// ws.on('PING', function () {
//   console.log('PING2')
// })

// ws.on('PONG', function PONG () {
//   console.log('PONG1')
// })

// ws.on('PONG', function () {
//   console.log('PONG2')
// })

// ws.on('RECONNECT', function RECONNECT () {
//   console.log('RECONNECT')
// })

// ws.on('MESSAGE', function (data, flags) {
//   console.log('MESSAGE1')
// })

// ws.on('MESSAGE', function MESSAGE () {
//   console.log('MESSAGE2')
// })

// ws.on('LISTEN', function LISTEN () {
//   console.log('LISTEN')
// })

// ws.onopen = function () {
//   console.log('OOOPEN')
// }

// ws.onmessage = function (evt) {
//   console.log('123')
// }

// ws.onclose = function () {
//   console.log('websocket is closed.')
// }

// // https://github.com/tmijs/tmi.js/blob/3ab4ab20db32299ccfd4e98b957077df90f5a671/lib/client.js
