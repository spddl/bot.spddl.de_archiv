

































const prettyHrtime = require('pretty-hrtime');
// const async = require('asyncawait/async');
// const await = require('asyncawait/await');
// const Promise = require('bluebird');
const fs = require('fs');
const request = require('request');

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


function mm(channel,user){
    //console.info('mm '+channel+', '+user)

    request({url:'http://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v001/?key='+steamapikey,json: true}, function(err, res, body){ //hole mir die Aktuellen Daten aus der Steam API
      if(err !== null){console.emergency('fn mm err: '+err)}
      if(body !== undefined) { // Steam API Down?
        console.info('  API Daten gefunden');

          // TypeError: Cannot read property 'matchmaking' of undefined
          if(body.result.matchmaking !== undefined){
/*            if(user.type === 'twitchgroup'){
              groupirc.say('#jtv','/w '+user.substr(8)+' Steam WebAPI is down. :steambored:')
            }*/

            //console.log(channel+" %j", user)
            //groupirc.say('#jtv','/w '+user.username+' '+body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer &#248;Wartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden')


            //if (user.type === 'steam') steam_say(user,body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer øWartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden')
            if (user.type === 'steam') steam_say(user,body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer øWartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden')
            else if (user.type === 'twitchgroup') bot.whisper(user.username,body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer &#248;Wartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden')
            else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer Ø Wartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden'})
            else bot.say(channel,body.result.matchmaking.searching_players+' Spieler suchen von '+body.result.matchmaking.online_players+' bei einer &#248;Wartezeit von '+body.result.matchmaking.search_seconds_avg+' Sekunden')

          } else {
            console.alert('mm Status: '+body)
          }

        } else {

          console.log('Steam WebAPI is down.');
          if (user === 'Steam') steam_say(user.username,'Steam WebAPI is down. :steambored:')
          else if (user.type === 'twitchgroup') bot.whisper(user.username,'Steam WebAPI is down. ItsBoshyTime')
          else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Steam WebAPI is down. ItsBoshyTime'})
          else bot.say(channel,'Steam WebAPI is down. ItsBoshyTime')
        }
  });
}



const mm = async (function() {
  return new Promise(function (resolve, reject) {
    request({url:'http://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v001/?key='+steamapikey, json: true}, function (error, res, body) {
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

const parse = async (function () {
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
