"use strict";

const cluster = require('cluster');

let arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42]
let obj = {}

function clusterfork(cluster){
    let worker = cluster.fork();
    worker.on('message', function(msg) {
        if (msg.twitch) {
            // if (Number.isInteger(msg.twitch)) worker.send({ twitch: arr.splice(0, msg.twitch) });
            // else worker.send({ twitch: arr.splice(0, ChanPerCluster) });

            let chan = arr.splice(0, 20)
            obj[msg.pid] = chan
            worker.send({ twitch: chan });
        }
    });
    worker.on('exit', (code, signal) => {
        if (signal) { console.log(`worker was killed by signal: ${signal}`); }
        else if (code !== 0) { console.log(`worker exited with error code: ${code}`); } 
        else { console.log('worker success!'); }
    });
}

if (cluster.isMaster) {
    console.log("isMaster");
    
    // const numCPUs = require('os').cpus().length;
    // const ChanPerCluster = Math.ceil(arr.length / numCPUs)

    let instances = Math.ceil(arr.length / 20)
    console.log("instaces",instances);

    for (let i = 0; i < instances; i++) {
        clusterfork(cluster)
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log('worker %d died (%s). restarting...', worker.process.pid, signal || code);
        arr = arr.concat(obj[worker.process.pid])
        clusterfork(cluster)
    });
    cluster.on('disconnect', (worker) => {
        console.log(`The worker #${worker.id} has disconnected`);
    });

} else if (cluster.isWorker) {
    var twitcharr = []
    process.on('message', function(msg) {
        if (msg.twitch) {
            twitcharr = msg.twitch

            console.log('I am worker #' + cluster.worker.id, "with ", twitcharr, process.pid);
            if (twitcharr.indexOf(40) !== -1) {
                setTimeout(function(){
                    process.exit(0);
                },500)
            }

        }
    });
    // process.send({ twitch: 3 });
    process.send({ twitch: true, pid: process.pid });
}