/* eslint no-undef: 0 */

const client = new irc.client({ // eslint-disable-line new-cap
  options: {
    debug: true
    // debugIgnore: ['chat', 'action', 'ping', 'part', 'join']
  },
  connection: {
    cluster: 'aws',
    secure: true,
    reconnect: true
  },
  identity: {
    username: db.settings.botName,
    password: db.settings.password // "password": "oauth:", // https://dev.twitch.tv/console/apps
    // password: 'oauth:',
  },
  channels: config.localhost() ? (localhostobj.twitch ? ['#spddl_bot', '#spddl'] : []) : db.settings.channels // botchannels TODO:
  // channels: []
})

// const delay = (time = 1000) => {
//   return new Promise(function (resolve, reject) {
//     setTimeout(() => {
//       resolve()
//     }, time)
//   })
// }
// const joinQueue = async.queue(async (task, callback) => {
//   console.log('joinQueue', task.channel)
//   switch (task.cmd) {
//     case 'join':
//       // await twitchJs.chat.join(task.channel)
//       try {
//         await client.join(task.channel)
//       } catch (error) {
//         console.warn('joinQueue', task.channel, error)
//       }
//       break
//     case 'part':
//       // await twitchJs.chat.part(task.channel)
//       await client.part(task.channel)
//       break
//   }
//   await delay(30000) // 30 Sek
//   callback()
// }, 3)

// const TwitchChannel = (config.localhost() ? (localhostobj.twitch ? ['#spddl_bot', '#spddl'] : []) : db.settings.channels)
// TwitchChannel.forEach(channel => {
//   // joinQueue.unshift({ cmd: 'join', channel })
//   joinQueue.push({ cmd: 'join', channel })
// })

const kirbyMods = {}

const bot = { // [Prio] niedriger ist wichtiger
  say: function (chan, msg, prio) {
    q.push({ cmd: 'say', chan: chan, msg: msg }, prio, err => {
      err && console.error(err)
    })
  },
  timeout: function (chan, user, time, reason) {
    q.push({ cmd: 'timeout', chan: chan, user: user, time: time, reason: reason }, 8, err => {
      err && console.error(err)
    })
  },
  ban: function (chan, user, reason) {
    q.push({ cmd: 'ban', chan: chan, user: user, reason: reason }, 9, err => {
      err && console.error(err)
    })
  },
  whisper: function (chan, msg, prio) {
    q.push({ cmd: 'whisper', chan: chan, msg: msg }, prio, err => {
      err && console.error(err)
    })
  }
}

client.on('join', function (chan, username) {
  try {
    // console.log('debug 614, chan: '+chan+'  username: '+username+' '+settingsprivate[chan.substr(1)].botsettings.check24h);
    if (db.settingsprivate[chan.substr(1)].botsettings.check24h || false) {
      check24h(true, username, function (result, time) {
        if (result) {
          // let diff = time-86400000
          // bot.timeout(chan.substr(1), username, Math.round(time/1000), 'Check24h: '+username+' bekommt einen TO: '+moment.utc(diff).format('HH:mm:ss')) // umrechnen von MS zu Sekunden
          bot.timeout(chan.substr(1), username, Math.round(time / 1000), 'Check24h: ' + username + ' bekommt einen TO: ' + moment.utc(time).format('HH:mm:ss')) // umrechnen von MS zu Sekunden
          if (db.settingsprivate[chan.substr(1)].botsettings.check24hwhisper || false) bot.whisper(chan.substr(1), ' ' + username + ' bekommt einen TO: ' + moment.utc(time).format('HH:mm:ss'))
          log.separator('check24h fn: ' + chan + ', ' + username + ', ' + time, 'emergency')
          io.of('/info/' + chan.substr(1)).emit('incomingmsg', { msg: 'check24h: TimeOut für ' + username + ' ' + moment.utc(time).format('HH:mm:ss') })
        }
      })
    } else if (db.settingsprivate[chan.substr(1)].botsettings.check24hwhisper || false) {
      check24h(true, username, function (result, time) {
        if (result) {
          // bot.timeout(chan.substr(1), username, Math.round(time/1000), 'Check24h: '+username+' bekommt einen TO: '+moment.utc(time).format("HH:mm:ss")); // umrechnen von MS zu Sekunden
          // let diff = time-86400000
          if (db.settingsprivate[chan.substr(1)].botsettings.check24hwhisper || false) bot.whisper(chan.substr(1), ' ' + username + ' wurde vor ' + moment.utc(time).format('HH:mm:ss') + ' auf Twitch erstellt.')
          log.separator('check24h fn: ' + chan + ', ' + username + ', ' + time, 'emergency')
          io.of('/info/' + chan.substr(1)).emit('incomingmsg', { msg: 'check24h: wurde vor ' + username + ' ' + moment.utc(time).format('HH:mm:ss') + ' auf Twitch erstellt.' })
        }
      })
    }
  } catch (e) {
    console.error('ERROR check24h, chan: ' + chan + '  username: ' + username + ' ' + e)
  }
})

@import './twitch/check24h.js'

client.on('disconnected', function (reason) {
  log.separator(' Twitch disconnected ' + reason + ' ', 'notice')
}).on('logon', function () {
  log.separator(' Twitch bot logon', 'notice')
}).on('notice', function (channel, msgid, message) {
  if (msgid === 'msg_banned') { client.part(channel) }
  if (msgid !== 'timeout_success') {
    log.notice(channel + ', ' + msgid + ', ' + message)
  }
  // }).on("pong", function (latency){  log.notice('pong '+latency) 0.009 - 0.01
  // }).on("connecting", function (address, port){ log.notice('Bot Address: '+address+', port: '+port)
  // }).on("ban", function (channel, username, reason) { log.notice('BAN: '+channel+', > '+username+', '+reason)
  // }).on("timeout", function (channel, username, reason, duration) { log.notice('TO: '+channel+', > '+username+', '+reason+' ('+duration+')')
}).on('serverchange', function (channel) {
  log.separator(' serverchange: ' + channel + ' ', 'notice')
}).on('roomstate', function (channel, state) {
  if (settings[channel.substr(1)]) { settings[channel.substr(1)].roomstate = state } else { settings[channel.substr(1)] = {}; settings[channel.substr(1)].roomstate = state } // console.log('roomstate: '+channel+', '+state); console.info('roomstate: '+channel+' '+(state["broadcaster-lang"] === null ? '' : "broadcaster-lang: "+state["broadcaster-lang"]) , (state.r9k === false ? '' : " r9k: "+state.r9k) , (state.slow === false ? '' : " slow: "+state.slow) , (state['subs-only'] === false ? '' : " subs-only: "+state['subs-only']))
}).on('reconnect', function () {
  log.separator(' Twitch reconnect ', 'notice')
})

// if (config.localhost()) { client.on("pong", function (latency){ log.notice('pong '+latency) }) }

if (!config.localhost() || localhostobj.twitch) {
  client.connect()
}

client.on('whisper', function (from, user, message, self) { // client.on("whisper", function (user, message) {
  if (self) { return } // Don't listen to my own messages..
  console.log('Whisper: ' + user.username + ': ' + message)
  user.type = 'twitchgroup'

  // groupirc.say('#jtv','/w '+user.username+' ECHO: '+message) // debug
  // if (adminCheck(user, '#'+user.username) ){
  //   // if(message.substr(0,4) === "!ads"){
  //   //     if(adminCheck(user, '#'+user.username)){
  //   //       advertising('#'+user.username, message, user.username);
  //   //       return;
  //   //     }
  //   // }
  //   if(message.substr(0,1) === "!") {
  //     parseCmd(message.substr(1),'#'+user.username,user);
  //     return
  //   }
  // }
})

client.on('hosted', function (channel, username, viewers) {
  // channel: String - Channel name being hosted
  // username: String - Username hosting you
  // viewers: Integer - Viewers count

  if (db.settingsprivate.blocked.indexOf(channel) !== -1) { return }
  bot.whisper(channel, `Wird nun von ${username} gehostet mit ${viewers}`)
})

client.on('hosting', function (channel, target, viewers) { // Channel is now hosted by another broadcaster. This event is fired only if you are logged in as the broadcaster.
  if (db.settingsprivate.blocked.indexOf(channel) !== -1) { return }
  if (!((viewers === '-') || (viewers === 0))) {
    client.say(channel, 'https://www.twitch.tv/' + target + (viewers === 1 ? ' wird gehostet mit ' + viewers + ' Viewer' : ' wird gehostet mit ' + viewers + ' Viewern'), 1)
  }
})

client.on('emoteonly', function (channel, enabled) {
  try {
    if (enabled) {
      log.separator(' ' + channel + ' emoteonly: AN', 'info')
    } else {
      log.separator(' ' + channel + ' emoteonly: AUS', 'info')
    }
  } catch (e) {
    console.warn(e)
  }
})

client.on('followersonly', function (channel, enabled, length) {
  try {
    if (enabled) {
      log.separator(' ' + channel + ' followersonly: ' + length, 'info')
    } else {
      log.separator(' ' + channel + ' followersonly: AUS', 'info')
    }
  } catch (e) {
    console.warn(e)
  }
})

@import './twitch/methodsPlanCheck.js'

client.on('cheer', function (channel, userstate, message) {
  console.log('cheer', channel, userstate.bits, userstate['display-name'], message)
  if (channel === '#kirby') {
    setTimeout(function () {
      bot.say('#kirby', '!add ' + (userstate.bits / 5) + ' ' + userstate['display-name'], 2)
    }, 2000)
  }
})

client.on('subgift', function (chan, username, streakMonths, recipient, methods, userstate) {
  console.log('subgift', { chan, username, streakMonths, recipient, methods, userstate })
  let plan
  try {
    const months = (userstate && userstate['msg-param-months']) || 1 // könnte auch "true" sein :/
    plan = methodsPlanCheck(methods.plan)
    console.log('subgift:', chan, username, plan.v, recipient, months)
    if (chan === '#kirby') {
      setTimeout(() => { // Kirby
        // bot.say(chan, '!add ' + (plan.n / 5 * 100) + ' ' + recipient, 2)
        bot.say(chan, '!add ' + (months * plan.n / 5 * 100) + ' ' + recipient, 2)
      }, 2000)
    }
  } catch (e) {
    console.warn(methods, e)
  }
})

client.on('subscription', function (chan, username, methods, message, userstate) { // Username has subscribed to a channel.
  const plan = methodsPlanCheck(methods.plan)
  // console.log('subscription: ' + chan + ', ' + username + ', ' + plan.v)
  io.of('/subscriber/' + chan.substr(1)).emit('incomingmsg', { channel: chan, user: username })
  if (chan === '#kirby') {
    if (db.settingsprivate[chan.substr(1)].botsettings.alerts.subscription.sub1) {
      let msg = db.settingsprivate[chan.substr(1)].botsettings.alerts.subscription.sub1
      msg = msg.replace(new RegExp('{SUBNICK}', 'g'), username)
      bot.say(chan, msg, 1)
    } else {
      bot.say(chan, '!sub New Subscription [' + username + ']', 1)
    }

    setTimeout(() => {
      bot.say(chan, '!add ' + (plan.n / 5 * 100) + ' ' + username, 2)
    }, 2000)
  }
})

client.on('resub', function (chan, username, _months, message, userstate, methods) { // https://docs.tmijs.org/v1.2.1/Events.html#resub
  // https://github.com/tmijs/tmi.js/issues/325
  // try {
  //   console.log({ chan, username, _months, message, userstate, methods })
  //   console.log("userstate['msg-param-cumulative-months']", userstate['msg-param-cumulative-months'], _months)
  // } catch (e) {
  //   console.log('msg-param-cumulative-months', e)
  // }

  try {
    const months = (userstate && userstate['msg-param-cumulative-months']) || 0
    const plan = methodsPlanCheck(methods.plan)

    // console.log('subanniversary:', chan, ',', username, ',', months, ',', _months, ',', plan, ',', methods, ',', userstate)
    io.of('/subscriber/' + chan.substr(1)).emit('incomingmsg', { channel: chan, user: username, months: months })
    if (chan === '#kirby') {
      if (db.settingsprivate[chan.substr(1)].botsettings.alerts.subscription.resub) {
        let msg = db.settingsprivate[chan.substr(1)].botsettings.alerts.subscription.resub
        msg = msg.replace(new RegExp('{SUBNICK}', 'g'), username)
        msg = msg.replace(new RegExp('{MONTHS}', 'g'), months)
        msg = msg.replace(new RegExp('{POINTS}', 'g'), (months * plan.n / 5 * 100))
        bot.say(chan, msg, 1)
      } else {
        bot.say(chan, '!sub Subscription ' + months + ' months [' + username + ']', 1)
      }

      // Logik dahinter bleibt erst mal HardCode
      setTimeout(() => {
        // if (months > 30) months = 30
        // bot.say(chan, '!add ' + months + '00 ' + username, 2)
        bot.say(chan, '!add ' + (months * plan.n / 5 * 100) + ' ' + username, 2)
      }, 2000)
    }
  } catch (e) {
    console.warn(e)
    console.log(userstate)
  }
})

client.on('cheer', function (channel, userstate, message) {
  try {
    // log.separator(' '+channel+' cheer: '+message, 'info')
    console.log(channel + ' - ' + message + ' - cheer %j', userstate)
  } catch (e) {
    console.warn(e)
  }
})

client.on('mod', function (channel, username) {
  if (username === 'spddl_bot') {
    const index = db.settingsprivate.blocked.indexOf(channel)
    if (index > -1) {
      db.settingsprivate.blocked.splice(index, 1)
      log.notice('UNBLOCK: ' + channel + ' **********************************************************************')
      db.savecommand_save()
    }
  }
})

client.on('action', function (channel, user, message, self) {
  chathandle(channel, user, message, self)
})

client.on('chat', function (channel, user, message, self) {
  chathandle(channel, user, message, self)
})

@import './twitch/withoutEmotes.js'

@import './twitch/FetchAsync.js'

@import './twitch/AwaitFunctions.js'

@import './twitch/SteamInvite.js'

@import './twitch/permit.js'

@import './twitch/noMoreLinks.js'

@import './twitch/uniqArray.js'

const PromiseType = /{nick}|{userid}|{arg}|{del}|{mm}|{add}|{uptime}|{subage}|{subs}|{follow}|{twitchstatus}|{titelchange}|{gamechange}|{permit}|{steaminvite}|{counter}|{streamstart}|{weather}|{pubg}|{warteschlange_start}|{warteschlange_list}|{warteschlange_add}|{warteschlange_remove}|{warteschlange_toggle}|{faceitelo}|{faceitmatchlink}|{test}/gi

@import './twitch/permissioncheck.js'

@import './twitch/permission.js'

async function chathandle (channel, user, message, self) {
  // console.log({ channel, user, message, self })
  if (db.settingsprivate.blocked.indexOf(channel) !== -1) { return }
  if (self) { return }

  if (user && user['custom-reward-id']) {
    console.log('custom-reward-id', user.username, user['custom-reward-id'], message)
    if (message.toLowerCase() === 'id') {
      bot.say(channel, user['custom-reward-id'], 100)
      return
    }
  }

  // if (user && user.username === 'spddl') { // debug
  //   switch (message) {
  //     case 'mods':
  //       try {
  //         const mods = await client.mod(channel, 'spddl_gaming')
  //         console.log(mods)
  //       } catch (error) {
  //         console.warn(error)
  //       }
  //       break

  //     case 'addmod':
  //       try {
  //         const d1 = await client.mod(channel, 'spddl_gaming')
  //         console.log(d1)
  //       } catch (error) {
  //         console.warn(error)
  //       }
  //       break

  //     case 'delmod':
  //       try {
  //         const d2 = await client.unmod(channel, 'spddl_gaming')
  //         console.log(d2)
  //       } catch (error) {
  //         console.warn(error)
  //       }
  //       break

  //     default:
  //       break
  //   }
  // }

  //  hey hey - wäre es möglich dass man per 10000er nur normale Leute timeouten kann & für 20000 (neue Kachel) dann zusätzlich Mods?
  // Hey: slight_smile: Alles gut ? Wäre es möglich für 15000 Non Mods zu untimeouten & für 25000 Mods zu untimeouten ? Also Quasi opposite von den ersten beiden Schaltflächen ?

  // Timeout für 5 Minuten (10000er nur normale Leute)
  if (channel && channel === '#kirby' && user && user['custom-reward-id']) {
    const BanUser = user['custom-reward-id'] === 'cf8ec3b9-0321-4e7a-b4c1-af2869d365f3'
    const BanMods = user['custom-reward-id'] === '52f10542-381f-4a59-8c2b-986b9bed6245'
    const NonModsUnTimeout = user['custom-reward-id'] === '9a88d396-d4af-4ea8-9ce6-b9df271d38c3'
    const ModsUnTimeout = user['custom-reward-id'] === '1fdbd636-c9ed-45a3-872a-f56722a4d701'

    if (BanUser || BanMods || NonModsUnTimeout || ModsUnTimeout) {
      if (message === 'spddl_bot' || message === 'Klrbybot') {
        bot.say(channel, 'LUL', 100)
      } else {
        const TimeoutSek = 5 * 60
        const moderators = await client.mods(channel)
        console.log(`${moderators}.indexOf(${message}.toLowerCase()) === -1`, (moderators.indexOf(message.toLowerCase()) === -1 ? 'Ist kein Mod' : 'Ist Mod'))

        if (moderators.indexOf(message.toLowerCase()) === -1) {
          if (BanUser) {
            console.log('custom-reward-id: BanUser')
            console.log(`bot.timeout(${channel}, ${message}, ${TimeoutSek}, 'Timeout für 5 Minuten von: ${user.username}')`)
            bot.timeout(channel, message, TimeoutSek, `Timeout für 5 Minuten von: ${user.username}`) // ist kein MOD
          } else if (NonModsUnTimeout) {
            console.log('custom-reward-id: NonModsUnTimeout', { channel, message, time: 1, msg: `unTimeout von: ${user.username}` })
            console.log(`bot.timeout(${channel}, ${message}, 1, 'unTimeout von: ${user.username}')`)
            bot.timeout(channel, message, 1, `unTimeout von: ${user.username}`) // ist kein MOD
          } else if (ModsUnTimeout && kirbyMods[message]) {
            // Wenn der Mod gerade ein Timeout hat ist er atm auch kein Mod
            clearTimeout(kirbyMods[message])
            delete kirbyMods[message]
            console.log('custom-reward-id: ModsUnTimeout')

            console.log(`await clientKirby.timeout(${channel}, ${message}, 1, 'unTimeout')`)
            await clientKirby.timeout(channel, message, 1, 'unTimeout')
            setTimeout(async () => {
              console.log(`await clientKirby.mod(${channel}, ${message})`)
              await clientKirby.mod(channel, message)
            }, 1000)
          }
        } else {
          if (BanMods) {
            console.log('custom-reward-id: BanMods')

            console.log(`await clientKirby.mod(${channel}, ${message})`)
            await clientKirby.unmod(channel, message)
            setTimeout(() => {
              console.log(`bot.timeout(${channel}, ${message}, ${TimeoutSek}, 'Timeout für 5 Minuten von: ${user.username}')`)
              clientKirby.timeout(channel, message, TimeoutSek, `Timeout für 5 Minuten von: ${user.username}`)
            }, 1000)

            kirbyMods[message] = setTimeout(async () => { // TODO: in einer Var speichern, var uuid
              console.log(`await clientKirby.timeout(${channel}, ${message}, 1, 'unTimeout')`)
              await clientKirby.timeout(channel, message, 1, 'unTimeout')
              setTimeout(async () => {
                console.log(`await clientKirby.mod(${channel}, ${message})`)
                await clientKirby.mod(channel, message)
                delete kirbyMods[message]
              }, 1000)
            }, 5 * 60 * 1000)
          }
        }
      }
    }
  }

  // TEST
  if (channel && channel === '#spddl' && message === 'unmod') {
    const TimeoutSek = 5 * 60
    const moderators = await client.mods('#kirby')
    console.log(`${moderators}.indexOf(spddl) === -1`, moderators.indexOf('spddl'.toLowerCase()) === -1)

    const data = await clientKirby.unmod('#kirby', 'spddl')
    console.log('unmod', data)

    setTimeout(() => {
      console.log({ channel: '#kirby', message: 'spddl', time: TimeoutSek, msg: 'Timeout für 5 Minuten von: TEST' })
      clientKirby.timeout('#kirby', 'spddl', TimeoutSek, 'Timeout für 5 Minuten von: TEST')
    }, 1000)

    setTimeout(async () => {
      await clientKirby.timeout('#kirby', 'spddl', 1, 'unTimeout')
      console.log('await clientKirby.mod(#kirby, spddl)')
      setTimeout(async () => {
        try {
          await clientKirby.mod('#kirby', 'spddl')
        } catch (error) {
          console.warn(error)
        }
      }, 1000)
    }, 5 * 60 * 1000)
  }

  if (channel && channel === '#spddl' && message === 'mod') {
    clientKirby.mod('#kirby', 'spddl')
  }

  // #spddl, [object Object], asd, false
  // if (config.localhost()) log.debug('chathandle:  ' + channel + ', %j, ' + message + ', ' + self, user)
  // log.debug('chathandle:  ' + channel + ', %j, ' + message + ', ' + self, user)

  // console.log('%j', user)
  // console.log(util.inspect(user, false, null))

  if (!(user['user-type'] === 'mod' || user.username === channel.substr(1) || user.type === 'discord')) {
    // if(user.type == 'discord') { return }
    if (banwordsCheck(channel, message)) {
      console.info('BANWORDS ' + message)
      bot.timeout(channel, user.username, 20, 'BANWORD: ' + message)
      setTimeout(function () {
        console.log('bot.ban(' + channel + ', ' + user.username + ', BANWORD: ' + message + ')')
        bot.ban(channel, user.username, 'BANWORD: ' + message)
      }, 1500)
      return
    }
    if (towordsCheck(channel, message)) {
      console.info('TOWORDS ' + message)
      // bot.timeout(channel, user.username, 20, 'TOWORDS '+message)
      bot.timeout(channel, user.username, 20)
      return
    }
  }

  try {
    if (!(db.settingsprivate[channel.substr(1)].botsettings.ignorecmd.indexOf(message.toLowerCase().split(' ')[0]) === -1)) {
      // console.log('return 1598?!? // Um andere Bots/Befehle zu zulassen', message.toLowerCase().split(' ')[0])
      // 0 | bot | 2019 - 12 - 30T15: 04: 11.816Z - info: [#kirby]<ougizz>: !ruhe
      // 0 | bot | 2019 - 12 - 30T15: 04: 34.253Z - info: [#kirby]<syncd>: ich brauch absofort wieder gute lobbys
      // 0 | bot | 2019 - 12 - 30T15: 04: 38.728Z - info: [#kirby]<syncd>: das hat mir gerade mehr als den rest gegeben
      // 0 | bot | 2019 - 12 - 30T15: 05: 11.400Z - info: [#kirby]<ougizz>: !poits
      // 0 | bot | 2019 - 12 - 30T15: 05: 15.082Z - info: [#kirby]<ougizz>: !points
      // 0 | bot | 2019 - 12 - 30T15: 05: 15.082Z - info: return 1598 ? !? // Um andere Bots/Befehle zu zulassen
      return
    } // Um andere Bots/Befehle zu zulassen
  } catch (e) {
    console.warn(channel + ' ??'); return
  }

  if (message.substr(0, 1) === '#') {
    // if (user.type === 'discord') return // TODO: evtl. per text etwas wieder geben
    if (user.type === 'discord') if (!db.settingsprivate[channel.substr(1)].botsettings.discord.magicconchshell || false) return // TODO: evtl. per text etwas wieder geben (Fehlermeldung)

    if (AntiKappa.isSpam(message, channel.substr(1))) {
      return // console.log('REJECTED: ' + message); // console.log('REJECTED: ' + text + ' '+AntiKappa.isSpam(text, chan.substr(1)).debug)
    } else {
      settings[channel.substr(1)].messageArray.push(message) // console.log('ACCEPTED: ' + message)
    }

    // console.log('%j',user)
    var voicelanguage = (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicelanguage || 'UK English Female')
    if (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.autodetectlanguage || false) if (franc(message.substr(1), { whitelist: ['deu', 'eng'] }) === 'eng') voicelanguage = 'UK English Female'
    // if(db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.autodetectlanguage && (voicelanguage !== "Deutsch Female")) console.log('lang '+voicelanguage);

    if (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.modsonly || false) {
      if (user['user-type'] === 'mod' || user.username === channel.substr(1)) { // if(adminCheck(user.username, channel))
        io.of('/magicconchshell/' + channel.substr(1)).emit('incomingmsg', {
          user: user.username,
          username: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.username && true),
          color: user.color,
          text: message.substr(1),
          emotes: user.emotes,
          lang: voicelanguage,
          volume: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicevolume || 1),
          pitch: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicepitch || 1),
          rate: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicerate || 1),
          type: user.type
        })
        return
      }
    } else {
      io.of('/magicconchshell/' + channel.substr(1)).emit('incomingmsg', {
        user: user.username,
        username: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.username && true),
        color: user.color,
        text: message.substr(1),
        emotes: user.emotes,
        lang: voicelanguage,
        volume: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicevolume || 1),
        pitch: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicepitch || 1),
        rate: (db.settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicerate || 1),
        type: user.type
      })
      return
    }
  }

  // BUG: nach einem giveaway werden Commands nicht mehr erkannt
  if (user.username !== 'jtv') {
    // console.log("user.username !== 'jtv'", user.username + ' ' + channel) // Discord weil ich nur Offline Teste und es diesen Channel hier nicht gibt

    // console.log(channel);
    // console.log(settings[channel.substr(1)].giveaway);

    if (settings[channel.substr(1)].giveaway) {
      console.log('giveaway läuft')
      // wenn ein KeyWord verfügbar ist überprüfe es
      if (db.settingsprivate[channel.substr(1)].botsettings.giveaway.keyword) {
        if (db.settingsprivate[channel.substr(1)].botsettings.giveaway.keyword !== message) { return }
        console.log(db.settingsprivate[channel.substr(1)].botsettings.giveaway.keyword + ' !== ' + message)
      }

      console.log('keyword stimmt')

      if (giveawayCheck(user, channel)) {
        console.log('giveawayCheck')
        console.log(settings[channel.substr(1)].giveawaymembers) // nicht im array

        if (_.findIndex(settings[channel.substr(1)].giveawaymembers, { username: user.username }) === -1) {
          if (settings[channel.substr(1)].giveawaymembers.length === 0) { // ist array leer
            console.log('der erste == 0 ' + user.username)
            viewerava(user.username, function (twitchlogo) {
              if (twitchlogo !== null) twitchlogo = twitchlogo.substr(47)
              settings[channel.substr(1)].giveawaymembers.unshift({ color: user.color, 'display-name': user['display-name'], emotes: user.emotes, subscriber: user.subscriber, turbo: user.turbo, 'user-type': user['user-type'], username: user.username, msg: message, logo: twitchlogo })
              io.of('/giveaway/' + channel.substr(1)).emit('incomingmsg', { color: user.color, 'display-name': user['display-name'], emotes: user.emotes, subscriber: user.subscriber, turbo: user.turbo, 'user-type': user['user-type'], username: user.username, msg: message, logo: twitchlogo })
            })
          } else if (_.findIndex(settings[channel.substr(1)].giveawaymembers, { username: user.username }) === -1) { // falls nicht im Array
            console.log('ein weiterer == -1 ' + user.username)
            viewerava(user.username, function (twitchlogo) {
              if (twitchlogo !== null) twitchlogo = twitchlogo.substr(47)
              settings[channel.substr(1)].giveawaymembers.unshift({ color: user.color, 'display-name': user['display-name'], emotes: user.emotes, subscriber: user.subscriber, turbo: user.turbo, 'user-type': user['user-type'], username: user.username, msg: message, logo: twitchlogo })
              io.of('/giveaway/' + channel.substr(1)).emit('incomingmsg', { color: user.color, 'display-name': user['display-name'], emotes: user.emotes, subscriber: user.subscriber, turbov: user.turbo, 'user-type': user['user-type'], username: user.username, msg: message, logo: twitchlogo })
            })
          } else { console.log(user.username + ' kommt nicht (mehr) ins Giveaway') }
        }
      // } else {
        // console.log('giveawayCheck false %j', user)
      }
    }
  }

  if (db.settingsprivate[channel.substr(1)].botsettings.randomreply || false) {
    if (message === 'cookie') {
      if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Great! You jump off bridges when bots tell you to as well?' })
      else bot.say(channel, 'Great! You jump off bridges when bots tell you to as well?', 1)
      return
    }
  }

  // if(message.substr(0,4) == "!ads") { TODO
  //   if(user["user-type"] === "mod" || user.username === channel.substr(1)){
  //     advertising(channel, message, user.username);
  //     return;
  //   }
  // }

  // TODO ALT
  // if(message.substr(0, 1) == "!") {
  //   parseCmd(message.substr(1),channel,user)
  //   return
  // }
  if (user.type !== 'discord' && user.type !== 'steam' && user.type !== 'twitchgroup') {
    if (message.length > 5) { // mehr als 5 Zeichen
      let isSub = false
      if (user.badges) {
        isSub = 'subscriber' in user.badges || 'founder' in user.badges
      }

      if (!(isSub || user['user-type'] === 'mod' || user.username === channel.substr(1))) { // ist kein Admin
        // if (user.type === 'discord' || user.type === 'steam' || user.type === 'twitchgroup') { return } // Testing
        if (!UserCheck(user, channel, 'uppercase')) {
          // var uppercasetext = uppercase(message)
          // var uppercasetext = uppercase(withoutEmotes(message, user.emotes))
          var uppercasetext = uppercase(withoutEmotes(message, user.emotes).replace(/\s+/g, ''))
          if (uppercasetext >= (db.settingsprivate[channel.substr(1)].botsettings.uppercasepercent / 100)) { // 95% Fast alles groß geschrieben
            bot.timeout(channel, user.username, 20, 'TIMEOUT! (Capslock) Erlaubt sind ' + db.settingsprivate[channel.substr(1)].botsettings.uppercasepercent + '% und das waren: ' + (uppercasetext * 100).toFixed(2) + '%')
            setTimeout(function () {
              if (db.settingsprivate[channel.substr(1)].botsettings.wronguppercasemsg && true) {
                bot.say(channel, user.username + ', calm down! Try that again in 20 secs. BloodTrail [Capslock]', 3)
              }
            }, 1500)
            // checkViolations(user.username)
            return
          }
        }

        if (!UserCheck(user, channel, 'symbols')) {
          // var symbolstext = symbols(message)
          var symbolstext = symbols(message.replace(/\s+/g, ''))
          if (symbolstext >= (db.settingsprivate[channel.substr(1)].botsettings.symbolspercent / 100)) { // 55% über die hälfte nur Symbole
            bot.timeout(channel, user.username, 20, 'TIMEOUT! (Symbols) Erlaubt sind ' + db.settingsprivate[channel.substr(1)].botsettings.symbolspercent + '% und das waren: ' + (symbolstext * 100).toFixed(2) + '%')
            setTimeout(function () {
              if (db.settingsprivate[channel.substr(1)].botsettings.wrongsymbolsmsg && true) {
                bot.say(channel, user.username + ', calm down! Try that again in 20 secs. BloodTrail [Symbols]', 3)
              }
            }, 1500)
            // checkViolations(user.username)
            return
          }
        }
      }
    }

    if (!UserCheck(user, channel, 'postingdomains')) {
      if (!scanForLink(message, channel, user)) {
        // console.log(message+', '+channel+', %j',user)

        let isSub = false
        if (user.badges) {
          isSub = 'subscriber' in user.badges || 'founder' in user.badges
        }

        if (!(isSub || user['user-type'] === 'mod' || user.username === channel.substr(1))) {
          // console.log('user.username: '+user.username);
          if (settings[channel.substr(1)].allowing.indexOf(user.username.toLowerCase()) === -1) {
            bot.timeout(channel, user.username, 20, 'Timeout, da ein Link gepostet wurde ohne !permit')
            setTimeout(function () {
              if (db.settingsprivate[channel.substr(1)].botsettings.wronglinkmsg && true) {
                bot.say(channel, 'Ahem! ' + user.username + ', did you ask for permission to post that link?', 3)
              }
            }, 1500)
            // checkViolations(user.username)
          }
          return
        }
      }
    }
  }

  if ((message.toLowerCase().match('spddl_bot') !== null) && user.username === 'spddl') { bot.say(channel, (Math.random() < 0.5) ? 'Hey spddl! (✌ﾟ∀ﾟ)☞ ' : 'Hey spddl! ༼ つ ◕_◕ ༽つ'); return }

  textScan(message, channel, user.username, user) // damit der Bot auch auf "bot" reagiert
  permissioncheck(message, user, channel)
}

@import './twitch/AntiKappa.js'

// Handle on connect event
client.on('connected', function (address, port) {
  log.notice('*** Bot Connected ***')
  if (!config.localhost()) {
    if (start) { // nur beim "echten Restart" anzeigen
      bot.whisper('spddl', '*** B0t Connected *** ' + utc)
      // bot.whisper('spddl','*** B0t Connected *** '+address+':'+port+' - '+utc)
      // bot.say('#spddl_bot','*** B0t Connected *** '+utc,1)
    }
  }
})

// @ import './twitch/api/GroupUserChatters.js'

@import './twitch/UserCheck.js'

@import './twitch/giveawayCheck.js'

@import './twitch/viewerava.js'

// @ import './twitch/counter.js'

@import './twitch/followeralert.js'

@import './twitch/banwordsCheck.js'

@import './twitch/towordsCheck.js'

@import './twitch/uppercase.js'

@import './twitch/symbols.js'

@import './twitch/textScan.js'

@import './twitch/scanForLink.js'

@import './twitch/youtubetowhisper.js'

@import './twitch/getRandomReply.js'

// @ import './twitch/steamstatus.js'

// @ import './twitch/market.js'

// @ import './twitch/knife.js'

// @ import './twitch/isJson.js'

// @ import './twitch/esea.js'

// @ import './twitch/lastesea.js'

// @ import './twitch/giveaway.js'

// @ import './twitch/TwitchPost.js'

@import './twitch/cb.js'

// @ import './twitch/cbstop.js'

// @ import './twitch/advertising.js'

// @ import './twitch/addcommand.js'

// @ import './twitch/deletecommand.js'

// @ import './twitch/addmod.js'

// @ import './twitch/delmod.js'

// @ import './twitch/adddomain.js'

// @ import './twitch/deldomain.js'

// @ import './twitch/addignorecmd.js'

// @ import './twitch/delignorecmd.js'

// @ import './twitch/addbanwords.js'

// @ import './twitch/delbanwords.js'

// @ import './twitch/addtowords.js'

// @ import './twitch/deltowords.js'

// @ import './twitch/addcounter.js'

// @ import './twitch/delcounter.js'

@import './twitch/channelonline.js'
setInterval(() => { channelonline() }, 30000) // 1min
channelonline()

const KirbyCommunityChannel = {}
@import './twitch/CommunityChannelOnline.js'
setInterval(() => { CommunityChannelOnline() }, 38400)
CommunityChannelOnline()

// @ import './twitch/getStatus.js'

// @ import './twitch/notification.js'

setInterval(() => { io.of('/follower/demo').emit('incomingmsg', { created_at: +new Date(), id: 9999, name: Math.random().toString(36).replace(/[^a-z]+/g, '') }) }, 10000) // 10sek
setInterval(() => { io.of('/subscriber/demo').emit('incomingmsg', { texttext: Math.random().toString(36).replace(/[^a-z]+/g, ''), lang: 'Deutsch Female' }) }, 12000) // 12sek
setInterval(() => { io.of('/submit/demo').emit('incomingmsg', { user: Math.random().toString(36).replace(/[^a-z]+/g, ''), text: Math.random().toString(36).replace(/[^a-z]+/g, '') + ' 1234-5678-9012-3456', lang: 'Deutsch Female' }) }, 9000) // 9sek
setInterval(() => { io.of('/magicconchshell/demo').emit('incomingmsg', { user: Math.random().toString(36).replace(/[^a-z]+/g, ''), text: 'Lorem Kappa ipsum dolor sit amet, consectetuer adipiscing bleedPurple duDudu KappaRoss elit. Aenean commodo ligula eget dolor. Aenean massa.', emotes: { 25: ['7-11'], 62834: ['71-76'], 62835: ['59-69'], 70433: ['78-86'] }, lang: 'Deutsch Female', volume: 1, pitch: 1, rate: 1 }) }, 10000) // 10sek // "emote":{"25":["7-11"],"62834":["71-76"],"62835":["59-69"],"70433":["78-86"]} // "emotes":"62835:59-69/25:7-11/62834:71-76/70433:78-86"

@import './twitch/twitch-realtime.js'
