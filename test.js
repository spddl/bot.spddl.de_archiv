// var data = {
//    "appKey":"####",
//    "event":{
//       "id":"41012797",
//       "type":"follow",
//       "user":{
//          "avatar":"491994",
//          "hasPayment":"2017-06-09T16:25:12+0200",
//          "currency":{
//             "code":"EUR",
//             "symbol":"€",
//             "label":"Euro",
//             "available":"1"
//          },
//          "country":"DE",
//          "username":"Kirby",
//          "providers":[
//             {
//                "connectedAt":"2017-06-08T16:56:34+0200",
//                "code":"twitch",
//                "id":"37218834",
//                "username":"Kirby",
//                "last_follow_update":"2017-06-09T03:13:59+0200"
//             }
//          ],
//          "created_at":"2015-11-27T18:10:34+0100",
//          "session_at":"2017-06-09T15:29:18+0200"
//       },
//       "ref":"TWITCH_follow_5208_96111163",
//       "inserted_at":"2017-06-09T16:52:24+0200",
//       "origin":"twitch",
//       "created_at":"2017-06-09T16:52:24+0200",
//       "display":"1",
//       "parameters":{
//          "twitch_channel_id":"Kirby",
//          "twitch_created_at":"2017-06-09T14:51:39Z",
//          "twitch_user_id":"96111163",
//          "username":"Twitchkirby64"
//       },
//       "parameters.amount":"0"
//    }
// }

// console.log(data.event.parameters.twitch_channel_id.toLowerCase());
// console.log(data.event.parameters.username);

//
// case 'follow': Alertprocess('fol', data.event.parameters.twitch_channel_id.toLowerCase(), data.event.parameters.username, null); break;
// case 'subscription': console.log('tipeeestream: sub '+data.event.parameters.username+', '+data.event.parameters.plan); break;
// default:
// var _ = require('underscore'),
//     test = require('./settings/test.js');
//
// let variable = 10

// console.log(test.doSomething());




// var person = new test('Jane');







// var object1 = {
//   a: 1,
//   b: 2,
//   c: 3
// }
//
// var object2 = {
//   a: 1,
//   b: 2,
//   c: 4
// }
//
// const compareMe = function (obj1, obj2, parentKey) {
//   parentKey = parentKey || '';
//   _.each(_.keys(obj1), function (key) {
//     if(_.isObject(obj1[key]) ) {
//         compareMe(obj1[key], obj2[key], parentKey + key + '.')
//     } else {
//         if (!_.has(obj2, key) || !_.isEqual(obj1[key], obj2[key])) {
//             console.log(parentKey + key+': '+obj1[key]+' > '+obj2[key]);
//         }
//     }
//   })
// };

// compareMe(object1, object2)



// var PromiseType = /{NICK}|{CHANNEL}|{MM}|{FollowAt}|{RANDOM}|{FollowFromNow}/gi;
//
// var FunctionsAsync = async function(msg, result) {
//   try {
//     var text = await Promise.all(result.map(Functions));
//   } catch (err) {
//     console.error(err);
//   }
//
//   var resultobj = {}
//   for (var i = 0; i < result.length; i++) {
//     resultobj[result[i]] = text[i]
//   }
//
//   msg = msg.replace(PromiseType, function(matched){
//     return resultobj[matched.toLowerCase()];
//   });
//   console.log('send: '+msg);
//
//   console.timeEnd('1');
//
// }
//
// var Functions = function(name) {
//   return new Promise((done) => {
//     switch (name) { // switch (name.toLowerCase()) {
//       case "{nick}":
//         done("spddl");
//         break;
//       case "{mm}":
//         done("mm");
//         break;
//       case '{followfromnow}':
//         setTimeout(() => {
//           done('vollviel ey')
//         },0)
//         break;
//       default:
//         console.warn(name);
//         done("");
//     }
//   });
// };
// console.time('1');
//
// var msg = 'abc defg hij {NICK} klmn {FollowFromNow} opq: {NICK} - {MM}'
// var FunctionsFound = PromiseType[Symbol.match](msg)
// if (FunctionsFound) { // !null
//   FunctionsAsync(msg, uniqArray(FunctionsFound))
// }
//
// // if (user.type === 'steam') steam_say(user,text)
// // else if (user.type === 'twitchgroup') bot.whisper(user.username, text)
// // else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: text})
// // else bot.say(channel,text)
//
// function uniqArray(array){
//   var result = [];
//   for (var i = 0; i < array.length; i++) {
//     if(result.indexOf(array[i].toLowerCase()) < 0) {
//       result.push(array[i].toLowerCase());
//     }
//   }
//   return result
// }


str = 'abcdefg hij {NICK} klmn {FollowFromNow} opq: {NICK} - {MM}'



console.time('0');
console.log(str.substr(0,str.indexOf(' ')));
console.timeEnd('0');

console.time('1');
console.log(str.split(' ')[0]);
console.timeEnd('1');


console.time('11');
console.log(str.split(' ')[0]);
console.timeEnd('11');

console.log('#########');

console.time('2');
console.log(str.split(/\s(.+)/)[0])
console.timeEnd('2');


console.time('22');
console.log(str.split(/\s(.+)/)[0])
console.timeEnd('22');
