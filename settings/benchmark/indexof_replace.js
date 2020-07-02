"use strict";

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;
//https://jsperf.com/

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
function permissioncheck(msg,user){
  if (db[msg]) {
    if (db[msg].permission) {
      if ((db[msg].permission.host === false) && (user.badges.broadcaster == 1)) return "1"; //TODO: oder vergleich mit dem channel
      if ((db[msg].permission.subscriber === false) && user.subscriber) return "2";
      if ((db[msg].permission.turbo === false) && user.turbo) return "3";
      if ((db[msg].permission.mod === false) && user.mod) return "4";
      if (db[msg].permission.viewer === false) return "5";
    }
    return 'bot.send: '+db[msg].text // hier wird der befehl gesendet
  } else {
    return "kein Befehl gefunden"
  }
}


console.log(permissioncheck("!cfg",user));

return false;

const replaceAll1 = function(target) {
  if (target.indexOf('{NICK}') !== -1) {
    return target.replace(new RegExp('{NICK}','g'), user.username);
  }
};

let regtemp = /{NICK}/g
const replaceAll2 = function(target) {
  if (target.indexOf('{NICK}') !== -1) {
    return target.replace(regtemp, user.username);
  }
};
const replaceAll3 = function(target) {
  if (target.indexOf('{NICK}') !== -1) {
    return target.split('{NICK}').join(user.username);
  }
};
const replaceAll4 = function(target) {
  if (target.indexOf('{NICK}') !== -1) {
    return target.replace(new RegExp('{NICK}'.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), user.username);
  }
};

const find1 = function(target) {
  return target.indexOf('{NICK}') !== -1
};
const find2 = function(target) {
  return target.indexOf('{NICK}') > -1 || target.indexOf('{CHANNEL}') > -1;
};
const find3 = function(target) {
  return target.indexOf('{NICK}') == -1
};
const find4 = function(target) {
  return target.indexOf('{NICK}') >= 0
};
const find5 = function(target) {
  return target.indexOf('{NICK}') > -1
};
const find6 = function(target) {
  return target.includes('{NICK}')
};
const find7 = function(target) {
  return (new RegExp('{NICK}')).test(target)
};
const find8 = function(target) {
  return /{NICK}/.test(target)
};
const find9 = function(target) {
  return target.match(/{NICK}/)
};
const find10 = function(target) {
  return target.match(/({NICK}|{CHANNEL})/).length > 0;
};
const find11 = function(target) {
  return target.search(/{NICK}/)
};
const find12 = function(target) {
  return target.search(/{NICK}/) > -1;
};

suite
.add('find1', function() { find1('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find2', function() { find2('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find3', function() { find3('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find4', function() { find4('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find5', function() { find5('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find6', function() { find6('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find7', function() { find7('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find8', function() { find8('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find9', function() { find9('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find10', function() { find10('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find11', function() { find11('abc defg hij{NICK}klmnopq: {NICK}') })
.add('find12', function() { find12('abc defg hij{NICK}klmnopq: {NICK}') })
/* // Nur 2mal {NICK}
find1 x 11,882,888 ops/sec �0.34% (99 runs sampled)
find2 x 11,711,211 ops/sec �0.34% (101 runs sampled)
find3 x 11,399,697 ops/sec �0.30% (101 runs sampled)
find4 x 10,707,332 ops/sec �0.33% (97 runs sampled)
find5 x 3,468,315 ops/sec �1.08% (98 runs sampled)
find6 x 6,492,901 ops/sec �1.15% (94 runs sampled)
find7 x 6,353,525 ops/sec �1.20% (94 runs sampled)
find8 x 6,409,068 ops/sec �1.05% (96 runs sampled)

Fastest is
find1
*/



/*
.add('replaceAll1', function() {
  replaceAll1('abc defg hij{NICK}klmnopq: {NICK}')
})
.add('replaceAll2', function() {
  replaceAll2('abc','123')
})
.add('replaceAll3', function() {
  replaceAll3('abc defg hij{NICK}klmnopq: {NICK}')
})
.add('replaceAll4', function() {
  replaceAll4('abc defg hij{NICK}klmnopq: {NICK}')
})
*/


/*
var re = /(AND|OR|MAYBE)/;
var str = "IT'S MAYBE BETTER WAY TO USE .MATCH() METHOD TO STRING";
console.log('Do we found something?', Boolean(str.match(re)));
*/


// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log();
  console.log('Fastest is');
  console.log(this.filter('fastest')[0].name);
})
// run async
.run({ 'async': false });

// logs:
// => RegExp#test x 4,161,532 +-0.99% (59 cycles)
// => String#indexOf x 6,139,623 +-1.00% (131 cycles)
// => Fastest is String#indexOf
