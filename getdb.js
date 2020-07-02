const db = require('./settings/getdb.js');
const util = require('util')


db.init('./storage/', (files) => {
    // console.log(files);

    // console.log(db.get(files, ['commands','lastupdated']));


    // console.time("1getwhile")
    // console.log(db.getwhile(['commands','lastupdated']));
    // console.timeEnd("1getwhile")


    // console.time("1get")
    // console.log(db.get(['commands','lastupdated']));
    // console.timeEnd("1get")


    // console.time("2getwhile")
    // console.log(db.getwhile(['commands','lastupdated']));
    // console.timeEnd("2getwhile")


    // console.time("2get")
    // console.log(db.get(['commands','lastupdated']));
    // console.timeEnd("2get")



    // console.log("get",db.get(['commands','lastupdated','asd'],"123hihi"));
    // console.log("set",db.set(['commands','lastupdated','asd'],"123"));
    // console.log("get",db.get(['commands','lastupdated','asd'],"123hihi"));


    console.log("set",db.set(db.commands,['lastupdated','asd'],{dings: 123}));
    console.log("get",db.get(['commands','lastupdated','asd','dings'],"123hihi"));
    console.log("end");

    // console.log(db.get(['commands','lastupdated','asd'],"nüscht2"));

    // console.log(db.loset(['commands','lastupdated','asd'],"123"));



})


// console.log(db);