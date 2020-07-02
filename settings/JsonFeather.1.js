'use strict'
exports = module.exports = {}
const fs = require('fs')
// const util = require('util')
// Concept: https://stackoverflow.com/a/43897339

function _timeout (file) {
  if (!global._JsonFeatherSave) global._JsonFeatherSave = {}
  clearTimeout(global._JsonFeatherSave[file]) // Kill the timer

  global._JsonFeatherSave[file] = setTimeout(function () {
    const fileobj = file.substring(exports.options.jsonFolder.length, file.length - (exports.options.jsonFolder.length - 5))
    fs.writeFile(file, JSON.stringify(exports[fileobj]), 'utf8', function (err) {
      if (err) {
        return console.warn(err)
      }
      if (exports.options.report) {
        console.log(fileobj, 'was saved!')
      }
    })
    delete global._JsonFeatherSave[file]
  }, exports.options.delay || 3000) // 3sec
}

function _TimerIsOver (file) {
  if (!global._JsonFeatherSave) { global._JsonFeatherSave = {} };
  if (global._JsonFeatherSave[file]) return false
  else return true
}

function _isPrimitive (v) {
  return v == null || (typeof v !== 'function' && typeof v !== 'object')
}

function _proxify (event, file) {
  return _isPrimitive(event) ? event : new Proxy(event, {
    get: function (target, property) {
      return (property in target)
        ? _proxify(target[property], file)
        : _proxify({})
    },
    set: function (target, property, value) {
      target[property] = value
      if (_TimerIsOver(file)) {
        _timeout(file)
      }
      return true
    },
    deleteProperty: function (target, property) {
      if (property in target) { return false }
      return target.removeItem(property)
      if (_TimerIsOver(file)) {
        _timeout(file)
      }
    }
  })
}

const _readFile = async function (file) {
  return new Promise(function (resolve) {
    fs.readFile(file, async function (err, data) {
      if (err) {
        resolve(err)
      } else {
        resolve(_proxify(JSON.parse(data), file))
      }
    })
  })
}

const _readdir = async function (folder, sub) { // TODO deeper /caster/settings
  // console.log(exports.options.jsonFolder);
  // console.log("Folder",Folder,sub);
  // if (sub) {
  //     folder=folder+sub+'/'
  // }
  return new Promise(function (resolve) {
    const filesArr = []
    fs.readdir(folder, async (err, files) => {
      for (var i = 0, len = files.length; i < len; i++) {
        // var stat = fs.statSync(folder+files[i])

        // if (stat.isDirectory()) {
        //     _readdir(folder,files[i])
        // } else {

        if (files[i].slice(-5) === '.json') {
          // if (sub && sub !== exports.options.jsonFolder) {
          //     if (!exports.sub) {
          //         console.log(sub);

          //         console.log("files[i].substring(0, files[i].length-5)",files[i].substring(0, files[i].length-5));
          //         exports.sub = {}
          //     }
          // }

          filesArr.push({ path: folder + files[i], name: files[i].substring(0, files[i].length - 5) })
        }
        // }
      }

      resolve(filesArr)
    })
  })
}

exports.options = {
  INITIALIZED: false,
  report: true,
  jsonFolder: './'
}

exports.init = async (options, callback) => {
  if (typeof options === 'string') { // only jsonFolder
    exports.options.jsonFolder = options
  } else if (typeof options === 'object') {
    exports.options = Object.assign({}, exports.options, options)
  }

  const files = await _readdir(exports.options.jsonFolder)
  await Promise.all(files.map(async (file) => {
    exports[file.name] = {}
    exports[file.name] = await _readFile(file.path, 'utf8')
  }))

  if (callback) {
    callback(files)
  }
  exports.options.INITIALIZED = true
}
