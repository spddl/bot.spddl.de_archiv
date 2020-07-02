/* eslint no-undef: 0 */
let io

if (config.localhost()) io = socket.listen(httpserver)
else io = socket.listen(httpsserver)

io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next)
})
io.sockets.on('connection', function (socket) {
  try {
    // console.log('socket.request.session.passport.user', socket.request.session.passport.user)
    // console.log('socket.request.session.passport', socket.request.session.passport)
    // console.log('socket.request.session', socket.request.session)
    // console.log('socket.request', socket.request)
    if (socket.request.session.passport) {
      log.separator('Socket.io Login: ' + socket.request.session.passport.user.login, 'info')
    } else {
      // log.separator('Socket.io ID/NS: ' + socket.nsp, 'info') // D/NS: [object Object]---
      log.separator('Socket.io ID/NS: %j', socket.nsp, 'info')
    }
  } catch (error) {
    console.log(error)
  }
  // console.log('[WS] client connected! [] - '+socket.handshake.headers.referer); //'%s', socket.request.connection.remoteAddress)

  socket.on('endGiveaway', function (end) {
    // bot.say('#'+giveawayhost,'Gewonnen hat: '+end.winner)
    settings[giveawayhost].giveawaymembers = [] // reset
    // settings[giveawayhost].giveawaysuspend = []
    settings[giveawayhost].giveaway = false
    // socket.emit('giveaway_array', settings[giveawayhost].giveawaymembers) // reset Page
  })

  socket.on('uptime', function () {
    socket.emit('uptime', process.uptime()) // in Sekunden
    console.log(process.uptime())
  })

  socket.on('memoryUsage', function () {
    socket.emit('memoryUsage', util.inspect(process.memoryUsage())) // in JSON
  })
})

const namespaces = [
  io.of('/follower/demo'),
  io.of('/magicconchshell/demo')
]

for (i in settings.channels) {
  if (i === 'last' || i === 'remove') { break }
  namespaces.push(io.of('/follower/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/subscriber/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/info/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/magicconchshell/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/submit/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/giveaway/' + settings.channels[i].substr(1)))
  namespaces.push(io.of('/' + settings.channels[i].substr(1))) // Index
}

for (i in namespaces) {
  if (i === 'last' || i === 'remove') { break }
  namespaces[i].on('connection', handleConnection(namespaces[i]))
}

function handleConnection (ns) {
  return function (socket) { // connection
    console.log(chalk.green('[WS] client connected!') + ' [' + ns.name + '] - ' + socket.handshake.headers.referer) // '%s', socket.request.connection.remoteAddress)
    // console.log(util.inspect(socket, false, null));
    /*   socket.on('setUsername',setUsernameCallback (socket,ns)); */
    socket.on('msg', msgCallback(socket, ns))
    socket.on('disconnect', disconnectCallback(socket, ns))
    socket.on('error', clienterrorCallback(socket, ns))
    socket.on('startGiveaway', startGiveawayCallback(socket, ns))
    socket.on('startChatGiveaway', startChatGiveawayCallback(socket, ns))
    socket.on('reconnect', reconnectCallback(socket, ns))
    socket.on('connecting', connectingCallback(socket, ns))
    socket.on('reconnecting', reconnectingCallback(socket, ns))
    socket.on('connect_failed', connectFailedCallback(socket, ns))
    socket.on('reconnect_failed', reconnectFailedCallback(socket, ns))
    socket.on('close', closeCallback(socket, ns))
    socket.on('clienterror', clienterrorCallback(socket, ns))
    socket.on('annyang', annyangCallback(socket, ns))
    socket.on('client', clientCallback(socket, ns))
    socket.on('botdisconnect', botdisconnectCallback(socket, ns))
    socket.on('TwitchConnection', TwitchConnectionCallback(socket, ns))
  }
}

function botdisconnectCallback (socket, ns) {
  return function () {
    let user
    try {
      user = socket.request.session.passport.user.username
    } catch (error) {
      console.log(error)
    }

    const chan = ns.name.substr(1)
    log.separator('[WS] BotDisconnect: user [' + user + '], chan [' + chan + ']', 'alert')
    log.separator(' ' + db.settings.channels.length + ' Channels ', 'info')

    if (user === chan) {
      client.part(user)
      db.settingsprivate.blocked.push('#' + user)
      db.settingsprivate_save()
      console.log('Bot disconnect.')
    } else {
      console.log('nur der Mod')
    }
  }
}

function clienterrorCallback (socket, ns) { // Miesmuschel
  return function (msg) {
    console.warn('[WS] reported a client error %j', msg)
  }
}

function reconnectCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] reconnect ' + msg)
    // socket.broadcast.send("It works!")
  }
}
function connectingCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] connecting ' + msg)
    // socket.broadcast.send("It works!")
  }
}
function reconnectingCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] reconnecting ' + msg)
    // socket.broadcast.send("It works!")
  }
}

function connectFailedCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] connect_failed ' + msg)
    // socket.broadcast.send("It works!")
  }
}
function reconnectFailedCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] reconnect_failed ' + msg)
    // socket.broadcast.send("It works!")
  }
}
function closeCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] close ' + msg)
    // socket.broadcast.send("It works!")
  }
}

function TwitchConnectionCallback (socket, ns) {
  return function (data) {
    console.log('[WS] TwitchConnection [' + ns.name + ']: ' + util.inspect(data, false, null))
    // TODO prüfen ob der
    if (client.getChannels().indexOf(data.name) !== -1) {
      console.log('gefunden')
    } else {
      console.log('nicht gefunden')
    }
  }
}

function annyangCallback (socket, ns) {
  return function (data) {
    // TODO: chathandle(channel, user, message, self)
    console.log('[WS] annyang [' + ns.name + ']: ' + util.inspect(data, false, null))

    switch (data.event) {
      case 'hallo':
        io.of(ns.name).emit('client', { msg: data.event, host: ns.name })
        break
      case 'muschel':
        var voicelanguage = 'Deutsch Female'
        if (db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.autodetectlanguage) if (franc(data.parameter, { whitelist: ['deu', 'eng'] }) === 'eng') voicelanguage = 'UK English Female'
        io.of('/magicconchshell/' + ns.name.substr(1)).emit('incomingmsg', {
          user: ' ',
          text: data.parameter,
          emotes: '',
          lang: voicelanguage,
          volume: db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicevolume,
          pitch: db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicepitch,
          rate: db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicerate
        })
        break
      default:
        if (data.parameter) chathandle('#' + ns.name.substr(1), { username: ns.name.substr(1), type: 'annyang' }, '!' + data.event + ' ' + data.parameter, false)
        else chathandle('#' + ns.name.substr(1), { username: ns.name.substr(1), type: 'annyang' }, '!' + data.event, false)
    }

    // if (data.event == "hallo") {return}

    /*
      switch (data.event) { // TODO: eigentlich brauch es doch nur ein Event für alles
        case 'wow':
          counter('wow','bot.spddl.de', ns.name.substr(1), function(data){
            bot.say('#'+ns.name.substr(1), data)
          })
        break;

        case 'fack':
          counter('fack','bot.spddl.de', ns.name.substr(1), function(data){
            console.log('fack: '+data);
            bot.say('#'+ns.name.substr(1), data)
          })
        break;

        case 'test alert':
          io.of('/magicconchshell/'+ns.name.substr(1)).emit('incomingmsg', {'user': '', 'text': 'Alarm !!', 'emotes': '', 'lang': 'Deutsch Female', 'volume': 1, 'pitch': 1, 'rate': 1})
        break;

        case 'hallo':
          io.of(ns.name).emit('client', {'msg': data.event, 'host': ns.name});
        break;

        case 'weather':
          weather('#'+ns.name.substr(1), ns.name, data.city);
          io.of(ns.name).emit('client', {'msg': 'Wetter für '+data.city});
        break;

        case 'muschel':
          var voicelanguage = 'Deutsch Female'
          if(db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.autodetectlanguage) if(franc(data.frage, {'whitelist' : ['deu', 'eng']}) === 'eng') voicelanguage = 'UK English Female'
          io.of('/magicconchshell/'+ns.name.substr(1)).emit('incomingmsg', {'user': ' ', 'text': data.frage, 'emotes': '', 'lang': voicelanguage, 'volume': db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicevolume, 'pitch': db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicepitch, 'rate': db.settingsprivate[ns.name.substr(1)].botsettings.alerts.magicconchshell.voicerate })
        break;

        default:
          console.log('[annyang] nix gefunden');
      }  */
  }
}

// const compareMe = function (obj1, obj2, parentKey) {
//   parentKey = parentKey || '';
//   _.each(_.keys(obj1), function (key) {
//     if(_.isObject(obj1[key]) ) {
//       console.log(obj1[key], obj2[key], parentKey + key + '.')
//       compareMe(obj1[key], obj2[key], parentKey + key + '.')
//     } else {
//       if (!_.has(obj2, key) || !_.isEqual(obj1[key], obj2[key])) {
//         console.log(parentKey + key+': '+obj1[key]+' > '+obj2[key]);
//       }
//     }
//   })
// };

function clientCallback (socket, ns) {
  return function (data) {
    // console.log('client: ['+ns.name+'] '+util.inspect(data, false, null))
    // console.log('client: ['+ns.name+']')
    let user
    try {
      user = socket.request.session.passport.user.username
    } catch (error) {
      console.log(error)
    }
    const chan = ns.name.substr(1)

    if (!(user === chan || user === 'spddl' || db.settingsprivate[chan].botsettings.mods || db.settingsprivate[chan].botsettings.mods.some((item) => { return item.toLowerCase() === user.toLowerCase() }))) {
      log.separator('Twitch User: ' + user + ' hat keine Berechtigung für ' + chan, 'alert')
      return false
    }

    if (data.type === 'array') {
      db.settingsprivate[chan].botsettings[data.name] = data.value
      db.settingsprivate_save()
      /* if (data.type == 'alloweddomains') {
        //console.log('!!alloweddomains');
        settingsprivate[ns.name.substr(1)].botsettings.alloweddomains = data.value
        settingsprivate_save()
      } else if (data.type == 'ignorecmd') {
        //console.log('!!ignorecmd');
        settingsprivate[ns.name.substr(1)].botsettings.ignorecmd = data.value
        settingsprivate_save()
      } else if (data.type == 'mods') {
        //console.log('!!ignorecmd');
        settingsprivate[ns.name.substr(1)].botsettings.mods = data.value
        settingsprivate_save()
      } else if (data.type == 'towords') {
        //console.log('!!towords '+ns.name.substr(1));
        settingsprivate[ns.name.substr(1)].botsettings.towords = data.value // settingsprivate[data.model].botsettings.towords = data.value
        settingsprivate_save()
      } else if (data.type == 'banwords') {
        //console.log('!!banwords');
        settingsprivate[ns.name.substr(1)].botsettings.banwords = data.value
        settingsprivate_save() */
    } else if (data.type === 'cmd') {
      // console.log('!!cmd ' + data.value)
      console.log('!!cmd', util.inspect(data.value, false, null, true))
      // try {
      //   // compareMe(db.commands[chan].cmd, data.value)
      // } catch (error) {
      //   console.warn(error)
      // }

      var key = Object.keys(data.value)[0]
      // console.log("key: "+key)
      if (data.value[key].permission) {
        _.each(_.keys(data.value[key].permission), function (keyy) {
          if (!data.value[key].permission[keyy]) { // Damit alle "false" gelöscht werden
            delete data.value[key].permission[keyy]
          }
        })
      }

      if (data.action === 'new') {
        console.log('neu angelegt: ' + key + ', ' + util.inspect(data.value[key], false, null, true))
        db.commands[chan].cmd[key] = data.value[key]
      } else if (data.action === 'del') {
        console.log('gelöscht: ' + key)
        delete db.commands[chan].cmd[key]
      } else {
        console.log('geändert: ' + key + ', ' + util.inspect(data.value[key], false, null, true))
        db.commands[chan].cmd[key] = data.value[key]
      }

      // console.log("");
      // console.log(data);
      // console.log("");

      // console.log(db.commands[chan].cmd);

      // var count = Object.keys(data.value[key]).length;
      // console.log("count: "+count);
      // console.log(Object.keys(data.value[key]));
      // if (count == 0) {
      //   console.log('gelöscht '+key);
      //   delete db.commands[chan].cmd[key]
      // } else {
      //   console.log();
      //   db.commands[chan].cmd[key] = data.value[key]
      // }

      // db.commands[chan].cmd[key] = data.value[key]
      db.commands_save()

      // var myObject = { '!add': { text: '{add} dings :P', permission: { viewer: true } } }

      // var count = Object.keys(myObject).length;
      // console.log(count);
    } else if (data.type === 'annyang') {
      console.log('!!annyang')
      db.voicecommands[chan] = data.value
      db.voicecommands_save()
    } else if (data.type === 'counter') {
      console.log('!!counter') // TODO
      // db.settingsprivate.spddl.botsettings.banwords = data.value
    } else if (data.type === 'ads') {
      console.log('!!ads') // TODO
      // db.settingsprivate.spddl.botsettings.banwords = data.value
    } else if (data.type === 'steam') {
      console.log('!!steam')
      steam_start({ username: 'Webseite_' + data.chan, channel: data.chan }, '')
    } else if (data.type === 'steamaccount') {
      console.log('!!steamaccount')
      db.settingsprivate[chan].botsettings.steam.account = data.value
      db.settingsprivate_save()
      SteamUsernamefn()
    } else if (data.type === 'steamgroup') {
      console.log('!!steamgroup')
      db.settingsprivate[chan].botsettings.steam.steamgroup = data.value
      db.settingsprivate_save()
      SteamChatterroomfn()
    } else if (data.type === 'giveawaysuspend') {
      console.log('!!giveawaysuspend')
      db.settingsprivate[chan].botsettings.giveaway.giveawaysuspend = data.value
      db.settingsprivate_save()
    } else if (data.type === 'cron') {
      console.log('!!cron')
      console.info(data.value) // { time: '0,10,25 * * * *', text: 'asdasdasd', id: 0 }

      if (cronfunc.test(chan, data.value.id)) {
        console.log('cronfunc.test TRUE')
        cronfunc.del(chan, data.value.id)
        for (let i = 0, len = db.settingsprivate[chan].botsettings.advertising.length; i < len; i++) {
          if (db.settingsprivate[chan].botsettings.advertising[i].id === data.value.id) {
            console.log('gefunden: ' + i)
            db.settingsprivate[chan].botsettings.advertising.splice(i, 1)
            break
          }
        }
      } else {
        // console.warn('cronfunc.test FALSE')
      }
      cb(chan, data.value.id, data.value.time, data.value.text)
      db.settingsprivate[chan].botsettings.advertising.push(data.value)
      db.settingsprivate_save()
    } else if (data.type === 'crondelete') {
      console.log('!!crondelete')
      if (cronfunc.test(chan, data.value)) {
        cronfunc.del(chan, data.value)
      } else {
        console.info('CronJob: ' + data.value + ' wurde nicht gefunden')
      }
      for (let i = 0, len = db.settingsprivate[chan].botsettings.advertising.length; i < len; i++) {
        if (db.settingsprivate[chan].botsettings.advertising[i].id === data.value) {
          console.log('gefunden: ' + i)
          db.settingsprivate[chan].botsettings.advertising.splice(i, 1); break
        }
      }
      // db.settingsprivate[chan].botsettings.advertising.splice(data.value, 1)
      console.log(db.settingsprivate[chan].botsettings.advertising)
      db.settingsprivate_save()
    } else {
      console.log('!!String')
      // console.log("settingsprivate."+data.model+" = "+data.value)
      // eval("settingsprivate."+chan+" = "+data.value)
      eval('db.settingsprivate.' + data.model + ' = ' + data.value) // eslint-disable-line no-eval
      db.settingsprivate_save()
    }
  }
}

function startGiveawayCallback (socket, ns) {
  return function (data) {
    console.log('[WS] #' + data + ' Giveaway startet ' + vsettings[data].giveawaymembers.length + ' Teilnehmer auf: ' + data + ' [' + ns.name + '] - ' + socket.handshake.headers.referer)
    if (settings[data].giveawaymembers.length !== 0) {
      console.log('#' + data, 'Die Auslosung beginnt') // bot.say('#'+data,'Die Auslosung beginnt') // [DEBUG]
      db.settings[data].giveawaymembers = [] // reset
      db.settings[data].giveawaysuspend = db.settingsprivate[data].botsettings.giveaway.giveawaysuspend // Bots
      // settings[giveawayhost].giveawaysuspend = []
      db.settings[data].giveaway = true
    }
  }
}

function startChatGiveawayCallback (socket, ns) {
  return function (data) {
    console.log('[WS] startChatGiveawayCallback #' + data + ' [' + ns.name + '] - ' + socket.handshake.headers.referer)
    bot.say('#' + data, '.me GIVEAWAY!! GIVEAWAY!!')
    console.log(db.settingsprivate[data].botsettings.giveaway.keyword)
    if (db.settingsprivate[data].botsettings.giveaway.keyword) {
      setTimeout(function () {
        bot.say('#' + data, '.me KeyWord: ' + db.settingsprivate[data].botsettings.giveaway.keyword, 10)
      }, 100)
    }
    db.settings[data].giveawaymembers = []
    db.settings[data].giveaway = true
  }
}

// function errorCallback (socket, ns) {
//   return function (msg) {
//     console.log('[WS] Socket.io reported a generic error ' + msg + ' [' + ns.name + '] - ' + socket.handshake.headers.referer)
//   }
// }

function msgCallback (socket, ns) {
  return function (msg) {
    console.log('[WS] msgCallback ' + msg)
  }
}

function disconnectCallback (socket, ns) {
  return function (msg) {
    // console.log('[WS] Disconnected '+msg+' - '+ns.name); // Disconnected transport close
    // console.log('[WS] Disconnected '+msg+' ['+ns.name+'] - '+socket.handshake.headers.referer); // Disconnected transport close
    console.log('[WS] Disconnected ' + msg + ' [' + ns.name + '] - ' + socket.handshake.headers.referer)
  }
}

// function FollowerAPILOOP () {
//   // console.time('FollowerAPILOOP')
//   for (let i = 0, l = settings.channels.length; i < l; i++) {
//     const channel = settings.channels[i].substr(1)
//     if (streamdata[channel].setfollows && streamdata[channel].setsubscriptions) FollowerAPI('follows', channel, true)
//     else if (streamdata[channel].setfollows) FollowerAPI('follows', channel)
//     else if (streamdata[channel].setsubscriptions) FollowerAPI('subscriptions', channel)
//     // if(i == --l){console.timeEnd('FollowerAPILOOP')}
//   }
// }

// add new last() method:
if (!Array.prototype.last) {
  Array.prototype.last = () => { // eslint-disable-line no-extend-native
    return this[this.length - 1]
  }
}

/* TODO
function FollowerAPI(type, host, sub){
  if (streamdata[host].offset != 0){
    var i = streamdata[host].offset; offset = '&direction=ASC&offset='+ ++i
  }else{ offset = '' }

  //console.info('FollowerAPI: '+type+', '+host+', '+sub+', '+offset)
  if(sub){ FollowerAPI('subscriptions', host)}
  https.get('https://api.twitch.tv/kraken/channels/'+host+'/'+type+'?limit=1'+offset+'&client_id=', function(r) {
// https://api.twitch.tv/kraken/channels/spddl/follows?direction=ASC&limit=1&offset=184&client_id=
// https://api.twitch.tv/kraken/channels/spddl/follows?limit=25&direction=desc&client_id= // TwitchAlerts

      r.setEncoding('utf8');
      var b = '';
      r.on('data', function(chunk) { b += chunk });
      r.on('end', function() {
        //console.info(b)
        //if(!isJson(b)){return false;}
        if(b.match('<html><body><h1>502 Bad Gateway</h1>') !== null){console.critical('[TwitchAPI] 502 Bad Gateway');return}
        if(b.match('<html><body><h1>503 Service Unavailable</h1>') !== null){console.critical('[TwitchAPI] 503 Service Unavailable');return}
        if(b.match('<html><body><h1>504 Gateway Time-out</h1>') !== null){console.critical('[TwitchAPI] 504 Gateway Time-out');return}

        var body = JSON.parse(b) // <html><body><h1>503 Service Unavailable</h1>

          if(body.error == 'Unauthorized'){
            streamdata[host].setsubscriptions = false
            console.critical(host+' Subscriptions ausgeschaltet');
            streamdata.lastupdated = new Date();
            jf.writeFileSync(streamfile, streamdata)
            return
          }

          if(body.follows.length != 0 && (body.follows[0].user.name != streamdata[host].follows.last().name)){

            console.info('Neuer Follower: '+host+', '+body.follows[0].user.name+' seit: '+body.follows[0].created_at+' Total: '+body._total+' DEBUG:'+streamdata[host].follows.last().name)+' '+(body.follows[0].user.name != streamdata[host].follows.last().name)
            streamdata[host].follows.push({ name: body.follows[0].user.name, created_at: body.follows[0].created_at});
            streamdata[host].follows_total = body._total
            if (streamdata[host].offset != 0){
              streamdata[host].offset = ++streamdata[host].offset
            }
            streamdata.lastupdated = new Date();
            jf.writeFileSync(streamfile, streamdata)
            if(sub){
              Alertprocess('sub', host, body.follows[0].user.name, body._total) // TODO
            }else{
              Alertprocess('fol', host, body.follows[0].user.name, body._total) // TODO
            }
          }

      });

    }).on('error', function(e) {
      console.error('ERROR: ' + e.message)
    })
}
*/
