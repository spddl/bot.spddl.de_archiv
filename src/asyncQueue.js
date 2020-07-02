global.bot = {}
global.bot.limit = 0

var q = async.priorityQueue(function (c, cb) {
  global.bot.limit++
  // if(global.bot.limit % 5 === 0) console.log('\x1b[35m['+global.bot.limit+']\x1b[39m')

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
}, 99) // 100

q.saturated = function () {
  log.separator(' saturated ', 'emergency')
}