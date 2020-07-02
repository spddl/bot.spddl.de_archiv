// TODO -> .cmd
function market (channel, user, data) {
  /*
  { success: true,
    wep: 'm4a4',
    skin: 'howl',
    wear: 'Well-Worn',
    stattrak: null }
    */

  data = data.substr(7)
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

  /* if(data.length !== 1){
    data[0] = data[0].trim()
    data[1] = data[1].trim() // TypeError: Cannot call method 'trim' of undefined
  } */
  // console.info('[1] wep:'+data[0]+', skin:'+data[1]+', wear:'+data[2]);
  // console.log('[1] '+wep+', '+skin+', '+wear);

  if (data.length === 1) {
    // bot.say(channel, '@'+user+', !market Weapon Name,Skin Name,Quality(e.g. FactoryNew)')
    if (user.type === 'steam') steamSay(user, '!market Weapon Name,Skin Name,Quality(e.g. FactoryNew)')
    else if (user.type === 'twitchgroup') bot.whisper(user.username, '!market Weapon Name,Skin Name,Quality(e.g. FactoryNew)')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '!market Weapon Name,Skin Name,Quality(e.g. FactoryNew)' })
    else bot.say(channel, '@' + user.username + ', !market Weapon Name,Skin Name,Quality(e.g. FactoryNew)')
    return
  }

  if (data[1] === undefined) {
    // bot.say(channel, '@'+user+', SkinName?')
    if (user.type === 'steam') steamSay(user, 'SkinName?') // [TODO]
    else if (user.type === 'twitchgroup') bot.whisper(user.username, 'SkinName?')
    else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'SkinName?' })
    else bot.say(channel, '@' + user.username + ', SkinName?')
    return
  }
  if (data[2] === undefined) {
    data[2] = 'Factory New'
  }

  console.info(' wep:' + data[0] + ', skin:' + data[1] + ', wear:' + data[2] + ', stattrak:' + stattrak)

  /*
 * Retrieve price for a given weapon, skin, and wear. Also gives an option for StatTrak.
 *
 * @param {String} wep Weapon name for request
 * @param {String} skin Skin name for request
 * @param {String} wear The wear of the skin
 * @param {Boolean} stattrak Boolean for including StatTrak to request
 * @param {Function} callback Return requested data
 */
  // csgomarket.getSinglePrice('m4a1-s', "Knight", "Factory New", null, function(err, data) {

  // bot.say(channel, '@'+nick+', '+body.name+','+body.sys.country+' '+Math.round'
  csgomarket.strictNameMode = false
  csgomarket.getSinglePrice(data[0], data[1], data[2], stattrak, function (err, data) {
    // console.log('[2] '+data[0]+', '+data[1]+', '+data[2]);
    // console.info(data)
    if (err) {
      console.error('ERROR', err)
      // weapon skin wear
      // bot.say(channel, '@'+user+', !market Weapon Name,Skin Name,Quality(e.g. FactoryNew) '+err)
      if (user.type === 'steam') steamSay(user, '!market Weapon Name,Skin Name,Quality(e.g. FactoryNew) ' + err)
      else if (user.type === 'twitchgroup') bot.whisper(user.username, '!market Weapon Name,Skin Name,Quality(e.g. FactoryNew) ' + err)
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '!market Weapon Name,Skin Name,Quality(e.g. FactoryNew) ' + err })
      else bot.say(channel, '@' + user.username + ', !market Weapon Name,Skin Name,Quality(e.g. FactoryNew) ' + err)
      // bot.say(channel, '@'+user+', [BETA] Weapon Skin Wear')+
    } else if ((data.lowest_price || data.median_price) === undefined) {
      // bot.say(channel, '@'+user+', not found in the market')
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
      else bot.say(channel, '@' + user.username + ', ' + (stattrak ? '★ ' : '') + data.wep + ' | ' + (data.skin + ' ' ? data.skin : '') + (data.wear ? data.wear + ' ' : '') + low + med + vol)
    }
  })
}
