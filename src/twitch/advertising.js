function advertising (chan, msg, user) {
  msg = msg.trim()

  if (msg.indexOf(' ') === 4) { // kann nur "!ads X" sein
    /*
      !ads:ID (wenn vorhanden) dann gib das Ergebis aus
      !ads:ID (wenn vorhanden) && (kein # enthalten) dann änder nur den Text
      !ads:ID (wenn vorhanden) CRON#TEXT (Cron neu setzen)
    */
    ids = msg.split(' ')
    // ids[1] // ID
    // ids[2] // cron#text
    if (ids[2] === undefined) { // nur "!ads 1"
      if (db.settingsprivate[chan.substr(1)].botsettings.advertising[ids[1]]) { // wenn im json gefunden
        if (user.type === 'steam') steamSay(user, settingsprivate[chan.substr(1)].botsettings.advertising[ids[1]].text) // gib das Ergebnis aus
        else if (user.type === 'twitchgroup') bot.whisper(user.username, settingsprivate[chan.substr(1)].botsettings.advertising[ids[1]].text)
        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: settingsprivate[chan.substr(1)].botsettings.advertising[ids[1]].text })
        else bot.say(chan, settingsprivate[chan.substr(1)].botsettings.advertising[ids[1]].text)
      } else {
        if (user.type === 'steam') steamSay(user, 'Diese ID gibt es nicht tippe "!ads" um dir die aktive Werbung anzeigen zulassen')
        else if (user.type === 'twitchgroup') bot.whisper(user.username, 'Diese ID gibt es nicht tippe "!ads" um dir die aktive Werbung anzeigen zulassen')
        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'Diese ID gibt es nicht tippe "!ads" um dir die aktive Werbung anzeigen zulassen' })
        else bot.say(chan, 'Diese ID gibt es nicht tippe "!ads" um dir die aktive Werbung anzeigen zulassen')
      }
    } else {
      if (db.settingsprivate[chan.substr(1)].botsettings.advertising[ids[1]]) { // ob es diese ID überhaupt gibt
        if (msg.indexOf('#') === -1) {
          // !ads:ID (wenn vorhanden) && (kein # enthalten) dann änder nur den Text
          // alten json lesen crontime extrahieren
          crontime = settingsprivate[chan.substr(1)].botsettings.advertising[ids[1]].text.split('#')
          settingsprivate[chan.substr(1)].botsettings.advertising[ids[1]].text = crontime[0] + '#' + ids[2]

          cbstop(chan, ids[1])
          cb(chan, ids[1], crontime[0], ids[2])
        } else {
          // !ads:ID (wenn vorhanden) CRON#TEXT (Cron neu setzen)
          crontime = msg.split('#')
          var time = crontime[0].substr(5 + ids[1].length).trim()
          settingsprivate[chan.substr(1)].botsettings.advertising[ids[1]].text = time + '#' + crontime[1]

          cbstop(chan, ids[1])
          cb(chan, ids[1], time, crontime[1])
        }
        savecommand_save()
      } else {
        if (user.type === 'steam') steamSay(user, 'diese ID gibt es nicht')
        else if (user.type === 'twitchgroup') bot.whisper(user.username, 'diese ID gibt es nicht')
        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'diese ID gibt es nicht' })
        else bot.say(chan, 'diese ID gibt es nicht')
      }
    }
    // }else{    bot.say(chan, 'diese ID gibt es nicht')  }
  } else if ((msg.indexOf('!adsnew') === 0) || (msg.indexOf('!adsdel') === 0)) {
    ids = msg.split(' ')

    if (msg.indexOf('!adsdel') === -1) { // !adsnew
      console.info('!adsnew')
      if (msg.indexOf('#') === -1) { // Error
        if (user.type === 'steam') steamSay(user, '!adsnew * */2 * * *#WEBUNGSTEXT ("Seconds: 0-59" "Minutes: 0-59" "Hours: 0-23" "Day of Month: 1-31" "Months: 0-11" "Day of Week: 0-6")')
        else if (user.type === 'twitchgroup') bot.whisper(user.username, '!adsnew * */2 * * *#WEBUNGSTEXT ("Seconds: 0-59" "Minutes: 0-59" "Hours: 0-23" "Day of Month: 1-31" "Months: 0-11" "Day of Week: 0-6"')
        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '!adsnew * */2 * * *#WEBUNGSTEXT ("Seconds: 0-59" "Minutes: 0-59" "Hours: 0-23" "Day of Month: 1-31" "Months: 0-11" "Day of Week: 0-6"' })
        else bot.say(chan, '!adsnew * */2 * * *#WEBUNGSTEXT ("Seconds: 0-59" "Minutes: 0-59" "Hours: 0-23" "Day of Month: 1-31" "Months: 0-11" "Day of Week: 0-6")')
      } else {
        crontime = msg.split('#')
        console.info('ids[1].length ' + ids[1].length)
        console.info('ids[0] ' + ids[0])
        // crontime[0].substr(5+ids[1].length).trim()
        console.info('crontime|' + crontime[0].substr(ids[0].length).trim() + '|')

        console.info('crontime[1] ' + crontime[1])
        // console.info('commands[chan.substr(1)].botsettings.advertising.length) '+commands[chan.substr(1)].botsettings.advertising.length)
        if (db.settingsprivate[chan.substr(1)].botsettings.advertising.length === 0) {
          newid = 0
        } else {
          newid = _.last(db.settingsprivate[chan.substr(1)].botsettings.advertising).id
          ++newid
        }
        console.info('3 ' + newid)

        settingsprivate[chan.substr(1)].botsettings.advertising.push({ id: newid, text: crontime[0].substr(ids[0].length).trim() + '#' + crontime[1] })
        savecommand_save()

        cb(chan, newid, crontime[0].substr(ids[0].length).trim(), crontime[1]) // [TODO] zu JSON hinzufügen

        if (user.type === 'steam') steamSay(user, 'ID: ' + newid + ' Msg:' + crontime[1])
        else if (user.type === 'twitchgroup') bot.whisper(user.username, 'ID: ' + newid + ' Msg:' + crontime[1])
        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'ID: ' + newid + ' Msg:' + crontime[1] })
        else bot.say(chan, 'ID: ' + newid + ' Msg:' + crontime[1])
      }

      // console.info('!adsnew CRON#TEXT (Cron neu setzen)')
      // bot.say(chan, '!adsnew CRON#TEXT (Cron neu setzen)')
    } else { // !adsdel
      console.info('!adsdel:ID')
      // bot.say(chan, '!adsdel:ID '+ids[1])
      if (ids[1] === undefined) { // Error
        if (user.type === 'steam') steamSay(user, '!adsdel ID')
        else if (user.type === 'twitchgroup') bot.whisper(user.username, '!adsdel ID')
        else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '!adsdel ID' })
        else bot.say(chan, '!adsdel ID')
      } else {
        for (var i in settingsprivate[chan.substr(1)].botsettings.advertising) {
          if (ids[1] === settingsprivate[chan.substr(1)].botsettings.advertising[i].id) {
            // console.info('DEL: '+commands[chan.substr(1)].botsettings.advertising[i].id)

            cbstop(chan, ids[1])

            if (user.type === 'steam') steamSay(user, 'ID:' + settingsprivate[chan.substr(1)].botsettings.advertising[i].id + ' gelöscht')
            else if (user.type === 'twitchgroup') bot.whisper(user.username, 'ID:' + settingsprivate[chan.substr(1)].botsettings.advertising[i].id + ' gelöscht')
            else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'ID:' + settingsprivate[chan.substr(1)].botsettings.advertising[i].id + ' gelöscht' })
            else bot.say(chan, 'ID:' + settingsprivate[chan.substr(1)].botsettings.advertising[i].id + ' gelöscht')
            settingsprivate[chan.substr(1)].botsettings.advertising.splice(i, 1)

            savecommand_save()
            return
          }
        }
      }
    }
    /*
      !adsnew CRON#TEXT (Cron neu setzen)
      !adsdel:ID
    */
  } else { //! ads gibt die Werbung "stats" zurück
    if (db.settingsprivate[chan.substr(1)].botsettings.advertising.length === 0) {
      if (user.type === 'steam') steamSay(user, 'keine Werbung aktiv')
      else if (user.type === 'twitchgroup') bot.whisper(user.username, 'keine Werbung aktiv')
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: 'keine Werbung aktiv' })
      else bot.say(chan, 'keine Werbung aktiv')
      return
    }
    _.each(db.settingsprivate[chan.substr(1)].botsettings.advertising, function (json) {
      if (user.type === 'steam') steamSay(user, '[' + json.id + '] "' + json.text + '"')
      else if (user.type === 'twitchgroup') bot.whisper(user.username, '[' + json.id + '] "' + json.text + '"')
      else if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: '[' + json.id + '] "' + json.text + '"' })
      else bot.say(chan, '[' + json.id + '] "' + json.text + '"')
    })
  }

  /*
    !ads gibt die Werbung "stats" zurück
    !adsnew CRON#TEXT (Cron neu setzen)
    !ads:ID (status textzurückgeben & cron)
    !ads:ID CRON#TEXT (Cron neu setzen)
  */
}
