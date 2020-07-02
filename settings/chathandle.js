

























// var exports = module.exports = {};


function getJSON(data) {
  return new Promise(resolve => {
    resolve(data+'.json');
  });
}
let car1 = new Promise(resolve => setTimeout(resolve, 2000, 'Car 1.'));

module.exports = {
  parse: async function(channel, user, message, self) {
    // let result1 = await getJSON('1');
    // let result2 = await getJSON('2');

    let [result1, result2] = await Promise.all([ getJSON('1'), getJSON('2') ]);
    console.log(result1,result2); // cool, we have a result
  }
};




function chathandle(channel, user, message, self) {
  if (settingsprivate.blocked.indexOf(channel) != -1) { return; }

  //#spddl, [object Object], asd, false
  //if (localhost()) console.log('chathandle:  '+channel+', %j, '+message+', '+self,user)

  //console.log('%j',user)
  //console.log(util.inspect(user, false, null));

  if(self){return}

  if(!(user["user-type"] === "mod" || user.username === channel.substr(1) || user.type == 'discord') ){
    //if(user.type == 'discord') { return }
    if(banwordsCheck(channel, message)){
      console.info('BANWORDS '+message)
      bot.timeout(channel, user.username, 20, 'BANWORD: '+message);
      setTimeout(function(){
        console.log('bot.ban('+channel+', '+user.username+', BANWORD: '+message+');');
        bot.ban(channel, user.username, 'BANWORD: '+message);
      },1500);
      return;
    }
    if(towordsCheck(channel, message)){
      console.info('TOWORDS '+message)
      //bot.timeout(channel, user.username, 20, 'TOWORDS '+message);
      bot.timeout(channel, user.username, 20);
      return;
    }
  }

  try {
    if(!(settingsprivate[channel.substr(1)].botsettings.ignorecmd.indexOf(message.toLowerCase().split(" ")[0]) == -1)){ return } // Um andere Bots/Befehle zu zulassen
  } catch (e) {
    console.warn(channel+' ??'); return;
  }

  if(message.substr(0,1) == "#") {
    //if (user.type === 'discord') return // TODO: evtl. per text etwas wieder geben
    if (user.type === 'discord') if (!settingsprivate[channel.substr(1)].botsettings.discord.magicconchshell || false) return // TODO: evtl. per text etwas wieder geben (Fehlermeldung)

    if(AntiKappa.isSpam(message, channel.substr(1))){
      return // console.log('REJECTED: ' + message); // console.log('REJECTED: ' + text + ' '+AntiKappa.isSpam(text, chan.substr(1)).debug);
    } else {
      settings[channel.substr(1)].messageArray.push(message); // console.log('ACCEPTED: ' + message);
    }

    //console.log('%j',user)
    var voicelanguage = (settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicelanguage || 'UK English Female')
    if(settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.autodetectlanguage || false) if(franc(message.substr(1), {'whitelist' : ['deu', 'eng']}) === 'eng') voicelanguage = 'UK English Female'
      //if(settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.autodetectlanguage && (voicelanguage !== "Deutsch Female")) console.log('lang '+voicelanguage);

    if(settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.modsonly || false){
      if (user["user-type"] === "mod" || user.username === channel.substr(1)){ // if(adminCheck(user.username, channel))
        io.of('/magicconchshell/'+channel.substr(1)).emit('incomingmsg', {'user': user.username, 'username': (settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.username && true), 'color': user.color, 'text': message.substr(1), 'emotes': user.emotes, 'lang': voicelanguage, 'volume': (settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicevolume || 1), 'pitch': (settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicepitch || 1), 'rate': (settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicerate || 1), 'type': user.type })
        return
      }
    }else{
        io.of('/magicconchshell/'+channel.substr(1)).emit('incomingmsg', {'user': user.username, 'username': (settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.username && true), 'color': user.color, 'text': message.substr(1), 'emotes': user.emotes, 'lang': voicelanguage, 'volume': (settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicevolume || 1), 'pitch': (settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicepitch || 1), 'rate': (settingsprivate[channel.substr(1)].botsettings.alerts.magicconchshell.voicerate || 1), 'type': user.type })
        return
    }
  }

  // BUG: nach einem giveaway werden Commands nicht mehr erkannt
  if (user.username != 'jtv'){
    //console.log(user.username+' '+channel); // Discord weil ich nur Offline Teste und es diesen Channel hier nicht gibt

    // console.log(channel);
    // console.log(settings[channel.substr(1)].giveaway);

    if (settings[channel.substr(1)].giveaway){
      console.log('giveaway läuft');
      // wenn ein KeyWord verfügbar ist überprüfe es
      if (settingsprivate[channel.substr(1)].botsettings.giveaway.keyword) {
        if (settingsprivate[channel.substr(1)].botsettings.giveaway.keyword !== message){ return; }
        console.log(settingsprivate[channel.substr(1)].botsettings.giveaway.keyword+' !== '+ message);
      }

      console.log('keyword stimmt');

      if(giveawayCheck(user, channel)){
        console.log('giveawayCheck');
        console.log(settings[channel.substr(1)].giveawaymembers); // nicht im array

          if (_.findIndex(settings[channel.substr(1)].giveawaymembers, { username: user.username }) == -1){
            if(settings[channel.substr(1)].giveawaymembers.length === 0){ //ist array leer
              console.log('der erste == 0 '+user.username)
              viewerava(user.username, function(twitchlogo){
                if(twitchlogo !== null) twitchlogo = twitchlogo.substr(47)
                settings[channel.substr(1)].giveawaymembers.unshift({ 'color': user.color, 'display-name': user["display-name"], 'emotes': user.emotes, 'subscriber': user.subscriber, 'turbo': user.turbo, 'user-type': user["user-type"], 'username': user.username, 'msg': message, 'logo': twitchlogo });
                io.of('/giveaway/'+channel.substr(1)).emit('incomingmsg', { 'color': user.color, 'display-name': user["display-name"], 'emotes': user.emotes, 'subscriber': user.subscriber, 'turbo': user.turbo, 'user-type': user["user-type"], 'username': user.username, 'msg': message, 'logo': twitchlogo });
              })
            } else if (_.findIndex(settings[channel.substr(1)].giveawaymembers, { username: user.username }) == -1){ // falls nicht im Array
              console.log('ein weiterer == -1 '+user.username)
              viewerava(user.username, function(twitchlogo){
                if(twitchlogo !== null) twitchlogo = twitchlogo.substr(47)
                settings[channel.substr(1)].giveawaymembers.unshift({ 'color': user.color, 'display-name': user["display-name"], 'emotes': user.emotes, 'subscriber': user.subscriber, 'turbo': user.turbo, 'user-type': user["user-type"], 'username': user.username, 'msg': message, 'logo': twitchlogo });
                io.of('/giveaway/'+channel.substr(1)).emit('incomingmsg', { 'color': user.color, 'display-name': user["display-name"], 'emotes': user.emotes, 'subscriber': user.subscriber, 'turbo': user.turbo, 'user-type': user["user-type"], 'username': user.username, 'msg': message, 'logo': twitchlogo });
              })
            } else { console.log(user.username+' kommt nicht (mehr) ins Giveaway') }
        }
      } else {
        // console.log('giveawayCheck false %j',user);
      }
    }

  }

  if(settingsprivate[channel.substr(1)].botsettings.randomreply || false){
    if(message === "cookie"){
      if (user.type === 'discord') dc.sendMessage({ to: user.channelID, message: "Great! You jump off bridges when bots tell you to as well?"})
      else bot.say(channel, "Great! You jump off bridges when bots tell you to as well?", 1);
      return;
    }
  }

  // if(message.substr(0,4) == "!ads"){
  //   if(user["user-type"] === "mod" || user.username === channel.substr(1)){
  //     advertising(channel, message, user.username);
  //     return;
  //   }
  // }

  // TODO ALT
  if(message.substr(0,1) == "!"){
    parseCmd(message.substr(1),channel,user);
    return;
  }

  if(message.length > 5){ // mehr als 5 Zeichen

    if(!(user["user-type"] === "mod" || user.username === channel.substr(1))){ // ist kein Admin
      if (user.type == 'discord' || user.type == 'steam' || user.type == 'twitchgroup') { return; } // Testing
      if (!UserCheck(user,channel,'uppercase')) {
        // var uppercasetext = uppercase(message)
        // var uppercasetext = uppercase(withoutEmotes(message, user.emotes))
        var uppercasetext = uppercase(withoutEmotes(message, user.emotes).replace(/\s+/g, ''))
        if (uppercasetext >= (settingsprivate[channel.substr(1)].botsettings.uppercasepercent / 100)){ // 95% Fast alles groß geschrieben
          bot.timeout(channel, user.username, 20, 'TIMEOUT! (Capslock) Erlaubt sind '+settingsprivate[channel.substr(1)].botsettings.uppercasepercent+'% und das waren: '+(uppercasetext*100).toFixed(2)+'%')
          setTimeout(function(){
            if(settingsprivate[channel.substr(1)].botsettings.wronguppercasemsg && true){
              bot.say(channel, user.username+", calm down! Try that again in 20 secs. BloodTrail [Capslock]",3);
            }
          },1500);
          checkViolations(user.username);
          return;
        }
      }

      if (!UserCheck(user,channel,'symbols')) {
        //var symbolstext = symbols(message)
        var symbolstext = symbols(message.replace(/\s+/g, ''))
        if (symbolstext >=(settingsprivate[channel.substr(1)].botsettings.symbolspercent / 100)){ // 55% über die hälfte nur Symbole
          bot.timeout(channel, user.username, 20, 'TIMEOUT! (Symbols) Erlaubt sind '+settingsprivate[channel.substr(1)].botsettings.symbolspercent+'% und das waren: '+(symbolstext*100).toFixed(2)+'%');
          setTimeout(function(){
            if(settingsprivate[channel.substr(1)].botsettings.wrongsymbolsmsg && true){
              bot.say(channel, user.username+", calm down! Try that again in 20 secs. BloodTrail [Symbols]", 3);
            }
          },1500);
          checkViolations(user.username);
          return;
        }
      }
    }

  }

  if (!UserCheck(user,channel,'postingdomains')) {
    if(!scanForLink(message, channel, user)){
      // console.log(message+', '+channel+', %j',user);
      if(!(user["user-type"] === "mod" || user.username === channel.substr(1))){
        // console.log('user.username: '+user.username);
        if(settings[channel.substr(1)].allowing.indexOf(user.username.toLowerCase()) == -1){
          bot.timeout(channel, user.username, 20, 'Timeout, da ein Link gepostet wurde ohne !permit');
          setTimeout(function(){
            if(settingsprivate[channel.substr(1)].botsettings.wronglinkmsg && true){
              bot.say(channel, "Ahem! "+user.username+", did you ask for permission to post that link?",3);
            }
          },1500);
          checkViolations(user.username);
        }
        return;
      }
    }
  }
  //if((message.toLowerCase().match('spddl_bot') !== null) && user.username == 'spddl'){bot.say(channel, "Hey spddl! ༼ つ ◕_◕ ༽つ");return}
  if((message.toLowerCase().match('spddl_bot') !== null) && user.username == 'spddl'){bot.say(channel, "Hey spddl! (✌ﾟ∀ﾟ)☞ ");return}

  if(message == 'requestCertificate' && user.username == 'spddl' && channel == '#spddl') {
    startrequestCertificate=true
    ssl.requestCertificate()
    setTimeout(function(){
      startrequestCertificate=false
    },50000) // 50sek
    return
  }

  textScan(message, channel, user.username, user); // damit der Bot auch auf "bot" reagiert
  //permissioncheck(message,user,channel)
}
