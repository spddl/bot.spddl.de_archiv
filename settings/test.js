'use strict'

const variable = 12
// module.exports = function () {
//     return {
//       idk: 'test'
//     };
// }

// module.exports = {
//   version: '1.0',
//   doSomething: function() {
//     return variable
//   }
// }

function Person (name) {
  this.name = name
}

Person.prototype.greet = function () {
  return "Hi, I'm " + this.name
}

module.exports = Person
