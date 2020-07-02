'use strict'
// exports = module.exports = {};

const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/db', { useMongoClient: true })
mongoose.Promise = global.Promise

const botdb = new Schema({
  name: String,
  private: {
    oauth: String,
    lastupdated: String,
    _id: Number
  },
  botsettings: {
    advertising: { type: Array, default: [] },
    facebookapi: { type: Number, default: 0 },
    randomreply: { type: Boolean, default: false },
    uppercase: { type: Boolean, default: true },
    uppercasepercent: { type: String, default: '95' },
    symbols: { type: Boolean, default: false },
    symbolspercent: { type: String, default: '55' },
    towords: [],
    banwords: [],
    weather: { type: Boolean, default: true },
    youtubetowhisper: { type: Boolean, default: true },
    wrongcommandmsg: { type: Boolean, default: true },
    wronglinkmsg: { type: Boolean, default: true },
    wrongsymbolsmsg: { type: Boolean, default: true },
    wronguppercasemsg: { type: Boolean, default: true },
    alloweddomains: { type: Array, default: ['youtube.com', 'soundcloud.com', 'youtu.be', 'steamcommunity.com', 'reddit.com'] },
    alerts: {
      chat: { type: Boolean, default: false },
      steam: { type: Boolean, default: false },
      follower: {
        voicelanguage: { type: String, default: 'Deutsch Female' }
      },
      subscription: {
        voicelanguage: { type: String, default: 'Deutsch Female' }
      },
      magicconchshell: {
        modsonly: { type: Boolean, default: true },
        username: { type: Boolean, default: true },
        autodetectlanguage: { type: Boolean, default: true },
        voicelanguage: { type: String, default: 'Deutsch Female' },
        voicevolume: { type: Number, default: 1 },
        voicepitch: { type: Number, default: 1 },
        voicerate: { type: Number, default: 1 }
      }
    },
    giveaway: {
      host: { type: Boolean, default: false },
      mod: { type: Boolean, default: true },
      subcriber: { type: Boolean, default: true },
      turbo: { type: Boolean, default: true },
      viewer: { type: Boolean, default: true }
    },
    steam: {
      account: { type: Array, default: [] },
      steamgroup: { type: Array, default: [] }
    },
    discord: {
      magicconchshell: { type: Boolean, default: false },
      onlinemsg: { type: String, default: '' },
      twitternews: { type: String, default: '' },
      right: { type: Array, default: [] }
    },
    mods: { type: Array, default: [] },
    eseaid: { type: String, default: '' },
    twittername: { type: String, default: '' },
    lastfmname: { type: String, default: '' },
    check24h: { type: Boolean, default: false },
    check24hwhisper: { type: Boolean, default: false },
    automaticannouncements: { type: Boolean, default: false },
    wrongcommandlevenshtein: { type: Number, default: 3 },
    followercheck: { type: Boolean, default: false },
    ignorecmd: { type: Array, default: [] },
    cmd: [
      {
        name: String,
        mod: { type: Boolean, default: false },
        host: { type: Boolean, default: false },
        subscriber: { type: Boolean, default: false },
        viewer: { type: Boolean, default: true },
        turbo: { type: Boolean, default: false },
        text: String
      }
    ],
    counter: [
      {
        name: String,
        text: String,
        c: Number
      }
    ]
  }
})
const db = mongoose.model('botdb', botdb)
// exports = mongoose.model('botdb', botdb)

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
// db.findOne({ 'name': 'spddl_bot' }, 'botsettings.symbols', function (err, data) {
//   if (err) console.warn(err);
//   console.log(data);
//   // console.log('%s', data.botsettings.symbols) // Space Ghost is a talk show host.
// })

exports = module.exports = db
exports.save = (obj) => {
  const database = new db(obj).save(function (err) {
    if (err) console.log(err)
    else {
      console.log('_saved', err)
    }
  })
}

// db.findOne({ 'name': 'spddl_bot' }, 'botsettings.symbols', function (err, data) {

const arr = [{
  name: '!add',
  mod: true,
  host: true,
  subscriber: false,
  viewer: false,
  turbo: false,
  text: '{add}'
}]

const obj = {
  name: '!add',
  mod: true,
  host: true,
  subscriber: false,
  viewer: false,
  turbo: false,
  text: '{add}'
}

// db.update({ name: 'spddl_bot' }, 'botsettings.cmd', { $pushAll: { values: arr } },{ upsert: true },function(err){
db.update({ name: 'spddl_bot' }, 'botsettings', { $push: { cmd: obj } }, { upsert: true }, function (err) {
  if (err) console.log(err)
  console.log('Successfully added')
})

// exports.findOne = (obj, callback) => {
//   console.time("find");
//   db.findOne(obj, function (err, data) {
//       if (err) return handleError(err);
//       callback(data)
//       // console.log(data.botsettings.uppercase)
//       console.timeEnd("find");
//   })
// }
