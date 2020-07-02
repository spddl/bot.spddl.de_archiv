const db = require('./settings/JsonFeather.js');
const util = require('util')
// db.init('./storage/', (files) => {
//     console.log(files);
// })

console.log(db.test().dings);

db.init('./storage/',(files) => {
    // console.log(util.inspect(files, false, null, true))
    // console.log(util.inspect(db, false, null, true))
    // console.log(db.spddl.cmd.wichtig);
    // db.spddl.cmd
    // db.spddl.cmd.wichtig = "geht so"
    // db.spddl.fallswenn.kannpassieren.mussabernicht = {}
    // console.log(db.spddl);


    setTimeout(function(){
        console.log("start");
        // console.log(db);
        db.spddl = "spddl!"
        db.spddl = {}
        db.spddl.nun = {}
        db.spddl.nun.jap = "asd"
        console.log(db.spddl);
    },5000)

    // setTimeout(function(){
    //     console.log("---------");
    //     db.spddl.cmd.wichtig = {cmd: "geht so"}
    //     // "name": "hihi"
    //     // console.log(files);
    // },10000)

})






// var docCookies = {}

// var docCookies = new Proxy(docCookies, {
//     get: function (oTarget, sKey) {
//         console.log("get",oTarget);
//         return oTarget[sKey] || undefined // oTarget.getItem(sKey) || undefined;
//     },
//     set: function (oTarget, sKey, vValue) {
//         console.log("set",sKey,vValue);
//         if (sKey in oTarget) { return false; }
//         oTarget[sKey] = vValue;
//         return true;
//         // return oTarget.setItem(sKey, vValue);
//     },
//     deleteProperty: function (oTarget, sKey) {
//         console.log("deleteProperty",sKey);
//         if (sKey in oTarget) { return false; }
//         return oTarget.removeItem(sKey);
//     },
//     enumerate: function (oTarget, sKey) {
//         console.log("enumerate",sKey);
//         return oTarget.keys();
//     },
//     ownKeys: function (oTarget, sKey) {
//         console.log("ownKeys",sKey);
//         return oTarget.keys();
//     },
//     has: function (oTarget, sKey) {
//         console.log("has",sKey);
//         return sKey in oTarget || oTarget.hasItem(sKey);
//     },
//     defineProperty: function (oTarget, sKey, oDesc) {
//         console.log("defineProperty",sKey);
//         if (oDesc && 'value' in oDesc) { oTarget.setItem(sKey, oDesc.value); }
//         return oTarget;
//     },
//     getOwnPropertyDescriptor: function (oTarget, sKey) {
//         console.log("getOwnPropertyDescriptor",sKey);
//         var vValue = oTarget.getItem(sKey);
//         return vValue ? {
//             value: vValue,
//             writable: true,
//             enumerable: true,
//             configurable: false
//         } : undefined;
//     },
//   });
  
//   /* Cookies test */
  
//   console.log(docCookies.my_cookie1 = 'First value');
//   console.log(docCookies.my_cookie1);
  
//   docCookies.my_cookie1 = "Changed value"
//   docCookies.my_cookie2 = "new"
//   docCookies.my_cookie3 = {}
//   console.log(docCookies.my_cookie1);
