const { src, dest, series } = require('gulp')
const concat = require('gulp-concat')
const jsImport = require('gulp-js-import')
// const xo = require('gulp-xo')
const standard = require('gulp-standard')
const fs = require('fs')

const file = 'bot.js'

let oldFile = {}

const readLines = () => {
  return new Promise(function (resolve, reject) {
    try {
      let i
      let count = 0
      fs.createReadStream(file)
        .on('data', function (chunk) {
          for (i = 0; i < chunk.length; ++i) {
            if (chunk[i] === 10) count++
          }
        })
        .on('end', function () {
          resolve(count)
        })
    } catch (e) {
      reject(e)
    }
  })
}

const clean = async cb => {
  try {
    const stat = fs.statSync(file)
    const lines = await readLines()
    oldFile = {
      ...stat,
      lines
    }
  } catch (error) {}

  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
  } catch (error) { }
  cb()
}

const build = cb => {
  // return src('./src/*.js')
  // return src(['./src/*.js', './src/**/*.js'])
  // .pipe(concat(file))

  return src('./src/_bot.js')
    .pipe(jsImport({ hideConsole: true }))
    .pipe(concat(file))
    // .pipe(xo({ semicolon: false}))
    // .pipe(xo.format())
    // .pipe(xo.failAfterError())
    .pipe(standard())
    .pipe(standard.reporter('default', {
      // breakOnError: true,
      // quiet: true,
      showRuleNames: true
    }))
    .pipe(dest('./'))
}

const diff = async cb => {
  try {
    const stat = fs.statSync(file)
    const lines = await readLines()
    console.log(`
  Letzte Änderung ${timeConversion(stat.birthtimeMs - oldFile.birthtimeMs)}
  Größe ${(stat.size === oldFile.size)
    ? humanFileSize(stat.size)
    : (stat.size < oldFile.size)
      ? humanFileSize(stat.size) + '(\x1b[32m-' + humanFileSize(oldFile.size - stat.size) + '\x1b[0m)'
      : humanFileSize(stat.size) + '(\x1b[33m+' + humanFileSize(stat.size - oldFile.size) + '\x1b[0m)'
}
  ${(lines === oldFile.lines)
    ? lines + ' Zeilen'
    : (lines < oldFile.lines)
      ? lines + ' Zeilen (\x1b[32m-' + (oldFile.lines - lines) + '\x1b[0m)'
      : lines + ' Zeilen (\x1b[33m+' + (lines - oldFile.lines) + '\x1b[0m)'
}
`)
    cb()
  } catch (error) {}
}

exports.build = build
exports.default = series(clean, build, diff)

function timeConversion (millisec) {
  const seconds = (millisec / 1000).toFixed(1)
  const minutes = (millisec / (1000 * 60)).toFixed(1)
  const hours = (millisec / (1000 * 60 * 60)).toFixed(1)
  const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1)
  if (seconds < 60) {
    return seconds + ' Sek'
  } else if (minutes < 60) {
    return minutes + ' Min'
  } else if (hours < 24) {
    return hours + ' Std'
  } else {
    return days + ' Tage'
  }
}

function humanFileSize (size) {
  var i = Math.floor(Math.log(size) / Math.log(1024))
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}
