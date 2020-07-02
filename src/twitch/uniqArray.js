function uniqArray (array) { // TODO: https://dev.to/farskid/detecting-unique-arrays-in-javascript-3f20
  var result = []
  for (var i = 0; i < array.length; i++) {
    if (result.indexOf(array[i].toLowerCase()) < 0) {
      result.push(array[i].toLowerCase())
    }
  }
  return result
}
