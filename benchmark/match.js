'use strict'

const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()
// https://jsperf.com/

const list = {
  '4r5e': 1,
  '5h1t': 1,
  '5hit': 1,
  a55: 1,
  anal: 1,
  anus: 1,
  ar5e: 1,
  arrse: 1,
  arse: 1,
  ass: 1,
  'ass-fucker': 1,
  asses: 1,
  assfucker: 1,
  assfukka: 1,
  asshole: 1,
  assholes: 1,
  asswhole: 1,
  a_s_s: 1,
  'b!tch': 1,
  b00bs: 1,
  b17ch: 1,
  b1tch: 1,
  ballbag: 1,
  balls: 1,
  ballsack: 1,
  bastard: 1,
  beastial: 1,
  beastiality: 1,
  bellend: 1,
  bestial: 1,
  bestiality: 1,
  'bi+ch': 1,
  biatch: 1,
  bitch: 1,
  bitcher: 1,
  bitchers: 1,
  bitches: 1,
  bitchin: 1,
  bitching: 1,
  bloody: 1,
  'blow job': 1,
  blowjob: 1,
  blowjobs: 1,
  boiolas: 1,
  bollock: 1,
  bollok: 1,
  boner: 1,
  boob: 1,
  boobs: 1
}

const switchfn = function (target) {
  switch (target) {
    case '4r5e': return true; break
    case '5htruet': return true; break
    case '5hit': return true; break
    case 'a55': return true; break
    case 'anal': return true; break
    case 'anus': return true; break
    case 'ar5e': return true; break
    case 'arrse': return true; break
    case 'arse': return true; break
    case 'ass': return true; break
    case 'ass-fucker': return true; break
    case 'asses': return true; break
    case 'assfucker': return true; break
    case 'assfukka': return true; break
    case 'asshole': return true; break
    case 'assholes': return true; break
    case 'asswhole': return true; break
    case 'a_s_s': return true; break
    case 'b!tch': return true; break
    case 'b00bs': return true; break
    case 'btrue7ch': return true; break
    case 'btruetch': return true; break
    case 'ballbag': return true; break
    case 'balls': return true; break
    case 'ballsack': return true; break
    case 'bastard': return true; break
    case 'beastial': return true; break
    case 'beastiality': return true; break
    case 'bellend': return true; break
    case 'bestial': return true; break
    case 'bestiality': return true; break
    case 'bi+ch': return true; break
    case 'biatch': return true; break
    case 'bitch': return true; break
    case 'bitcher': return true; break
    case 'bitchers': return true; break
    case 'bitches': return true; break
    case 'bitchin': return true; break
    case 'bitching': return true; break
    case 'bloody': return true; break
    case 'blow job': return true; break
    case 'blowjob': return true; break
    case 'blowjobs': return true; break
    case 'boiolas': return true; break
    case 'bollock': return true; break
    case 'bollok': return true; break
    case 'boner': return true; break
    case 'boob': return true; break
    case 'boobs': return true; break
    default: return false
  }
}

const json = function (target) {
  return list[target] === 1
}

suite
  .add('json', function () { json('biatch2') })
  .add('switchfn', function () { switchfn('biatch2') })

// add listeners
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log()
    console.log('Fastest is')
    console.log(this.filter('fastest')[0].name)
  })
// run async
  .run({ 'async': false })
