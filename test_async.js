"use strict";

// const async = require('async');
const _ = require('underscore');

// var q = async.queue(function (task, cb, callback) {
//     console.log('hello ' + task);
//     callback("done_"+task)
//     setTimeout(() => {
//         cb(task);
//     }, 2000);
// }, 1);


// // assign a callback
// q.drain = function() {
//     console.log('all items have been processed');
// }


// q.push('foo', function (a, b, c) {
//     console.log('_foo, '+a,b,c);
// });
// q.push('bar', function (a, b, c) {
//     console.log('_bar'+a,b,c);
// });


// _.throttle(function, wait, [options])

// const _fetchPubgtrackerthrottle = _.throttle((username,cb) => {
//     console.log('start '+data);
//     if (data == 1) { console.timeEnd(1) }
//     else { console.timeEnd(3) }
//     cb("done"+data)
// }, 2000);


const _fetchPubgtrackerthrottle = _.throttle((username) => {
    return new Promise(function (resolve) {
        console.log('start '+username);
        if (username == 1) { console.timeEnd(1) }
        else { console.timeEnd(3) }
        resolve("done"+username)
    })
}, 2000);



// console.time(1)
// throttled(1,(done)=>{
//     console.log(done);
// })

// setTimeout(() => {
//     console.time(3)
//     throttled(3,(done)=>{
//         console.log(done);
//     })
// }, 1500);


async function x() {
    console.time(1)
    let result1 = await _fetchPubgtrackerthrottle(1)

    // setTimeout(() => {
    //     console.time(3)
    //     let result3 = await _fetchPubgtrackerthrottle(3)
    //     console.log(result3);
    // }, 1500);



    console.log(result1);
}
x()

setTimeout(() => {
    x()
}, 1500);