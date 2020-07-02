/// /////////////////////////////////////////////////////////////////////////////
//
// @Tipeeestream Bot
//
/// /////////////////////////////////////////////////////////////////////////////
// https://api.tipeeestream.com/api-doc/socketio

const socketc = require('socket.io-client') // "version": "2.1.0"

const socket = socketc('https://sso.tipeeestream.com:8443')
socket.on('connect', function () {
  console.log('connect')
})

/*
const socketc = require('socket.io-client') // "version": "2.1.0"
let socketclient

socketclient = socketc('https://sso.tipeeestream.com:8443', { // https://api.tipeeestream.com/api-doc/socketio
  reconnection: true, // default setting at present
  reconnectionDelay: 5000, // default setting at present
  reconnectionDelayMax: 15000, // default setting at present
  reconnectionAttempts: Infinity // default setting at present
})

// socket.emit('join-room', {room: 'your-api-key', username:'test-user'})

const Socketconnect = function () {
  // console.log(util.inspect(socketclient, false, null))
  if (socketclient && socketclient.connected) {
    // Tipeeelog.warn('ist schon verbunden')
    console.warn('ist schon verbunden')
  } else {
    // Tipeeelog.warn('ist noch nicht verbunden')
    console.warn('ist noch nicht verbunden')

    socketclient = socketc('https://sso.tipeeestream.com:8443', { // https://api.tipeeestream.com/api-doc/socketio
    // socketclient = socketc('https://sso.tipeeestream.com:4242', { // adapt to your server
      reconnection: true, // default setting at present
      reconnectionDelay: 5000, // default setting at present
      reconnectionDelayMax: 15000, // default setting at present
      reconnectionAttempts: Infinity // default setting at present
    })
  }
}

function checkSocketconnect () {
  if (!socketclient.connected) {
    // Tipeeelog.error('Tipeee war nicht eingeloggt, lastPing: ' + socketclient.io.lastPing)
    console.error('Tipeee war nicht eingeloggt, lastPing: ' + socketclient.io.lastPing)
    Socketconnect()
  }
}

// setInterval(checkSocketconnect, 1000 * 60 * 121) // 2h + 1min
if (true || !config.localhost() || localhostobj.tipeeestream) {
  Socketconnect()
  setInterval(checkSocketconnect, 1000 * 60 * 31) // 31min
  socketclient.on('connect', function () {
    // Tipeeelog.info('Tipeee Socket.io - Connect', socketclient.id)
    console.info('Tipeee Socket.io - Connect', socketclient.id)
    // console.log(util.inspect(socketclient, false, null))

    // socketclient.emit('join-room', {room: '5ba9c9fa4292f1eeda427d51d36f5bfcde6f8ba5', username:'spddl'})
    // socketclient.emit('join-room', {room: '2e2305e95dbb7d2bfd1015020df704750f8014d5', username:'Kirby'})
    if (!config.localhost() || localhostobj.tipeeestream) {
      _.each(db.settingsprivate, function (db, name) {
        if (typeof db === 'string') { return } // lastupdated work-a-round
        if (Array.isArray(db)) { return } // blocked work-a-round

        try {
          if (db.botsettings && db.botsettings.tipeeestream) {
            // Tipeeelog.info('join-room: ' + db.botsettings.tipeeestream + ', username: ' + name)
            console.info('join-room: ' + db.botsettings.tipeeestream + ', username: ' + name)
            socketclient.emit('join-room', { room: db.botsettings.tipeeestream, username: name })
            setTimeout(function () {
              try {
                // console.log('socketclient.sockets.adapter.rooms[' + db.botsettings.tipeeestream + ']', socketclient.sockets.adapter.rooms[db.botsettings.tipeeestream])
                // console.log(util.inspect(socketclient, false, null))
              } catch (e) {
                console.warn(e)
              }
            }, 25000)
          }
        } catch (err) {
          console.log(name)
          console.log(err)
        }
      })
    }
  })

  socketclient.on('new-event', function (data) {
    // Tipeeelog.log('tipeeestream: %j', data)
    //   if (data.event.type !== 'follow') {
    //     Tipeeelog.info(data.event.type)
    //     Tipeeelog.info('tipeeestream: %j',data);
    //   }
    console.info('Socket.io - new-event: ' + data.event.type)
    // Tipeeelog.info('Tipeee Socket.io - new-event: ' + data.event.type)
    // INFO] 14:03:09 Tipeee tipeeestream: {"apiKey":"####","event":{"type":"shopCampaign","ref":"5a283eecf15e4","created_at":"2017-12-06T20:03:08+0100","display":true,"parameters":{"status":false,"image_src":"none"},"parameters.amount":0}}

    // switch (data.event.type) {
    //   // case 'follow': Alertprocess('fol', data.event.parameters.twitch_channel_id.toLowerCase(), data.event.parameters.username, null); break;
    //   case 'follow': Alertprocess('fol', data.event.parameters.twitch_channel_id.toLowerCase(), [{ 'created_at': data.event.parameters.twitch_created_at, 'id': data.event.parameters.twitch_user_id, 'name': data.event.parameters.username }], null); break
    //   case 'subscription': /* Tipeeelog.log('tipeeestream: sub '+data.event.parameters.username+', '+data.event.parameters.plan) * /; break
    //     // {"appKey":"####","event":{"id":"42276942","type":"subscription","user":{"avatar":"491994","hasPayment":"2017-06-20T16:34:44+0200","currency":{"code":"EUR","symbol":"€","label":"Euro","available":"1"},"country":"DE","id":"5208","username":"kirby","providers":[{"connectedAt":"2017-06-21T15:50:02+0200","code":"twitch","id":"37218834","username":"Kirby","last_follow_update":"2017-06-20T13:52:26+0200","created_at":"2015-11-27T18:10:34+0100"}],"created_at":"2015-11-27T18:10:34+0100","session_at":"2017-06-21T15:48:16+0200"},"ref":"TWITCH_subscription_2017_June_#kirbyp0seidon3820_1000_0","inserted_at":"2017-06-21T17:08:12+0200","origin":"twitch","created_at":"2017-06-21T17:08:12+0200","display":"1","parameters":{"username":"p0seidon3820","resub":"0","plan":"1000","formattedMessage":"","message":""},"parameters.amount":"0"}}

    //   case 'donation':
    //     // Tipeeelog.info('tipeeestream: donation')
    //     console.info('tipeeestream: donation')

    //     if (data.event.user.username === 'kirby') {
    //       setTimeout(function () {
    //         bot.say('#kirby', '!add ' + (Math.round(data.event.parameters.amount) * 20) + ' ' + data.event.parameters.username, 2)
    //       }, 2000)
    //     }

    //     break

    //   case 'hosting': Tipeeelog.info('tipeeestream: hosting: ' + data.event.parameters.hostname + ' ' + data.event.parameters.viewers + ' viewers'); break
    //     // io.of('/info/' + chan.substr(1)).emit('incomingmsg', {'channel': chan, 'user': username}) // TODO
    //     // {"appKey":"####","event":{"id":"42276509","type":"hosting","user":{"avatar":"491994","hasPayment":"2017-06-20T16:34:44+0200","currency":{"code":"EUR","symbol":"€","label":"Euro","available":"1"},"country":"DE","id":"5208","username":"kirby","providers":[{"connectedAt":"2017-06-21T15:50:02+0200","code":"twitch","id":"37218834","username":"Kirby","last_follow_update":"2017-06-20T13:52:26+0200","created_at":"2015-11-27T18:10:34+0100"}],"created_at":"2015-11-27T18:10:34+0100","session_at":"2017-06-21T15:48:16+0200"},"ref":"TWITCH_hosting_2017521_kirbySpiidiwhaam168","inserted_at":"2017-06-21T17:05:27+0200","origin":"twitch","created_at":"2017-06-21T17:05:27+0200","display":"1","parameters":{"username":"Spiidiwhaam","hostname":"Spiidiwhaam","viewers":"168"},"parameters.amount":"0"}}
    //     // {"appKey":"####","event":{"id":"42276354","type":"hosting","user":{"avatar":"491994","hasPayment":"2017-06-20T16:34:44+0200","currency":{"code":"EUR","symbol":"€","label":"Euro","available":"1"},"country":"DE","id":"5208","username":"kirby","providers":[{"connectedAt":"2017-06-21T15:50:02+0200","code":"twitch","id":"37218834","username":"Kirby","last_follow_update":"2017-06-20T13:52:26+0200","created_at":"2015-11-27T18:10:34+0100"}],"created_at":"2015-11-27T18:10:34+0100","session_at":"2017-06-21T15:48:16+0200"},"ref":"TWITCH_hosting_2017521_kirbyde_sTaR24","inserted_at":"2017-06-21T17:03:50+0200","origin":"twitch","created_at":"2017-06-21T17:03:50+0200","display":"1","parameters":{"username":"de_sTaR","hostname":"de_sTaR","viewers":"24"},"parameters.amount":"0"}}
    //   default:
    //     console.info('tipeeestream: %j', data)
    // }
  })

  socketclient.on('error', function (err) {
    console.error('Error')
    // Tipeeelog.error(err)
    console.warn(err)
    console.warn('Socket.io - Error: %j', err)
    // console.warn('Tipeee Socket.io - Error: %j', err)
  })

  // socketclient.on('reconnect', function (a) {
  //   console.warn('Socket.io - Reconnect', a)
  //   // Tipeeelog.warn('Tipeee Socket.io - Reconnect')
  // })

  socketclient.on('disconnect', function () {
    console.warn('Socket.io - Disconnect')
    // Tipeeelog.warn('Tipeee Socket.io - Disconnect')
    setTimeout(Socketconnect, 15 * 1000)
  })

  // console.error('Socket.io - connect_error')

  // socketclient.on('connect', function (socket) { Tipeeelog.info('Tipeee Socket.io - connect', socket.id) })
  socketclient.on('connect_error', function (err) { console.error('Socket.io - connect_error', err) })
  socketclient.on('connect_timeout', function () { console.error('Socket.io - connect_timeout') })
  socketclient.on('connection', function (socket) {
    // Tipeeelog.info('Tipeee Socket.io - connection', socket.id)
    console.info('Socket.io - connection', socket.id)
    console.log(socket.rooms)
  })
  socketclient.on('error', function () { console.error('Socket.io - error') })
  socketclient.on('disconnect', function () { console.error('Socket.io - disconnect') })
  socketclient.on('reconnect', function (attempt) { console.error('Socket.io - reconnect', attempt) })
  socketclient.on('reconnect_attempt', function (a) { console.error('Socket.io - reconnect_attempt', a) })
  socketclient.on('reconnecting', function () { console.error('Socket.io - reconnecting') })
  socketclient.on('reconnect_error', function (err) { console.error('Socket.io - reconnect_error', err) })
  socketclient.on('reconnect_failed', function () { console.error('Socket.io - reconnect_failed') })

  socketclient.on('ping', function () {
    global.socketclient = setTimeout(function () {
      // Tipeeelog.error('Tipeee Socket.io - ping ohne pong?')
      console.error('Socket.io - ping ohne pong?')
    }, 2 * 1000) // 2sek
  })
  socketclient.on('pong', function (ms) {
    clearTimeout(global.socketclient) // Kill the timer
    // Tipeeelog.info('Tipeee Socket.io - pong')
  })
}
*/
