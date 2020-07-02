'use strict'

module.exports = function () {
  return {
    steam_name: '',
    steam_password: '',
    steam_spddl: '',
    steamapikey: '', // http://steamcommunity.com/dev/apikey
    openweathermapkey: '', // http://home.openweathermap.org/ //var Wundergroundkey = '' // http://www.wunderground.com/weather/api/d/docs
    youtubekey: '',
    LastFm_api_key: '',
    LastFm_secret: '',
    Pubg_TRN_Api_Key: '',

    formatTime: function () {
      const d = new Date()
      let h = d.getHours()
      let m = d.getMinutes()
      let s = d.getSeconds()
      h = (h < 10 ? '0' : '') + h
      m = (m < 10 ? '0' : '') + m
      s = (s < 10 ? '0' : '') + s
      return h + ':' + m + ':' + s + ' '
    },

    formatDate: function () {
      const d = new Date()
      let day = d.getDate()
      let mon = d.getMonth() + 1
      day = (day < 10 ? '0' : '') + day
      mon = (mon < 10 ? '0' : '') + mon
      let h = d.getHours()
      let m = d.getMinutes()
      let s = d.getSeconds()
      h = (h < 10 ? '0' : '') + h
      m = (m < 10 ? '0' : '') + m
      s = (s < 10 ? '0' : '') + s
      // return day+'.'+mon+' '+h+':'+m+':'+s+' '
      return ''
    },

    localhost: function () {
      if (process.env.USER === 'root') {
        return false
      } else if (process.env.USERNAME === 'spadd') {
        return true
      } else {
        console.warn('config.localhost() o0')
        return true
      }
    }
  }
}
