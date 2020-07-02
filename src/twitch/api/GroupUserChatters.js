function GroupUserChatters (channelName = '', callback) {
  requestjson.createClient('http://tmi.twitch.tv/group/user/').get(`${channelName}/chatters`, { }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      callback(err, body)
    }
    // console.warn(err)
    callback(err || true, body)
  })
}

function GroupUserChattersPromise (channelName = '') {
  return new Promise((resolve, reject) => {
    GroupUserChatters(channelName, (err, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

/*
{
  "_links": { },
  "chatter_count": 11,
  "chatters": {
    "broadcaster": [],
    "vips": [],
    "moderators": [
      "spddl",
      "spddl_bot"
    ],
    "staff": [],
    "admins": [],
    "global_mods": [],
    "viewers": [
      "0x4c554b49",
      "alfredjudokus100289",
      "anotherttvviewer",
      "appledcs",
      "aten",
      "dataoctopus",
      "luki4fun_bot_master",
      "s1faka",
      "yungsearch"
    ]
  }
}
*/
