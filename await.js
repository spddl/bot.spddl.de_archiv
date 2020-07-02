var prettyHrtime = require('pretty-hrtime');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');
var fs = require('fs');
var request = require('request');

const user = {
  'badges': { 'broadcaster': '1', 'warcraft': 'horde' },
  'color': '#FFFFFF',
  'display-name': 'Schmoopiie',
  'emotes': { '25': [ '0-4' ] },
  'mod': true,
  'room-id': '58355428',
  'subscriber': false,
  'turbo': true,
  'user-id': '58355428',
  'user-type': 'mod',
  'emotes-raw': '25:0-4',
  'badges-raw': 'broadcaster/1,warcraft/horde',
  'username': 'schmoopiie',
  'message-type': 'chat'
}

const db = {
  "!cfg": {
    "permission": {
      "host": true,
      "mod": true,
      "subscriber": false,
      "turbo": true,
      "viewer": true
    },
    "text": "www.fb.com"
  }
}

function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
};

var steamapikey = '' // http://steamcommunity.com/dev/apikey

const mm = async (function() {
  return new Promise(function (resolve, reject) {
    request({url:'http://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v001/?key='+steamapikey,json: true}, function (error, res, body) {
      if (!error) {
        resolve(body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer &#248;Wartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden');
      } else {
        reject(error);
      }
    });
  });
})

function replace_function(data){
  return data;
}

//var msg = 'abc defg hij{NICK}klmn{FollowAt}opq: {NICK} - {MM}'
var msg = 'abc defg hij'

const find = function(msg, target) {
  return [msg.indexOf(target) !== -1,target]
};

const hello = function() {
  console.log('HELLO--------------------');
  return true
};

const arr = [
  find(msg, '{NICK}'),  // Find Benchmark
  find(msg, '{CHANNEL}'),
  find(msg, '{MM}'),
  find(msg, '{FollowAt}'),
  find(msg, '{RANDOM}'),
  find(msg, '{FollowFromNow}')
]
function local() {
  return true
}
const compoundOperation = async (function () {
  let time
  if (local()) { time = process.hrtime() }

  if (!find(msg,'{')[0] && !find(msg,'}')[0]) { // TODO evtl. regex
    if (local()) { console.info(prettyHrtime(process.hrtime(time))) }
    return msg;
  }

  const test = await(arr);
  let msgprocess=[]
  let msgprocesslist=[]
  for (let i = 0, len = test.length; i < len; i++) {
    if (test[i][0]) {
      msgprocesslist.push(test[i][1])
      switch (test[i][1]) {
        case '{NICK}': msgprocess.push(replace_function(user.username)); break;
        case '{CHANNEL}': msgprocess.push(replace_function('CHANNEL')); break;
        case '{MM}': msgprocess.push(mm()); break;
        case '{FollowAt}': msgprocess.push(replace_function('Ein Land vor unser Zeit')); break;
        case '{RANDOM}': msgprocess.push(replace_function('R4NDOM')); break;
        case '{FollowFromNow}': msgprocess.push(replace_function('FollowFromNow')); break;
      }
    }
  }

  if (msgprocess.length) {
    const result = await(msgprocess);
    for (let i = 0, len = msgprocesslist.length; i < len; i++) {
      msg=msg.replace(new RegExp(msgprocesslist[i],'g'), result[i]); // Replace Benchmark
    }
  }
  if (local()) { console.info(prettyHrtime(process.hrtime(time))) }
  return msg;
});

// Start the compound operation.
compoundOperation().then(function (result) { console.log(result); })
compoundOperation().then(function (result) { console.log(result); });
