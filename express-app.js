var express = require('express')
var http = require('http')
var https = require('https')
var app = express()

app.get('/', function (req, res) {
  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null)

  console.log(formatDate() + ip)
  res.send('soon :P')
})

// app.listen(80, function () {
//   console.log('Example app listening on port 80!');
// });

greenlockExpressOptions = {
  server: 'https://acme-v01.api.letsencrypt.org/directory',
  approveDomains: approveDomains
}
var httpserver, httpsserver
var lex = require('greenlock-express').create(greenlockExpressOptions)

httpserver = http.createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
  console.log('Listening for ACME http-01 challenges on', this.address())
})
httpsserver = https.createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
  console.log('Listening for ACME tls-sni-01 challenges and serve app on', this.address())
})

function approveDomains (opts, certs, cb) {
  if (certs) {
    opts.domains = certs.altnames
  } else {
    opts.email = 'email@provider.com'
    opts.agreeTos = true
  }
  cb(null, { options: opts, certs: certs })
}

function formatDate () {
  const d = new Date()
  let day = d.getDate()
  let mon = d.getMonth() + 1
  day = (day < 10 ? '0' : '') + day
  mon = (mon < 10 ? '0' : '') + mon
  let h = d.getHours()
  let m = d.getMinutes()
  let s = d.getSeconds()
  h = (h < 10 ? '0' : '') + h
  m = (m < 10 ? '0' : '') + m
  s = (s < 10 ? '0' : '') + s
  return day + '.' + mon + ' ' + h + ':' + m + ':' + s + ' '
}
