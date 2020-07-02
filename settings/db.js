'use strict'
exports = module.exports = {}

const config = require('./config.js')()
const jf = require('jsonfile')
const _ = require('underscore')
const Log = require('compact-log') // https://www.npmjs.com/package/compact-log
const prettyHrtime = require('pretty-hrtime')

const log = new Log({ levelMode: 'SMART' })
let dir // = './storage/'

if (config.localhost()) {
  dir = './storage/'
} else {
  dir = '/root/storage/'
}

// [
//   { "op": "replace", "path": ['a'], "value": 3 }
// ]
/*
function settings_save() { // Save function
  let settingsclone={}
  settingsclone.server=settings.server
  settingsclone.botName=settings.botName
  settingsclone.botNick=settings.botNick
  settingsclone.password=settings.password
  settingsclone.admins=settings.admins
  settingsclone.discordemail=settings.discordemail
  settingsclone.discordpassword=settings.discordpassword
  settingsclone.admins=settings.admins
  if (config.localhost()) {
    settingsclone.localchannels=settings.channels
    settingsclone.localbotchannels=settings.botchannels
    settingsclone.channels=settings.onlinechannels
    settingsclone.botchannels=settings.onlinebotchannels
  } else {
    settingsclone.localchannels=settings.localchannels
    settingsclone.localbotchannels=settings.localbotchannels
    settingsclone.channels=settings.channels
    settingsclone.botchannels=settings.botchannels
  }
  settingsclone.swears=settings.swears
  settingsclone.quotes=settings.quotes
  settingsclone.backtalk=settings.backtalk
  settingsclone.adminMsgs=settings.adminMsgs
  jf.writeFileSync(storage+'settings.json', settingsclone)
  log.separator('settings_save', 'info');
  delete settingsclone
}
*/

exports.updatedb = () => {
  return new Promise(function (resolve) {
    var time = process.hrtime()
    exports.commands = jf.readFileSync(dir + 'commands.json')
    exports.settingsprivate = jf.readFileSync(dir + 'settingsprivate.json')
    var diff = process.hrtime(time)
    resolve('updatedb: took ' + prettyHrtime(diff))
  })
}

// Settings
exports.settings = jf.readFileSync(dir + 'settings.json')
exports.settings_save = () => {
  return new Promise(function (resolve) {
    clearTimeout(global.settings_save) // Kill the timer
    global.settings_save = _.delay(function () {
      exports.exports.settings.lastupdated = new Date()
      jf.writeFileSync(dir + 'settings.json', exports.settings)
      log.separator(dir + 'settings.json SAVE', 'info')
    }, 15000) // speichert nur alle 15 sek
    resolve(true)
  })
}

// Commands
exports.commands = jf.readFileSync(dir + 'commands.json')
exports.commands_save = () => {
  return new Promise(function (resolve) {
    clearTimeout(global.commands_save) // Kill the timer
    global.commands_save = _.delay(function () {
      exports.commands.lastupdated = new Date()
      jf.writeFileSync(dir + 'commands.json', exports.commands)
      log.separator(dir + 'commands.json SAVE', 'info')
    }, 15000) // speichert nur alle 15 sek
    resolve(true)
  })
}

// Data
exports.data = jf.readFileSync(dir + 'data.json')
exports.data_save = () => {
  return new Promise(function (resolve) {
    clearTimeout(global.data_save) // Kill the timer
    global.data_save = _.delay(function () {
      exports.data.lastupdated = new Date()
      jf.writeFileSync(dir + 'data.json', exports.data)
      log.separator(dir + 'data.json SAVE', 'info')
    }, 15000) // speichert nur alle 15 sek
    resolve(true)
  })
}

// private
exports.privatee = jf.readFileSync(dir + 'private.json')
exports.privatee_save = () => {
  return new Promise((resolve) => {
    clearTimeout(global.privatee_save) // Kill the timer
    global.privatee_save = setTimeout(() => {
    // global.privatee_save = _.delay(() => {
      exports.privatee.lastupdated = new Date()
      jf.writeFileSync(dir + 'private.json', exports.privatee)
      log.separator(dir + 'private.json SAVE', 'info')
    }, 15000) // speichert nur alle 15 sek
    resolve(true)
  })
}

// settingsprivate
exports.settingsprivate = jf.readFileSync(dir + 'settingsprivate.json')
exports.settingsprivate_save = () => {
  return new Promise(function (resolve) {
    clearTimeout(global.settingsprivate_save) // Kill the timer
    global.settingsprivate_save = _.delay(function () {
      exports.settingsprivate.lastupdated = new Date()
      jf.writeFileSync(dir + 'settingsprivate.json', exports.settingsprivate)
      log.separator(dir + 'settingsprivate.json SAVE', 'info')
    }, 15000) // speichert nur alle 15 sek
    resolve(true)
  })
}

// voicecommands
exports.voicecommands = jf.readFileSync(dir + 'voicecommands.json')
exports.voicecommands_save = () => {
  return new Promise(function (resolve) {
    clearTimeout(global.voicecommands_save) // Kill the timer
    global.voicecommands_save = _.delay(function () {
      jf.writeFileSync(dir + 'voicecommands.json', exports.voicecommands)
      log.separator(dir + 'voicecommands.json SAVE', 'info')
    }, 15000) // speichert nur alle 15 sek
    resolve(true)
  })
}
