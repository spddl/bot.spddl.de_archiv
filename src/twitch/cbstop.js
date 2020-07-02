function cbstop (chan, id) {
  console.info('cbstop: ' + chan + ', ' + id)
  var chanID = chan.substr(1) + i
  if (global.chanID === undefined) {
    console.emergency(chanID + ' (undefined) kann nicht gestoppt werden')
  } else {
    console.info(chanID + ' stopp!')
    global.chanID.stop()
  }
}
