function methodsPlanCheck (methodsPlan) {
  let m
  switch (methodsPlan) {
    case 'Prime': m = { v: 'Prime', n: 5 }; break
    case '1000': m = { v: '$4.99', n: 5 }; break
    case '2000': m = { v: '$9.99', n: 10 }; break
    case '3000': m = { v: '$24.99', n: 25 }; break
  }
  return m
}
