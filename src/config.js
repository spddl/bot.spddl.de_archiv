log.separator(' ' + db.settings.channels.length + ' Channels ', 'info')

const startTime = new Date()
const utc = new Date(startTime.getTime() + startTime.getTimezoneOffset() * 70000)
// var admins = settings.admins

setInterval(function () { // Wird hoffentlich bald durch sockets Ersetzt
  for (var i = 0; i < settings.channels.length; i++) {
    // if (!settingsprivate[settings.channels[i].substr(1)].botsettings.tipeeestream) {
    followeralert(settings.channels[i].substr(1))
    // }
  }
}, 3e5) // 1 Min 6e4 // Twitchalerts 5min (300000 / 3e5) // 4min 24e4

setInterval(function () {
  for (var i = 0; i < settings.channels.length; i++) {
    var x = settings.channels[i].substr(1)
    if (settings[x]) {
      settings[x].messageArray = []
    } else {
      settings[x] = {}
      settings[x].messageArray = []
    }
  }
}, 6e3) // 10 Min 6e5

for (let i = 0; i < settings.channels.length; i++) {
  const chanObj = settings.channels[i].substr(1)
  settings[chanObj] = {}
  settings[chanObj].allowing = []
  settings[chanObj].online = {
    status: false,
    OnCount: 0,
    minOnlineCount: 5,
    OffCount: 0,
    minOfflineCount: 5
  }
  settings[chanObj].giveaway = false // auto: an "true" / aus "false" TODO
  // settings[chanObj].giveawaysimple = false
  settings[chanObj].giveawaymembers = []
  // settings[chanObj].giveawaymembers = [{ username: 'user', msg: 'msg'}]
  // settings[chanObj].giveawaymembers = [{ username: '1user', msg: '1msg'}, { username: '2user', msg: '2msg'}, { username: '3user', msg: '3msg'}, { username: '4user', msg: '4msg'},{ username: '5user', msg: '5msg'},{ username: '6user', msg: '6msg'},{ username: '7user', msg: '7msg'},{ username: '8user', msg: '8msg'},{ username: '9user', msg: '9msg'},{ username: '10user', msg: '10msg'},{ username: '11user', msg: '11msg'},{ username: '12user', msg: '12msg'},{ username: '13user', msg: '13msg'},{ username: '14user', msg: '14msg'}]
  settings[chanObj].giveawaysuspend = []
  settings[chanObj].messageArray = []
  settings[chanObj].follows = []
  // settings[chanObj].roomstate = { "broadcaster-lang": null, "channel": chanObj, "emote-only": null, "r9k": null, "slow": null, "subs-only": null }
  settings[chanObj].roomstate = { 'broadcaster-lang': null, 'emote-only': null, r9k: null, slow: null, 'subs-only': null }

  try {
    // `CREATE TABLE IF NOT EXISTS twitch.spddl (
    //   \`_date\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    //   \`user\` VARCHAR(50) NOT NULL,
    //   \`coins\` INT(10) UNSIGNED NULL DEFAULT NULL,
    //   PRIMARY KEY (\`user\`),
    //   UNIQUE INDEX \`user\` (\`user\`)
    // )
    // COLLATE='latin1_swedish_ci'
    // ENGINE=InnoDB
    // ROW_FORMAT=COMPACT;`
  } catch (err) {
    console.warn('MySQL:', err)
  }

  try {
    /* if (db.settingsprivate[chanObj].settings.twittername){
      twitterlookup(db.settingsprivate[chanObj].botsettings.twittername,function(erg){
        settings[chanObj].twitterid = erg;
      })
    } */
    // if (!settingsprivate[chanObj].botsettings.tipeeestream) {
    followeralert(chanObj, true)
    // }

    // setInterval(function(){  process.nextTick(function x() { settings[chanObj].messageArray = [] }) },600000); // 10 Min

    if (db.settingsprivate[chanObj].botsettings.advertising.length !== 0) { // Werbung
      _.each(db.settingsprivate[chanObj].botsettings.advertising, function (json, index) {
        // console.log('caster: '+chanObj,json);
        cb(chanObj, json.id, json.time, json.text)
      })
    }
  } catch (err) {
    console.log('Neuer Channel? ' + chanObj)
    console.log('-----------------------------')
    console.log('err: ', err)

    db.settingsprivate[chanObj] = {}
    db.settingsprivate[chanObj].botsettings = {}
    db.settingsprivate[chanObj].botsettings.advertising = []
    db.settingsprivate[chanObj].botsettings.alloweddomains = ['youtube.com', 'soundcloud.com', 'youtu.be', 'steamcommunity.com', 'reddit.com']
    db.settingsprivate[chanObj].botsettings.alerts = {}
    db.settingsprivate[chanObj].botsettings.alerts.follower = {}
    db.settingsprivate[chanObj].botsettings.alerts.subscription = {}
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell = {}
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.modsonly = false
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.username = false
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.autodetectlanguage = false
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.voicelanguage = 'Deutsch Female'
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.voicevolume = 1
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.voicepitch = 1
    db.settingsprivate[chanObj].botsettings.alerts.magicconchshell.voicerate = 1
    db.settingsprivate[chanObj].botsettings.giveaway = {}
    db.settingsprivate[chanObj].botsettings.steam = {}
    db.settingsprivate[chanObj].botsettings.steam.account = []
    db.settingsprivate[chanObj].botsettings.steam.steamgroup = []
    db.settingsprivate[chanObj].botsettings.discord = {}
    db.settingsprivate[chanObj].botsettings.uppercasepercent = '95'
    db.settingsprivate[chanObj].botsettings.symbolspercent = '55'
    db.settingsprivate[chanObj].botsettings.mods = [] // TODO TESTEN MODS
    db.settingsprivate[chanObj].botsettings.towords = []
    db.settingsprivate[chanObj].botsettings.banwords = []
    db.settingsprivate[chanObj].botsettings.ignorecmd = []
    db.settingsprivate[chanObj].botsettings.check24h = false
    db.settingsprivate[chanObj].botsettings.check24hwhisper = false
    db.settingsprivate[chanObj].botsettings.wrongcommandlevenshtein = 3
    db.settingsprivate_save()

    db.commands[chanObj] = {}
    db.commands[chanObj].cmd = {}
    db.commands[chanObj].counter = {}
    db.commands_save()

  //   setTimeout(function () {
  //     console.log('- Restart -')
  //     process.exit(1)
  //   }, 16 * 1000)
  }
}

db.settings.demo = {}
db.settings.demo.giveawaymembers = []

_.each(db.settings.channels, function (data) {
  data = data.substr(1)
  viewerava(data, function (twitchlogo) {
    if (twitchlogo !== null) twitchlogo = twitchlogo.substr(47)
    db.settings.demo.giveawaymembers.push({ username: data, msg: 'Enjoy my stream http://www.twitch.tv/' + data, logo: twitchlogo })
  })
})

function StreamerCheck (name) { // gehört der Name zu einem Streamer
  if (name === undefined) { return false }
  for (var i = 0; i < db.settings.channels.length; ++i) {
    if ((db.settings.channels[i].substr(1)) === name.toLowerCase()) {
      return true
    }
  }
  return false
}

function StreamerModCheck (name, cb) {
  cb(
    _.filter(db.settings.channels, function (caster) { // caster
      return name === caster.substr(1)
    })
    ,
    _.filter(db.settings.channels, function (caster) { // Mods
      // if (db.settingsprivate[caster.substr(1)].botsettings.mods[name]) { return caster.substr(1) }
      try {
        if (db.settingsprivate[caster.substr(1)].botsettings.mods) {
          if (db.settingsprivate[caster.substr(1)].botsettings.mods.toString().toLowerCase().indexOf(name.toLowerCase()) > -1) { return caster.substr(1) } // TODO TESTEN MODS
        } else {
          console.warn('StreamerModCheck', db.settingsprivate[caster.substr(1)].botsettings)
        }
      } catch (e) {
        console.warn(e)
      }
    })
  )
}
