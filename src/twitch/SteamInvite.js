function SteamInvite (user, msg) {
  return new Promise(function (resolve) {
    var url = msg.trim()

    if (url.indexOf('profiles/') !== -1) {
      url = url.slice(url.indexOf('profiles/') + 9)
    }
    if (url.indexOf('id/') !== -1) {
      url = url.slice(url.indexOf('id/') + 3)
    }

    url = url.replace(/\//g, '')

    console.log('url: ' + url)
    if (!isNaN(url)) { url = new SteamID(url) }
    steamCommunity.getSteamUser(url, function (err, data) {
      if (err) { console.log(err) }

      try {
        console.log('data.name: ' + data.name)
        resolve(data.name + ' bekommt eine Gruppen einladung')
      } catch (e) {
        console.warn(e)
      }

      try {
        console.log('data.steamID: ' + data.steamID)
      } catch (e) {
        console.warn(e)
      }

      try {
        steamclient.inviteToGroup(data.steamID, '103582791436262781') // Kirby
      } catch (e) {
        console.warn(e)
      }
    })
  })
}
