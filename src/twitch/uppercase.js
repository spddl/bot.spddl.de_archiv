function uppercase (string) {
  var chars = string.length
  var uLet = string.match(/[A-Z]/g)
  if (uLet !== null) {
    return (uLet.length / chars)
  }
  return 0
}
