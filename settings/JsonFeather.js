'use strict'
exports = module.exports = {}
const fs = require('fs')
// Concept: https://stackoverflow.com/a/43897339

function _timeout (file) {
  if (!global._JsonFeatherSave) global._JsonFeatherSave = {}
  clearTimeout(global._JsonFeatherSave[file]) // Kill the timer

  global._JsonFeatherSave[file] = setTimeout(function () {
    const fileobj = file.substring(exports.options.jsonFolder.length, file.length - (exports.options.jsonFolder.length - 5))

    // console.log("exports",exports);
    // console.log("file:",file,"fileobj:",fileobj);
    // console.log("JSON.stringify(exports[fileobj])",JSON.stringify(exports[fileobj]));

    let json = exports

    var parts = fileobj.split('/')

    for (var i = 0, len = parts.length; i < len; i++) {
      json = json[parts[i]]
    }

    fs.writeFile(file, JSON.stringify(json), 'utf8', function (err) {
      if (err) {
        return console.warn(err)
      }
      if (exports.options.report) {
        console.log(fileobj, 'was saved!')
      }
    })
    delete global._JsonFeatherSave[file]
  }, exports.options.delay) // 3sec
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
      // console.log("set:");
      target[property] = value
      // console.log("set property",property,"value",value);
      if (_TimerIsOver(file)) { _timeout(file) }
      return true
    },
    has: function (target, property) {
      console.log('has')
      return (property in target)
        ? _proxify(target[property], file)
        : _proxify({})
    },
    deleteProperty: function (target, property) {
      if (property in target) { return false }
      return target.removeItem(property)
      if (_TimerIsOver(file)) { _timeout(file) }
    }
  })
}

function _proxifyy (event, file) {
  return _isPrimitive(event) ? event : new Proxy(event, {

    has: function (name) {
      console.log('has')
    },
    hasOwn: function (name) {
      console.log('hasown')
    },
    get: function (target, property) {
      console.log('get', property, target.length)
      return (property in target)
        ? _proxify(target[property], file)
        : _proxify({})
    },
    set: function (name) {
      console.log('set')
    },
    enumerate: function (name) {
      console.log('enumerate')
    },
    keys: function (name) {
      console.log('keys')
    },
    getOwnPropertyDescriptor: function (oTarget, sKey) {
      console.log('getOwnPropertyDescriptor')
      // var vValue = oTarget.getItem(sKey);
      var vValue
      return vValue ? {
        value: vValue,
        writable: true,
        enumerable: true,
        configurable: false
      } : undefined
    },
    getPropertyDescriptor: function (name) {
      console.log('getPropertyDescriptor')
      var proto = target
      var desc
      do {
        desc = Object.getOwnPropertyDescriptor(proto, name)
      } while (desc === undefined && (proto = Object.getPrototypeOf(proto)))
      // a trapping proxy's properties must always be configurable
      if (desc !== undefined) { desc.configurable = true }
      return desc
    },
    getOwnPropertyNames: function (name) {
      console.log('getOwnPropertyNames')
      if (handler.getOwnPropertyNames) { return handler.getOwnPropertyNames(target, name) }
      return Object.getOwnPropertyNames(target)
    },
    getPropertyNames: function () {
      console.log('getPropertyNames')
      var names = []
      var proto = target
      do {
        names = names.concat(Object.getOwnPropertyNames(proto))
      } while ((proto = Object.getPrototypeOf(proto)) && proto !== Object.prototype)
      return names
    },
    defineProperty: function (name, desc) {
      console.log('defineProperty')
      if (handler.defineProperty) { return handler.defineProperty(target, name, desc) }
      return Object.defineProperty(target, name, desc)
    },
    delete: function (name) {
      console.log('delete')
      if (handler.deleteProperty) { return handler.deleteProperty(target, name) }
      return delete target[name]
    }
    // get: function(target, property){
    //     return (property in target)
    //         ? _proxify(target[property], file)
    //         : _proxify({});
    // },
    // set: function(target, property, value){
    //     // console.log("set:");
    //     target[property] = value;
    //     // console.log("set property",property,"value",value);
    //     if (_TimerIsOver(file)) { _timeout(file) }
    //     return true;
    // },
    // deleteProperty: function (target, property) {
    //     if (property in target) { return false; }
    //     return target.removeItem(property);
    //     if (_TimerIsOver(file)) { _timeout(file) }
    // }
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

exports.test = () => {
  return this
}
