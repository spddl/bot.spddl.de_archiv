functiion GetUserbyID (userID = 0) { // https://dev.twitch.tv/docs/v5/reference/users#get-user-by-id
  requestjson.createClient('https://api.twitch.tv/kraken/users/').get(userID,
    {
      headers: { 'Client-ID': ClientID,
      Accept: 'application/vnd.twitchtv.v5+json'
    }
  }, function (err, res, body) {

      let found = false
      let founddiff = null

      if (!err && res.statusCode === 200) {
      // {
      //   "_id": "44322889",
      //   "bio": "Just a gamer playing games and chatting. :)",
      //   "created_at": "2013-06-03T19:12:02.580593Z",
      //   "display_name": "dallas",
      //   "logo": "https://static-cdn.jtvnw.net/jtv_user_pictures/dallas-profile_image-1a2c906ee2c35f12-300x300.png",
      //   "name": "dallas",
      //   "type": "staff",
      //   "updated_at": "2016-12-13T16:31:55.958584Z"
      // }

      }

      callback(found, founddiff) // Error
    })
}
