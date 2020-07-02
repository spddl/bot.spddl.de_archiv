'strict use'

e = module.exports = {}

// const REPO_DIR = process.env.OPENSHIFT_REPO_DIR

// https://github.com/quentinadam/node-letsencrypt-client-example
const fs = require('fs')
const co = require('co')

const request = require('request')
const childProcess = require('child_process')
const exec = childProcess.exec
const LEClient = require('letsencrypt-client')

const accountKey = fs.readFileSync('./letsencrypt/account.key')
// const csr = fs.readFileSync("./letsencrypt/domain.csr"); // TODO openssl req -new -sha256 -key domain.key -subj "/CN=bot.spddl.de" > domain.csr
const csr = fs.readFileSync('./letsencrypt/domain.csr') // TODO openssl req -new -sha256 -key domain.key -subj "/CN=bot.spddl.de" > domain.csr
// const csr1 = fs.readFileSync(REPO_DIR+"letsencrypt/domain.csr"); // TODO openssl req -new -sha256 -key domain.key -subj "/CN=bot.spddl.de" > domain.csr
// const csr2 = fs.readFileSync("letsencrypt/domain.csr"); // TODO openssl req -new -sha256 -key domain.key -subj "/CN=bot.spddl.de" > domain.csr

/*
console.log('#########')
console.log(csr.toString('utf8'))
console.log('#########')

//console.log(REPO_DIR+"letsencrypt/domain.csr")

//console.log('#########')
console.log(csr.toString('utf8'))
console.log('#########')
console.log(csr1.toString('utf8'))
console.log('#########')
//console.log(csr2.toString('utf8'))
console.log('#########')
*/
const responses = {}
function requestCertificate () {
  fs.unlinkSync('./letsencrypt/fullchain.pem')
  co(function * () {
    const client = new LEClient(accountKey)

    console.log('Registering...')
    yield client.register()

    const domains = parseCSR(csr)
    for (let i = 0; i < domains.length; i++) {
      const domain = domains[i]

      console.log('Requesting challenge for domain %s...', domain)
      const challenge = yield client.requestAuthorization(domain)

      responses[challenge.path] = challenge.keyAuthorization

      console.log('Triggering challenge for domain %s...', domain)
      yield client.triggerChallenge(challenge)

      while (true) {
        console.log('Checking challenge for domain %s...', domain)
        const status = yield client.checkChallenge(challenge)
        console.log('Challenge is %s', status)
        if (status == 'invalid') throw new Error('Could not verify domain ' + domain)
        if (status == 'valid') break
        yield sleep(1000)
      }
    }

    console.log('Requesting certificate...')
    const certificate = yield client.requestCertificate(csr)
    console.log('certificate: ' + certificate)

    fs.writeFile('./letsencrypt/cert.pem', certificate, function (err) {
      if (err) { console.log('err: ', err) }
      console.log('The cert.pem was saved!')
      // cat your_primary_cert.pem your_intermediate_cert.pem >> fullchain.pem

      // #1 cert.pem > #2 Let’s Encrypt Authority X3.pem > #3 root https://www.identrust.com/certificates/trustid/root-download-x3.html
      // https://letsencrypt.org/certificates/
      // let child = exec("cat letsencrypt/cert.pem letsencrypt/lets-encrypt-x3-cross-signed.pem letsencrypt/root.pem >> letsencrypt/fullchain.pem", function (error, stdout, stderr) {
      const child = exec('cat letsencrypt/cert.pem letsencrypt/lets-encrypt-x3-cross-signed.pem >> letsencrypt/fullchain.pem', function (error, stdout, stderr) {
        if (stdout) { console.log('stdout: ' + stdout) }
        if (stderr) { console.log('stderr: ' + stderr) }
        if (error !== null) { console.log('exec error: ' + error) }
        uploadCert()
      })
    })
  }).catch((error) => {
    console.log('error: ' + error)
  })
}

function parseCSR (csr) {
  let match
  const text = childProcess.execSync('openssl req -noout -text', { input: csr }).toString()
  const domains = {}
  match = text.match(/Subject:.*? CN=([^\s,;\/]+)/)
  if (match) {
    const domain = match[1]
    domains[domain] = true
  }
  match = text.match(/X509v3 Subject Alternative Name: \n +([^\n]+)\n/)
  if (match) {
    match[1].split(', ').forEach((text) => {
      if (text.substr(0, 4) == 'DNS:') {
        const domain = text.substr(4)
        domains[domain] = true
      }
    })
  }
  return Object.keys(domains)
}

function sleep (delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

// function uploadCert(){
//   const formData = {
//     "ssl_certificate": fs.readFileSync("./letsencrypt/fullchain.pem"),
//     "private_key": fs.readFileSync("./letsencrypt/domain.pem") // "private_key": fs.readFileSync("letsencrypt/domain_RSA PRIVATE KEY.pem")
//   };
//
//   /*console.log('#########')
//   console.log(encodeURI(fs.readFileSync("./letsencrypt/fullchain.pem").toString('utf8')))
//   console.log('#########')
//   console.log(encodeURI(fs.readFileSync("./letsencrypt/domain.pem").toString('utf8')))
//   console.log('#########')*/
//
//   // https://access.redhat.com/documentation/en-US/OpenShift_Online/2.0/html/REST_API_Guide/Update_Application_Alias.html
//   const url = "https://openshift.redhat.com/broker/rest/application/58acb1297628e1ca2b0001ec/alias/bot.spddl.de"
//   request.put({url : url, qs: formData, headers : {"Authorization" : "Basic " + new Buffer('email@provider.com:').toString("base64") }},
//     function (error, response, body) {
//       //if(!error && body.length == 1){
//         //console.log('kein error')
//         console.log('done')
//         try {
//           console.log(response.statusCode) // 200
//           console.log(response.headers['content-type']) // 'image/png'
//         } catch (e) {
//           console.log(e);
//         }
//         //console.log(response);
//         console.log(body);
//       /*} else {
//         console.log(error)
//       }*/
//     }
//   );
// }

e.uploadCert = function () {
  uploadCert()
}

e.letsencryptHandler = function (req, res, next) {
  res.status(404).send('4o4')
}

e.requestCertificate = function (arg) {
  console.log(new Date() + ' requestCertificate()')
  requestCertificate()

  e.letsencryptHandler = function (req, res, next) {
    console.log('Received %s request on hostname %s for path %s', req.method, req.hostname, req.url)

    const response = responses[req.url]
    if (response) {
      res.set('Content-type', 'text/plain')
      res.send(response)
    } else {
      res.send('Express')
    }

    e.letsencryptHandler = function (req, res, next) {
      res.status(404).send('4o4')
    }
  }
}
