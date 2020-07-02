// const winston = require('winston')
const util = require('util')

// require('winston-papertrail').Papertrail
 
// if ((process.env.NODE_ENV || '').toLowerCase() === 'production') {
//   const winstonPapertrail = new winston.transports.Papertrail({
//     host: 'logs2.papertrailapp.com',
//     port: 23414
//   })  
//   winstonPapertrail.on('error', function (err) {
//     console.error(err)
//   })
//   let logger = new winston.Logger({
//     transports: [winstonPapertrail]
//   })
  
  // console.log = (...args) => logger.info.call(logger, ...args)
  // console.info = (...args) => logger.info.call(logger, ...args)
  // console.warn = (...args) => logger.warn.call(logger, ...args)
  // console.error = (...args) => logger.error.call(logger, ...args)
  // console.debug = (...args) => logger.debug.call(logger, ...args)
// }

// switch((process.env.NODE_ENV || '').toLowerCase()){
//   case 'production':

//       logger.add(winston.transports.File, {
//           filename: __dirname + '/application.log',
//           handleExceptions: true,
//           exitOnError: false,
//           level: 'warn'
//       });
//       break;
//   case 'test':
//       // Don't set up the logger overrides
//       return;
//   default:
//       logger.add(winston.transports.Console, {
//           colorize: true,
//           timestamp: true,
//           level: 'info'
//       });
//       break;
// }


// const winstonPapertrail = new winston.transports.Papertrail({
//   host: 'logs2.papertrailapp.com',
//   port: 23414
// })

// winstonPapertrail.on('error', function (err) {
//   console.log(err)
// })

// var logger = new winston.Logger({
//   transports: [winstonPapertrail]
// })

function logger (params) {
  console.info('logger', params)
}

// console.log = (...args) => {
//   logger.call(logger, ...args)
//   // logger(...args)
//   process.stdout.write(util.format(...args) + '\n')
// }


console.log = (...args) => logger.call(logger, ...args) && process.stdout.write(util.format(...args) + '\n')


// console.log = (...args) => logger.info.call(logger, ...args)
// console.info = (...args) => logger.info.call(logger, ...args)
// console.warn = (...args) => logger.warn.call(logger, ...args)
// console.error = (...args) => logger.error.call(logger, ...args)
// console.debug = (...args) => logger.debug.call(logger, ...args)


// console.log('log?')
// console.info('info?')
// console.warn('warn?')
// console.error('error?')

console.log('debug')