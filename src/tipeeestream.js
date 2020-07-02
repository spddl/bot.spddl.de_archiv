/* eslint no-undef: 0 */
// https://api.tipeeestream.com/api-doc/socketio

const socketc = require('socket.io-client') // "version": "2.1.0"
let socketclient

const Socketconnect = function () {
  // console.log(util.inspect(socketclient, false, null))
  if (socketclient && socketclient.connected) {
    // Tipeeelog.warn('ist schon verbunden')
    console.warn(chalk.black.bgYellowBright.bold('Tipeee'), 'ist schon verbunden')
  } else {
    if (start) {
      // Tipeeelog.warn('ist noch nicht verbunden')
      console.warn(chalk.black.bgYellowBright.bold('Tipeee'), 'ist noch nicht verbunden')
    }
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
    console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Tipeee war nicht eingeloggt, lastPing: ' + socketclient.io.lastPing)
    Socketconnect()
  }
}

// setInterval(checkSocketconnect, 1000 * 60 * 121) // 2h + 1min
/*
if (false) {
// if (!config.localhost() || localhostobj.tipeeestream) {
  Socketconnect()
  setInterval(checkSocketconnect, 1000 * 60 * 31) // 31min
  socketclient.on('connect', function () {
    // Tipeeelog.info('Tipeee Socket.io - Connect', socketclient.id)
    console.info(chalk.black.bgYellowBright.bold('Tipeee'), 'Tipeee Socket.io - Connect', socketclient.id)
    // console.log(util.inspect(socketclient, false, null))

    // socketclient.emit('join-room', {room: '', username:'spddl'})
    // socketclient.emit('join-room', {room: '', username:'Kirby'})
    if (!config.localhost() || localhostobj.tipeeestream) {
      _.each(db.settingsprivate, function (db, name) {
        if (typeof db === 'string') { return } // lastupdated work-a-round
        if (Array.isArray(db)) { return } // blocked work-a-round

        try {
          if (db.botsettings && db.botsettings.tipeeestream) {
            // Tipeeelog.info('join-room: ' + db.botsettings.tipeeestream + ', username: ' + name)
            console.info(chalk.black.bgYellowBright.bold('Tipeee'), 'join-room: ' + db.botsettings.tipeeestream + ', username: ' + name)
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
    console.info(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - new-event: ' + data.event.type)
    // Tipeeelog.info('Tipeee Socket.io - new-event: ' + data.event.type)

    switch (data.event.type) {
      // case 'follow': Alertprocess('fol', data.event.parameters.twitch_channel_id.toLowerCase(), data.event.parameters.username, null); break;
      case 'follow': Alertprocess('fol', data.event.parameters.twitch_channel_id.toLowerCase(), [{
        created_at: data.event.parameters.twitch_created_at,
        id: data.event.parameters.twitch_user_id,
        name: data.event.parameters.username }], null); break
      case 'subscription': / * Tipeeelog.log('tipeeestream: sub '+data.event.parameters.username+', '+data.event.parameters.plan) * /; break

      case 'donation':
        // Tipeeelog.info('tipeeestream: donation')
        console.info(chalk.black.bgYellowBright.bold('Tipeee'), 'tipeeestream: donation')

        if (data.event.user.username === 'kirby') {
          setTimeout(function () {
            bot.say('#kirby', '!add ' + (Math.round(data.event.parameters.amount) * 20) + ' ' + data.event.parameters.username, 2)
          }, 2000)
        }

        break

      case 'hosting': Tipeeelog.info('tipeeestream: hosting: ' + data.event.parameters.hostname + ' ' + data.event.parameters.viewers + ' viewers'); break
        // io.of('/info/' + chan.substr(1)).emit('incomingmsg', {'channel': chan, 'user': username}) // TODO
      default:
        console.info(chalk.black.bgYellowBright.bold('Tipeee'), 'tipeeestream: %j', data)
        // Tipeeelog.info('tipeeestream: %j', data)

    }

    // io.of('/follower/'+host).emit('incomingmsg', name);
    // [LOG ] 11:57:07 [WS] client connected! [/subscriber/spddl] - https://bot.spddl.de/log
    // [LOG ] 11:57:07 [WS] client connected! [/info/spddl] - https://bot.spddl.de/log
    // [LOG ] 11:57:07 [WS] client connected! [/magicconchshell/spddl] - https://bot.spddl.de/log
    // [LOG ] 11:57:07 [WS] client connected! [/submit/spddl] - https://bot.spddl.de/log
  })

  socketclient.on('error', function (err) {
    Tipeeelog.error('Error')
    // Tipeeelog.error(err)
    console.warn(err)
    console.warn(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - Error: %j', err)
    // console.warn('Tipeee Socket.io - Error: %j', err)
  })

  // socketclient.on('reconnect', function (a) {
  //   console.warn(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - Reconnect', a)
  //   // Tipeeelog.warn('Tipeee Socket.io - Reconnect')
  // })

  socketclient.on('disconnect', function () {
    console.warn(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - Disconnect')
    // Tipeeelog.warn('Tipeee Socket.io - Disconnect')
    setTimeout(Socketconnect, 15 * 1000)
  })

  // console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - connect_error')

  // socketclient.on('connect', function (socket) { Tipeeelog.info('Tipeee Socket.io - connect', socket.id) })
  socketclient.on('connect_error', function (err) { console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - connect_error', err) })
  socketclient.on('connect_timeout', function () { console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - connect_timeout') })
  socketclient.on('connection', function (socket) {
    // Tipeeelog.info('Tipeee Socket.io - connection', socket.id)
    console.info(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - connection', socket.id)
    console.log(socket.rooms)
  })
  socketclient.on('error', function () { console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - error') })
  socketclient.on('disconnect', function () { console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - disconnect') })
  socketclient.on('reconnect', function (attempt) { console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - reconnect', attempt) })
  socketclient.on('reconnect_attempt', function (a) { console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - reconnect_attempt', a) })
  socketclient.on('reconnecting', function () { console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - reconnecting') })
  socketclient.on('reconnect_error', function (err) { console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - reconnect_error', err) })
  socketclient.on('reconnect_failed', function () { console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - reconnect_failed') })

  socketclient.on('ping', function () {
    global.socketclient = setTimeout(function () {
      // Tipeeelog.error('Tipeee Socket.io - ping ohne pong?')
      console.error(chalk.black.bgYellowBright.bold('Tipeee'), 'Socket.io - ping ohne pong?')
    }, 2 * 1000) // 2sek
  })
  socketclient.on('pong', function (ms) {
    clearTimeout(global.socketclient) // Kill the timer
    // Tipeeelog.info('Tipeee Socket.io - pong')
  })
}
*/
