// TODO -> .cmd
function knife (channel, user, data) {
  data = data.substr(6)
  let stattrak
  if (data.indexOf('☆') !== -1 || data.indexOf('★') !== -1 || data.indexOf('stattrak') !== -1 || data.indexOf('stat trak') !== -1) {
    data = data.replace('☆', '').replace('★', '').replace('stattrak', '').replace('stat trak', '')
    stattrak = true
  } else {
    stattrak = null
  }

  data = data.split(/,|\|/g)
  for (var i = 0, len = data.length; i < len; i++) {
    data[i] = data[i].trim()
  }
  data = _.compact(data)

  if (data[0] === undefined) {
    if (user.type === 'steam') steamSay(user, 'SkinName?') // [TODO]
    else if (user.type === 'twitchgroup') bot.whisper(user.username, 'SkinName?')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'SkinName?' })
    else bot.say(channel, '@' + user.username + ', SkinName?')
    return
  }

  if (data[1] === undefined) {
    data[1] = null
  }
  if (data[2] === undefined) {
    data[2] = null
  }

  console.info(' knife:' + data[0] + ', skin:' + data[1] + ', wear:' + data[2] + ', stattrak:' + stattrak)

  csgomarket.strictNameMode = false
  csgomarket.getSingleKnifePrice(data[0], data[1], data[2], stattrak, function (err, data) {
    if (err) {
      console.error('ERROR', err)
      if (user.type === 'steam') steamSay(user, '!knife Weapon Name,Skin Name,Quality(e.g. FactoryNew) ' + err)
      else if (user.type === 'twitchgroup') bot.whisper(user.username, '!market Weapon Name,Skin Name,Quality(e.g. FactoryNew) ' + err)
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '!market Weapon Name,Skin Name,Quality(e.g. FactoryNew) ' + err })
      else bot.say(channel, '@' + user.username + ', !market Weapon Name,Skin Name,Quality(e.g. FactoryNew) ' + err)
    } else if ((data.lowest_price || data.median_price) === undefined) {
      if (user.type === 'steam') steamSay(user, 'not found in the market')
      else if (user.type === 'twitchgroup') bot.whisper(user.username, 'not found in the market')
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'not found in the market' })
      else bot.say(channel, '@' + user.username + ', not found in the market')
    } else {
      console.info(data)
      let low
      let med
      let vol

      if (data.lowest_price === undefined) {
        low = ''
      } else {
        low = 'Lowest price: ' + data.lowest_price + ' // '
      }
      if (data.median_price === undefined) {
        med = ''
      } else {
        med = 'Median price: ' + data.median_price + ' // '
      }
      if (data.volume === undefined) {
        vol = ''
      } else {
        vol = data.volume + ' sold/bought on the market'
      }

      if (user.type === 'steam') steamSay(user, (stattrak ? '★ ' : '') + low + med + vol)
      else if (user.type === 'twitchgroup') bot.whisper(user.username, (stattrak ? '★ ' : '') + low + med + vol)
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: (stattrak ? '★ ' : '') + low + med + vol })
      else bot.say(channel, '@' + user.username + ', ' + (stattrak ? '★ ' : '') + data.knife + ' | ' + (data.skin ? data.skin + ' ' : '') + (data.wear ? data.wear + ' ' : '') + low + med + vol)
    }
  })
}
