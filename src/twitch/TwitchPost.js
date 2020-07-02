function TwitchPost (channel, token, clientRes) {
  console.log('channel: ' + channel + ' | token: ' + token)
  const reqOptions = {
    host: 'api.twitch.tv',
    port: 443,
    path: '/kraken/channels/' + channel + '/subscriptions', // https://github.com/justintv/Twitch-API/blob/master/v3_resources/subscriptions.md#get-channelschannelsubscriptionsuser
    method: 'GET',
    headers: {
      Accept: 'application/vnd.twitchtv.v3+json',
      Authorization: 'OAuth ' + token
    }
  }

  const preq = https.request(reqOptions, (res) => {
    let body = ''
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      body += chunk
    })
    res.on('end', () => {
      console.log(res.statusCode + ', ' + res.headers)
      // clientRes.writeHead(res.statusCode, res.headers)
      console.log(body)
      // clientRes.end(body)
    })
  })
  preq.end()
}
