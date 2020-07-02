
'use strict'
exports = module.exports = {}

const requestjson = require('request-json')

// const FaceitAPIkey = ''
const FaceitIds = {
  kirby: ''
}

const faceitmatchlink = (channel = 'kirby') => {
  return new Promise((resolve, reject) => {
    requestjson.createClient('https://api.faceit.com/match/v1/matches/groupByState').get('?userId=' + FaceitIds[channel], (err, res, body) => {
      console.log({ err, body })

      if (!err && res.statusCode === 200 && body) {
        if (!err) {
          if (body.payload && (body.payload.ONGOING || body.payload.READY)) {
            if (body.payload.ONGOING) {
              resolve(`https://www.faceit.com/en/csgo/room/${body.payload.ONGOING[0].id}`)
            } else if (body.payload.READY) {
              resolve(`https://www.faceit.com/en/csgo/room/${body.payload.READY[0].id}`)
            }
          } else {
            resolve('Aktuell in keinem Match')
          }
        } else {
          reject(err)
        }
      } else {
        resolve('Faceit API nicht verfügbar')
      }
    })
  })
}
faceitmatchlink().then(data => {
  console.log(data)
})
