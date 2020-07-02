function counter (phrase, user, channel, callback) {
  // http://underscorejs.org/#debounce
  console.log('counter fn ' + phrase + ', ' + user + ', ' + channel)
  try {
    db.commands[channel].counter[phrase][Object.keys(db.commands[channel].counter[phrase])[0]]++ // Plus 1
  } catch (error) {
    console.log(error)
  }
  // console.log(Object.keys(commands[channel].counter[phrase])[0]); // Text
  // console.log(_.values(commands[channel].counter[phrase])[0]); // Counter
  callback((Object.keys(db.commands[channel].counter[phrase])[0]).split('##').join(_.values(db.commands[channel].counter[phrase])[0]))
  db.command_save()
}
