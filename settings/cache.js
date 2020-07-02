'use strict'
exports = module.exports = {}

const config = require('./config.js')()
const redis = require('redis')
const client = redis.createClient()

let RedisConfig = {
  expiration: 500
}

let RedisCache = {
  ready: false,
  connect: false,
  reconnecting: false,
  error: false,
  end: false
}

client.on('ready', function () {
  if (!RedisCache.ready && !config.localhost()) {
    console.log('redis: ready')
  }
  RedisCache.ready = true
})
client.on('connect', function () {
  if (!RedisCache.connect) {
    console.log('redis: connect')
  }
  RedisCache.connect = true
})
client.on('reconnecting', function (data) {
  if (!RedisCache.reconnecting && !config.localhost()) {
    console.log('redis: reconnecting', data)
  }
  RedisCache.reconnecting = true
})
client.on('error', function (err) {
  if (!RedisCache.error) {
    console.warn('' + err)
  }
  RedisCache.error = true
})
client.on('end', function () {
  if (!RedisCache.end) {
    console.log('redis: end')
  }
  RedisCache.end = true
})
client.on('warning', function (err) {
  console.warn('redis: warning ' + err)
})

// Promise
exports.Pget = (key) => {
  return new Promise(function (resolve) {
    if (!client.connected) {
      resolve(['Redis ist nicht verbunden'])
      return
    }
    if (!client.ready) {
      resolve(['Redis ist nicht bereit'])
      return
    }
    client.get(key, (err, content) => {
      if (err) {
        resolve([err])
      } else {
        resolve([null, content])
      }
    })
  })
}

exports.Pset = (key, value) => {
  return new Promise(function (resolve) {
    if (!client.connected) {
      resolve(true, 'Redis ist nicht verbunden')
      return
    }
    if (!client.ready) {
      resolve(true, 'Redis ist nicht bereit')
      return
    }
    client.setex(key, RedisConfig.expiration, value, (err) => {
      if (err) {
        resolve(err)
      } else {
        resolve(false)
      }
    })
  })
}

// Callback
exports.get = (key, cb) => {
  if (!client.connected) {
    cb('Redis ist nicht verbunden')
  }
  if (!client.ready) {
    cb('Redis ist nicht bereit')
  }
  client.get(key, (err, content) => {
    if (err) {
      cb(err)
    } else {
      cb(null, content)
    }
  })
}

exports.set = (key, value, cb) => {
  if (!client.connected) {
    cb('Redis ist nicht verbunden')
    return
  }
  if (!client.ready) {
    cb('Redis ist nicht bereit')
    return
  }
  client.setex(key, RedisConfig.expiration, value, (err) => {
    if (err) {
      cb(err)
    } else {
      cb(false)
    }
  })
}
