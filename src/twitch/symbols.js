function symbols (string) {
  var count = 0
  for (var i = 0; i < string.length; i++) {
    var charCode = string.substring(i, i + 1).charCodeAt(0)
    //                          ß                   ä                   Ä                  ü                   Ü                    ö                   Ö
    //         (!(charCode === 223 || charCode === 228 || charCode === 196 || charCode === 252 || charCode === 220 || charCode === 246 || charCode === 214))
    if (!(charCode === 223 || charCode === 228 || charCode === 196 || charCode === 252 || charCode === 220 || charCode === 246 || charCode === 214)) { // wird ignoriert
      if ((charCode <= 30 || charCode >= 127) || charCode === 65533) {
        // console.log(charCode+' '+string.substring(i, i+1)+' trigger')
        count++
      }
    }
  }
  return Math.ceil((count / string.length) * 100) / 100
}
