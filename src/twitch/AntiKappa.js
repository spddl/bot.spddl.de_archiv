const AntiKappa = {
  // CHANGE SETTINGS HERE
  /* r9kModeBool: true, //personal twitch r9k
    blockExclusiveUpperCaseBool: true, //removes exclusive caps lock
    blockMostlyUpperCaseBool: true, //blocks messages with mostly caps lock
    blockVeryLongMessagesBool: true, //removes long messages which usually contains repetitive copy pastes
    blockRepeatedWordInSentenceBool: true, //removes repeated words, like "Kappa Kappa Kappa"
    blockTypicalSpamBool: true, //removes suspected random spam
    blockNonEnglishCharactersBool: true, //blocks everything that isn't the standard ASCII character set
    */ // CHANGE SETTINGS HERE

  // messageArray: [],
  longMessageCountInt: 140,
  mostlyUpperCaseTheshholdPercentage: 70,
  repeatedWordInSentenceCountInt: 3,
  typicalSpamStringArray: [ // will block the sentence if it contains any of these words, and you have "blockTypicalSpamBool" set to true
    'gachi', 'feelsgoodman', 'feelsbadman', 'kkona'
  ]
}

AntiKappa.isSpam = function (text, chan) {
  // console.log('AntiKappa.isSpam chan '+chan);
  if (text === '') {
    io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: empty' })
    console.log('/magicconchshell/' + chan + '  Reason for removal: empty')
    return true
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockVeryLongMessagesBool || false) {
    if (text.length > AntiKappa.longMessageCountInt) {
      io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: VeryLong' })
      console.log('/magicconchshell/' + chan + '  Reason for removal: VeryLong')
      return true
    }
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockMostlyUpperCaseBool || false) {
    if (AntiKappa.isMostlyUpperCase(text)) {
      io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: MostlyUpperCase' })
      console.log('/magicconchshell/' + chan + '  Reason for removal: MostlyUpperCase')
      return true
    }
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockExclusiveUpperCaseBool || false) {
    if (text === text.toUpperCase()) {
      io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: ExclusiveUpperCase' })
      console.log('/magicconchshell/' + chan + '  Reason for removal: ExclusiveUpperCase')
      return true
    }
  }

  if ((db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockRepeatedWordInSentenceBool || false) && AntiKappa.isRepeatedWordInSentence(text)) {
    io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: RepeatedWordInSentenc' })
    console.log('/magicconchshell/' + chan + '  Reason for removal: RepeatedWordInSentenc')
    return true
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockTypicalSpamBool || false) {
    for (var i = 0; i < AntiKappa.typicalSpamStringArray.length - 1; i++) {
      var entry = AntiKappa.typicalSpamStringArray[i].toUpperCase()
      var compare = text.toUpperCase()
      if (compare.indexOf(entry) > -1) {
        io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: TypicalSpam' })
        console.log('/magicconchshell/' + chan + '  Reason for removal: TypicalSpam')
        return true
      }
    }
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.r9kModeBool || false) {
    if (db.settings[chan].messageArray.indexOf(text) > -1) { // if(AntiKappa.messageArray.indexOf(text) > -1){
      io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: r9kMode' })
      console.log('/magicconchshell/' + chan + '  Reason for removal: r9kMode')
      return true
    }
  }

  if (db.settingsprivate[chan].botsettings.alerts.magicconchshell.blockNonEnglishCharactersBool || false) {
    if (AntiKappa.isNonEnglishCharacter(text)) {
      console.log('/magicconchshell/' + chan)
      io.of('/magicconchshell/' + chan).emit('incomingmsg', { rejected: true, message: text, debug: 'Reason for removal: NonEnglishCharacter' })
      console.log('/magicconchshell/' + chan + '  Reason for removal: NonEnglishCharacter')
      return true
    }
  }
  return false
  // return {r: false, debug: ""}
}

AntiKappa.isRepeatedWordInSentence = function (text) {
  const sortedStringArray = text.split('  ').sort()
  let duplicatesStringArray = []
  for (var i = 0; i < sortedStringArray.length - 1; i++) {
    if (sortedStringArray[i + 1] === sortedStringArray[i] && sortedStringArray[i].length > 3) { // dont take short words like "at", "a", "or" etc because they can be repeated a lot but are not spam per say
      duplicatesStringArray.push(sortedStringArray[i])
    }
  }

  duplicatesStringArray = duplicatesStringArray.filter(Boolean)
  return duplicatesStringArray.length >= AntiKappa.repeatedWordInSentenceCountInt
}

AntiKappa.isMostlyUpperCase = function (text) {
  const textLength = text.length
  let amountUpperCaseInt = 0
  for (var i = 0, len = textLength; i < len; i++) {
    var char = text[i]
    if (char === char.toUpperCase()) {
      amountUpperCaseInt++
    }
  }

  const percentageUpperCase = 100 - (textLength - amountUpperCaseInt) / textLength * 100

  return percentageUpperCase >= AntiKappa.mostlyUpperCaseTheshholdPercentage
}

AntiKappa.isNonEnglishCharacter = function (text) {
  const regex = /[^\u00-\u7F]+/
  // var regex = /[^\u0000-\u007F]+/
  return regex.test(text)
}
