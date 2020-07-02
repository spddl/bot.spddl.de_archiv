'use strict'
const util = require('util')

var TWITTER_CONSUMER_KEY = ''
var TWITTER_CONSUMER_SECRET = ''
var TWITTER_ACCESS_TOKEN = ''
var TWITTER_ACCESS_TOKEN_SECRET = ''

// const Twitter = require('node-tweet-stream');
//
// const t = new Twitter({
//   consumer_key: '',
//   consumer_secret: '',
//   token: '',
//   token_secret: ''
// })
//
// t.on('tweet', function (tweet) {
//   console.log('tweet received', tweet)  // console.log(tweet.text);
// })
//
// t.on('error', function (err) {
//   console.log('Oh no '+err)
// })
//
//
// t.follow('20316016')
// t.follow(21447363)
// t.follow(813286)
// t.follow(27260086)
// t.follow(79293791)

const prettyHrtime = require('pretty-hrtime')
const Twitter = require('twitter')
var Tw = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
})

const arr = [20316016, 21447363, 813286, 27260086, 79293791]
global.twitter = {}

// for (let i = 0, len = arr.length; i < len; i++) {
//   setTimeout(function () {
//     let TwitterID = arr[i]
//     console.log(i+' - '+TwitterID);
//     global.twitter[TwitterID] = Tw.stream('statuses/filter', {follow: TwitterID})
//     global.twitter[TwitterID].status=false // TODO:
//     global.twitter[TwitterID].on('error', (err) => {
//       if (err) { console.log('Twit error!', err); }
//       if (!global.twitter[TwitterID].status) {
//         callback(false) // TODO:
//         global.twitter[TwitterID].status=true
//       }
//     });
//     global.twitter[TwitterID].on('ping', () => {
//       console.log(TwitterID+' ping');
//       if (!global.twitter[TwitterID].status) {
//         callback(true) // TODO:
//         global.twitter[TwitterID].status=true
//       }
//     });
//     global.twitter[TwitterID].on('data', function (msg) {
//       console.log(TwitterID+' '+(msg && msg.text));
//     })
//   }, i*120*1000);
// }

// function TwitterStream(i, callback){
//   let TwitterID = arr[i]
//   console.log(i+' - '+TwitterID);
//   global.twitter[TwitterID] = Tw.stream('statuses/filter', {follow: TwitterID})
//   global.twitter[TwitterID].status=false
//   global.twitter[TwitterID].on('error', (err) => {
//     if (err) { console.log('Twit error!', err); }
//     if (!global.twitter[TwitterID].status) {
//       callback(false,i)
//       global.twitter[TwitterID].status=true
//     }
//   });
//   global.twitter[TwitterID].on('ping', () => {
//     console.log(TwitterID+' ping');
//     if (!global.twitter[TwitterID].status) {
//       callback(true,i)
//       global.twitter[TwitterID].status=true
//     }
//   });
//   global.twitter[TwitterID].on('data', function (msg) {
//     console.log(TwitterID+' '+(msg && msg.text));
//   })
// }
// let i = 0
//
// TwitterStream(i,function(result,i){
//   if (result) {
//
//   } else {
//     // error
//     setTimeout(function(){
//       TwitterStream(i, cb)
//     },15*1000)
//   }
// })

// for (let i = 0, len = arr.length; i < len; i++) {
//   setTimeout(function () {
//     console.log(i+' - '+arr[i]);
//     retryConnectOnFailure(arr[i],1500);
//   }, i*3000);
// }
//
// let time
// function TwitterStream(TwitterID, time){
//   time = time || 5
//   global.twitter[TwitterID] = Tw.stream('statuses/filter', {follow: TwitterID}) // https://dev.twitter.com/streaming/overview/request-parameters#follow
//   global.twitter[TwitterID].on('error', (err) => {
//     console.log(TwitterID+'|Twit error! %j', err)
//     global.twitter[TwitterID] = null
//     // setTimeout(function () {
//     //   console.log('nächster versuch '+time+'sek '+ TwitterID);
//     //   TwitterStream(TwitterID, 15000)
//     // }, 2*time);
//   });
//   global.twitter[TwitterID].on('data', function (msg) {
//     console.log(TwitterID+' - '+msg.text);
//   })
// }

// let twitter = {}
// let retryConnectOnFailure = function(TwitterID, retryInMilliseconds) {
//   setTimeout(function() {
//     // global.twitter[TwitterID] = {}
//
//     twitter[TwitterID]={}
//     twitter[TwitterID].try=twitter[TwitterID].try||1
//
//     global.twitter[TwitterID] = Tw.stream('statuses/filter', {follow: TwitterID}) // https://dev.twitter.com/streaming/overview/request-parameters#follow
//     // global.twitter[TwitterID].try = global.twitter[TwitterID].try || 1
//
//     global.twitter[TwitterID].on('error', (err) => {
//       if (err) {
//         console.log(TwitterID+' | Twit error! %j', err.source)
//       }
//
//       // global.twitter[TwitterID] = null
//       // global.twitter[TwitterID].try = ++global.twitter[TwitterID].try
//       twitter[TwitterID].try=twitter[TwitterID].try+1
//       console.log('global.twitter['+TwitterID+'].try '+ twitter[TwitterID].try);
//       let time = retryInMilliseconds * twitter[TwitterID].try * (Math.random() * 10) + 1
//       console.log('nächster versuch '+time+'sek '+ TwitterID);
//       retryConnectOnFailure(TwitterID, time);
//     });
//     global.twitter[TwitterID].on('data', function (msg) {
//       delete twitter[TwitterID].try
//       console.log(TwitterID+' - '+msg.text);
//     })
//
//   }, retryInMilliseconds);
// }

// listenTweet('fr3ddytv','Fr3ddyTV', settingsprivate.fr3ddytv.botsettings.discord.twitternews)
// listenTweet('kirby','KirbyCSOfficial', settingsprivate.kirby.botsettings.discord.twitternews)
// listenTweet('spddl','TwitchSupport', settingsprivate.spddl.botsettings.discord.twitternews)
// listenTweet('spddl','TwitchDE', settingsprivate.spddl.botsettings.discord.twitternews)
// listenTweet('spddl','TwitchDev', settingsprivate.spddl.botsettings.discord.twitternews)
// listenTweet('spddl','SteamDB', "203857526377152512")
// listenTweet('spddl','StaiyLIVE', "253784262929547265") // StaiyLIVE

// if (localhost()) {
//   listenTweet('spddl','NZZ', 0)
//   listenTweet('spddl','szaktuell', 0)
//   listenTweet('spddl','dexujidi', 0)
// }

// Tw.get('users/lookup', { screen_name : "KirbyCSOfficial" }).then((result)=>{
//   console.log(result[0].id);

// var stream = Tw.stream('statuses/filter', {follow: '3230363355'}); // 3230363355
// stream.on('data', function(event) {
//   console.log(event && event.text);
// });
// stream.on('error', function(error) {
//   console.warn(error);
//   // throw error;
// });

// }).catch((err) => {
//   console.log('Screenname: '+screenname+' %j',err);
// });

// var i = 0, howManyTimes = 10;
// function f() {
//     alert( "hi" );
//     i++;
//     if( i < howManyTimes ){
//         setTimeout( f, 3000 );
//     }
// }
// f();

// global.twitter[screenname] = Tw.stream('statuses/filter', {follow: [settings[user].twitterid]}) // https://dev.twitter.com/streaming/overview/request-parameters#follow
// global.twitter[screenname].on('error', (err) => {  console.log('Twit error!', err)  });
// global.twitter[screenname].on('data', function (msg) {

// console.log(util.inspect(settings, false, null));

// global.twitter={}
// function TwitterStream(TwitterID, cb){
//   console.log('TwitterStream: '+TwitterID);
//   let time = process.hrtime();
//   global.twitter[TwitterID] = Tw.stream('statuses/filter', {follow: TwitterID}) // https://dev.twitter.com/streaming/overview/request-parameters#follow
//   global.twitter[TwitterID].on('error', (err) => {
//     // console.log('error');
//     // if (err) { console.log(TwitterID+' | Twit error! %j', err) }
//     console.log(prettyHrtime(process.hrtime(time)));
//     if (err) {
//       console.log(TwitterID+' | Twit error! ', err)
//       console.log('cb(false)');
//       cb(false)
//       global.twitter[TwitterID] = false
//       return;
//     }
//   });
//   global.twitter[TwitterID].on('data', function (msg) {
//     // console.log('data');
//     console.log(TwitterID+' '+msg.text);
//   })
//   setTimeout(function(){
//     console.log('cb(true)');
//     if (global.twitter[TwitterID]) {
//       cb(true)
//     }
//   },1500)
// }

// let retryConnectOnFailure = function(TwitterID, retryInMilliseconds, callback) {
//   console.log('retryConnectOnFailure: '+TwitterID+', '+retryInMilliseconds);
//   setTimeout(function() {
//     console.log('retryConnectOnFailure: setTimeout')
//     TwitterStream(TwitterID, function(connected){
//       console.log('TwitterStream: '+TwitterID+', '+connected);
//       if (!connected) {
//         retryConnectOnFailure(TwitterID, retryInMilliseconds*2, callback);
//       } else {
//         console.log('connected: '+TwitterID);
//         callback()
//       }
//     })
//
//   }, retryInMilliseconds);
// }

// let arr = [20316016,21447363,813286,27260086,79293791]
// global.twitter={}
// for (let i = 0, len = arr.length; i < len; i++) {

// let i = 0
// let loop = function(TwitterID) {
//   retryConnectOnFailure(TwitterID, 10000, function(){
//     console.log('i: '+i+', arr.length: '+arr.length);
//     if (i == arr.length) {
//       console.log('done-------------------------');
//     }
//     i++
//     loop(arr[i])
//   })
// }
//
// loop(arr[i])

// // Given async function sayHi
// function sayHi() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log('Hi');
//       resolve();
//     }, 3000);
//   });
// }
//
// // And an array of async functions to loop through
// const asyncArray = [sayHi, sayHi, sayHi];
//
// // We create the start of a promise chain
// let chain = Promise.resolve();
//
// // And append each function in the array to the promise chain
// for (const func of asyncArray) {
//   chain = chain.then(func);
// }

// function sayHi(id) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('Hi '+id);
//       resolve();
//     }, 3000);
//   });
// }
//
// // And an array of async functions to loop through
//
//
// // We create the start of a promise chain
// let chain = Promise.resolve();
//
// // And append each function in the array to the promise chain
// for (const TwitterID of arr) {
//   console.log(TwitterID);
//   // chain = chain.then(sayHi(TwitterID));
//   // chain = chain.then(func.bind(null, "...your params here"));
//   chain = chain.then(() => func("your params here"));
// }

// const cars = ["toyota", "honda", "acura"];
// let carsCopy = cars.slice(0);
//
// function copyFilesAndRunAnalysis(car) {
//   return new Promise(function(resolve, reject) {
//     setTimeout(function() { // simulate some delay
//       resolve(car); // control should return to generator here
//     }, 1000);
//   })
// }
//
// function* doCar(cars) {
//   yield copyFilesAndRunAnalysis(cars);
// }
//
// // BEGIN HERE
// console.log("start here");
// let carBatch = doCar(carsCopy.shift());
// carBatch.next().value.then(function re(data) {
//   console.log(data);
//   return carsCopy.length
//          ? doCar(carsCopy.shift()).next().value.then(re)
//          : "complete"
// })
// .then(function(complete) {
//   console.log(complete);
// })

// cars = ["toyota", "honda", "acura"];
// let arr = [20316016,21447363,813286,27260086,79293791]
// let arrCopy = arr.slice(0);
//
// function copyFilesAndRunAnalysis(arr) {
//   return new Promise(function(resolve, reject) {
//
//     // setTimeout(function() { // simulate some delay
//     //   console.log('- '+arr);
//     //   resolve(arr); // control should return to generator here
//     // }, 1000);
//     global.twitter[arr] = Tw.stream('statuses/filter', {follow: arr}) // https://dev.twitter.com/streaming/overview/request-parameters#follow
//     global.twitter[arr].on('error', (err) => {
//       if (err) {
//         console.log('Twit error!', err)
//         console.log('reject- '+arr);
//         // reject(arr)
//         setTimeout(function(){
//           copyFilesAndRunAnalysis(arr)
//         },10000)
//         return
//       }
//     });
//     global.twitter[arr].on('data', function (msg) {
//       console.log(msg.text);
//     })
//     setTimeout(function() { // simulate some delay
//       console.log('resolve- '+arr);
//       resolve(arr); // control should return to generator here
//     }, 1000);
//
//   })
// }
//
// function* doCar(arr) {
//   yield copyFilesAndRunAnalysis(arr);
// }
//
// // BEGIN HERE
// console.log("start here");
// let arrBatch = doCar(arrCopy.shift());
// arrBatch.next().value.then(function re(data) {
//   console.log(data);
//   return arrCopy.length
//          ? doCar(arrCopy.shift()).next().value.then(re)
//          : "complete"
// })
// .then(function(complete) {
//   console.log(complete);
// })

/*
const async = require('async');
let TwitterErrorTimeout = 60000
let q = async.queue(function(id, callback) {
  // setTimeout(function(){
  //   console.log('hello ' + id+' ,'+TwitterErrorTimeout);
  //   callback();
  // }, TwitterErrorTimeout)
  console.log('async.queue: '+id);
  global.twitter[id] = Tw.stream('statuses/filter', {follow: id}) // https://dev.twitter.com/streaming/overview/request-parameters#follow

  global.twitter[id].once('error', (err) => {
    console.log();
    console.log('once Twit error! %s', err)
    global.twitter[id] = null
    TwitterErrorTimeout = TwitterErrorTimeout+10000
    q.push([id], function (err) {
      console.log(id+' lief zuvor auf Fehler ###################################');
    });
    console.log();
  });

  global.twitter[id].once('ping', function () {
    console.log(id+' once Ping ###################################');
    setTimeout(function(){
      console.log(id+' timeout');
      callback();
    }, TwitterErrorTimeout)
    // callback();
  })

  global.twitter[id].on('data', function (msg) {
    if (ready) {
      console.log('  '+id+' '+msg.text);
    }
  })

}, 1);

// assign a callback
q.drain = function() {
  ready = true
  console.log('all items have been processed__________________________');
};

// // add some items to the queue
// q.push({name: 'foo'}, function(err) {
//     console.log('finished processing foo');
// });
// q.push({name: 'bar'}, function (err) {
//     console.log('finished processing bar');
// });

// add some items to the queue (batch-wise)
// q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
//     console.log('finished processing item');
// });
let ready = false
q.push([20316016,21447363,813286,27260086,79293791], function(err) {
  console.log(' - finished processing item');
});
*/

// var stream = client.stream('statuses/filter', {track: 'Whisky,CanadianWhisky'});

// { field1:'test1', field2:'test2' }

const twitterid = {
  20316016: 'szaktuell',
  21447363: 'katyperry',
  813286: 'BarackObama',
  27260086: 'justinbieber',
  79293791: 'rihanna'
}

global.twitter.id = Tw.stream('statuses/filter', { follow: '20316016,21447363,813286,27260086,79293791' }) // https://dev.twitter.com/streaming/overview/request-parameters#follow

global.twitter.id.on('error', (err) => {
  console.log()
  console.log('once Twit error! %s', err)
  // global.twitter[id] = null
  // TwitterErrorTimeout = TwitterErrorTimeout+10000
  // q.push([id], function (err) {
  //   console.log(id+' lief zuvor auf Fehler ###################################');
  // });
  // console.log();
})

global.twitter.id.once('ping', function () {
  console.log('once Ping ###################################')
  // setTimeout(function(){
  //   console.log(id+' timeout');
  //   callback();
  // }, TwitterErrorTimeout)
  // callback();
})

// global.twitter["id"].on('data', function (msg) {
global.twitter.id.on('data', function (msg) {
  let user
  if (msg.in_reply_to_user_id) {
    user = twitterid[msg.in_reply_to_user_id]
  } else if (msg.retweeted_status && msg.retweeted_status.user && msg.retweeted_status.user.id) {
    user = twitterid[msg.retweeted_status.user.id]
  } else {
    user = false
  }

  // try {
  //   let user = msg.in_reply_to_user_id || msg.retweeted_status.user.id
  // } catch (e) {
  //   console.log(util.inspect(msg, false, 6, true));
  // }
  //
  //
  // console.log(twitterid[user]+' - '+msg.text.substr(0, 10) );
  console.log(user + ' - ' + msg.text.substr(0, 20))

  if (!user) {
    console.log(util.inspect(msg, false, 6, true))
  }

  // if (typeof twitterid[user] == undefined) {
  //   console.log(util.inspect(msg, false, 6, true));
  // }
  //   console.log('  '+"id"+' '+msg.text);
  // }
})
