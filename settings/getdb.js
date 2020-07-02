'use strict'
exports = module.exports = {}
const fs = require('fs')
const _ = require('lodash') // TODO https://lodash.com/

exports.get = (path, fallback) => { // https://lodash.com/docs/4.17.4#get
  // TODO timer
  // evtl. read die datei falls der json null sist

  // let json = exports
  // for (var i = 0, len = path.length; i < len; i++) {
  //     json = json[path[i]];
  // }
  // return json ? json : fallback ? fallback : undefined;
  console.log('_get', path)
  return _.get(exports, path, fallback)
}

// exports.set = (path, value) => {
//     console.log("_set",path);
//     // TODO timer save
//     try {
//         _.set(exports, path, value)
//         return true
//     } catch (error) {
//         console.warn(error);
//         return false
//     }
// }

exports.set = (obj, path, value) => {
  console.log('_set', path)

  // console.log(typeof obj);

  // TODO timer save
  try {
    _.set(obj, path, value)
    return true
  } catch (error) {
    console.warn(error)
    return false
  }
}

const _readFile = async function (file) {
  return new Promise(function (resolve) {
    fs.readFile(file, async function (err, data) {
      if (err) {
        resolve(err)
      } else {
        // resolve(_proxify(JSON.parse(data), file))
        resolve(JSON.parse(data))
      }
    })
  })
}

const _readdir = async function (folder, sub) { // TODO deeper /caster/settings
  const result = {}
  const files = fs.readdirSync(folder)

  await Promise.all(files.map(async (file) => {
    const stat = fs.statSync(folder + file)

    if (stat.isDirectory()) {
      result[file] = await _readdir(folder + file + '/')
    } else {
      if (file.slice(-5) === '.json') {
        const filename = file.substring(0, file.length - 5)
        result[filename] = {}
        result[filename] = await _readFile(folder + file, 'utf8')
      }
    }
  }))
  return result
}

exports.options = {
  INITIALIZED: false,
  report: true,
  jsonFolder: './',
  timeout: 15 * 60 * 1000,
  delay: 3000
}

exports.init = async (options, callback) => {
  if (typeof options === 'string') { // only jsonFolder
    exports.options.jsonFolder = options
  } else if (typeof options === 'object') {
    exports.options = Object.assign({}, exports.options, options)
  }

  const data = await _readdir(exports.options.jsonFolder)
  Object.assign(exports, data)

  if (callback) {
    callback(exports)
  }
}

/// ///////////////////////////
// Dont work
/// ///////////////////////////

// exports.set = (path, value) => {
//     // https://lodash.com/docs/4.17.4#set
//     // https://github.com/lodash/lodash/blob/4.17.4/lodash.js#L13651
//     // https://github.com/lodash/lodash/blob/4.17.4/lodash.js#L3976
//     let json = exports
//     // let newjson = Object.assign({}, path);
//     let newjson = {}
//     let test = {}
//     test[path[0]] = {}
//     test[path[0]][path[1]] = {}
//     // test[path[0]][path[1]] = {}
//     // console.log("path[0]",path[0]);
//     console.log("test",test);

//     for (var i = 0, len = path.length; i < len; i++) {
//         console.log("path["+i+"]",path[i]);
//         // console.log(json[path[i]]);

//         if (json[path[i]]) {
//             console.log("gefunden");
//             newjson[path[i]] = {}

//             // newjson = newjson[path[i]];
//         } else {
//             newjson[path[i]] = value
//             console.log("nicht gefunden");
//         }
//         json = json[path[i]];

//     }
//     // console.log("json",json);
//     console.log("newjson",newjson);
//     json = value
//     return true;
// }
