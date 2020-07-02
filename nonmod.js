'use strict'

const port = process.env.OPENSHIFT_NODE4_PORT || 80
const ip = process.env.OPENSHIFT_NODE4_IP || '127.0.0.1'
const storage = process.env.OPENSHIFT_DATA_DIR || './storage/' // $OPENSHIFT_DATA_DIR

const irc = require('tmi.js')
const async = require('async')

function localhost () {
  if (ip === '127.0.0.1') return true
  else return false
}
/// /////////////////////////////////////////////////////////////////////////////
//
// Twitch Server
//
/// /////////////////////////////////////////////////////////////////////////////
/*
  Command & Message Limit // https://github.com/justintv/Twitch-API/blob/3ae9be660acc46941556c225903708d34c28ef26/IRC.md#command--message-limit

  If you send more than 20 commands or messages to the server within a 30 second period, you will be locked out for 30 minutes automatically. These are not lifted so please be careful when working with IRC!
  This limit is elevated to 100 messages per 30 seconds for users that only send messages/commands to channels in which they have Moderator/Operator status.
*/
global.bot = {}
global.bot.limit = 0

const q = async.priorityQueue(function (c, cb) {
  global.bot.limit++

  switch (c.cmd) {
    case 'say': client.say(c.chan, c.msg); break
    case 'timeout': client.timeout(c.chan, c.user, c.time, c.reason); break
    case 'ban': client.ban(c.chan, c.user, c.reason); break
    case 'whisper': client.whisper(c.chan, c.msg); break
  }
  setTimeout(function () {
    global.bot.limit--
    cb()
  }, 30000) // 30 Sek
}, 19) // 20

const client = new irc.client({
  options: {
    debug: false,
    debugIgnore: ['chat', 'action', 'ping', 'part']
    // debugIgnore: ['chat','action','ping','part','join']
  },
  connection: {
    cluster: 'aws',
    secure: true,
    reconnect: true
  },
  identity: {
    username: 'spddl', // username: "spddl_bot",
    password: 'oauth:' // password: "oauth:"
  },
  // channels: ["#spddl_bot"]
  // channels: ["#nookyyy"]
  channels: ['#gronkh', '#lirik', '#germenchrestream', '#riotgames', '#lvpes', '#summonersinnlive', '#esl_csgo', '#noobstream24', '#rocketleague']
})

const bot = { // [Prio] niedriger ist wichtiger
  say: function (chan, msg, prio) {
    q.push({ cmd: 'say', chan: chan, msg: msg }, prio, function (err) {
      err && console.error(err)
    })
  },
  timeout: function (chan, user, time, reason) {
    q.push({ cmd: 'timeout', chan: chan, user: user, time: time, reason: reason }, 8, function (err) {
      err && console.error(err)
    })
  },
  ban: function (chan, user, reason) {
    q.push({ cmd: 'ban', chan: chan, user: user, reason: reason }, 9, function (err) {
      err && console.error(err)
    })
  },
  whisper: function (chan, msg, prio) {
    q.push({ cmd: 'whisper', chan: chan, msg: msg }, prio, function (err) {
      err && console.error(err)
    })
  }
}

client.on('disconnected', function (reason) {
  console.log(' Twitch disconnected ' + reason + ' ', 'notice')
}).on('logon', function () {
  console.log(' Twitch bot logon', 'notice')
}).on('notice', function (channel, msgid, message) {
  if (msgid === 'msg_banned') { client.part(channel) }
  console.log(channel + ', ' + msgid + ', ' + message)
  // }).on("pong", function (latency){  console.notice('pong '+latency);
  // }).on("connecting", function (address, port){ console.notice('Bot Address: '+address+', port: '+port);
  // }).on("ban", function (channel, username, reason) { console.notice('BAN: '+channel+', > '+username+', '+reason)
  // }).on("timeout", function (channel, username, reason, duration) { console.notice('TO: '+channel+', > '+username+', '+reason+' ('+duration+')')
}).on('serverchange', function (channel) {
  console.log(' serverchange: ' + channel)
}).on('resub', function (channel, username, months, message, userstate, methods) {
  // console.log("resub: months: "+months+", message: "+message+', userstate: %%j, methods: %j',userstate,methods);
  // console.log("resub:        "+methods.plan+' - '+months+' // %j',methods);
  // console.log("resub:        "+methods.plan+' '+check(methods.plan).n+' - '+months+' // %j',methods);

  try {
    console.log(channel + ', !sub Subscription ' + months + ' months [' + username + ']; !add ' + (months * check(methods.plan).n / 5 * 100) + ' (' + check(methods.plan).v + ')')
  } catch (e) {
    console.log(e)
    console.log(username + ' ' + months + ', ' + methods.plan)
  }
}).on('subscription', function (channel, username, methods, message, userstate) {
  // console.log("subscription: message: "+message+', userstate: %%j, methods: %j',userstate,methods);
  // console.log('subscription: '+methods.plan+' // %j',methods);
  // console.log('subscription: '+methods.plan+' '+check(methods.plan).n+' // %j',methods);

  try {
    console.log(channel + ', !sub New Subscription [' + username + ']; !add ' + (check(methods.plan).n / 5 * 100) + ' (' + check(methods.plan).v + ')')
  } catch (e) {
    console.log(e)
    console.log(username + ' subscription, ' + methods.plan)
  }

  // console.log(check(methods.plan));
  // }).on("roomstate", function (channel, state) { if (settings[channel.substr(1)]) { settings[channel.substr(1)].roomstate = state; } else { settings[channel.substr(1)] = {}; settings[channel.substr(1)].roomstate = state; } //console.log('roomstate: '+channel+', '+state); console.info('roomstate: '+channel+' '+(state["broadcaster-lang"] === null ? '' : "broadcaster-lang: "+state["broadcaster-lang"]) , (state.r9k === false ? '' : " r9k: "+state.r9k) , (state.slow === false ? '' : " slow: "+state.slow) , (state['subs-only'] === false ? '' : " subs-only: "+state['subs-only']))
}).on('reconnect', function () {
  console.log(' Twitch reconnect ')
})
// if (localhost()) { client.on("pong", function (latency){ console.log('pong '+latency) }) }
client.connect()

function methods_plan_check (methods_plan) {
  let m
  switch (methods_plan) {
    case 'Prime': m = { v: 'Prime', n: 5 }; break
    case '1000': m = { v: '$4.99', n: 5 }; break
    case '2000': m = { v: '$9.99', n: 10 }; break
    case '3000': m = { v: '$25.99', n: 25 }; break
  }
  return m
}

// console.log(months * check(methods.plan).n / 5 * 100);

// switch (methods.plan) {
//   var m
//   case 1000: m='$4.99'; break;
//   case 2000: m='$9.99'; break;
//   case 3000: m='$24.99'; break;
//   return m
// }

client.on('action', function (channel, user, message, self) {
  // chathandle(channel, user, message, self)
})

client.on('chat', function (channel, user, message, self) {
  // chathandle(channel, user, message, self)
})

function chathandle (channel, user, message, self) {
  if (message.substr(0, 1) == '!') {
    parseCmd(message.substr(1), channel, user)
  }
}

function parseCmd (cmd, channel, user) {
  // if(localhost()) console.info('parseCmd(cmd: '+cmd+', channel: '+channel+', user: %j )', user)

  const cmdall = cmd
  cmd = cmd.split(' ')

  switch (cmd[0].toLowerCase()) {
    case 'font':
    case 'fonts':
      // bot.say(channel,'http://fonts.spddl.de/#Calibri.',8);
      bot.say(channel, '@' + user.username + ' fonts spddl de #Calibri Kappa', 8)
      break
    case 'donation':
      bot.say(channel, '@' + user.username + ' tipeeestream com nookyyy donation', 8)
      break
    case 'cookies':
      bot.say(channel, '@' + user.username + ', der CookieBot ist gebannt kommt aber wieder', 8)
      break
    /* case "maps":
      bot.say(channel,'@'+user.username+', 1. Epsilon removed Nuke, 2. BIG removed Cache, 3. Epsilon removed Train, 4. BIG removed Overpass, 5. Epsilon picked Cobblestone, 6. BIG picked Dust2, 7. Mirage was left over',8);
    break; */
  }
}
