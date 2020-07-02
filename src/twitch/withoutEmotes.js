function withoutEmotes (text, emotes) {
  var splitText = text.split('')
  for (var i in emotes) {
    var e = emotes[i]
    for (var j in e) {
      var mote = e[j]
      if (typeof mote === 'string') {
        mote = mote.split('-')
        mote = [parseInt(mote[0]), parseInt(mote[1])]
        var length = mote[1] - mote[0]
        var empty = Array.apply(null, new Array(length + 1)).map(function () { return '' })
        splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length))
        splitText.splice(mote[0], 1, '')
      }
    }
  }
  return splitText.join('')
}
