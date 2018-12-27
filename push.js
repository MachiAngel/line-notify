
require('dotenv').config()
const bot = require('./bots/linebot.js')


const userId = 'U20c2fb6275968599930d9c307b5fe9d6'


const messageObject = {
  "type": "text",
  "text": "Hello, world"
}



bot.push(userId, messageObject)
  .then(result => {
    console.log(result)
  })
  .catch(e => {
    console.log(e.message)
  })



// INSERT INTO user_subscribe(
//   "user_line_id", "sub_type", "sub_movie_title", "sub_movie_views", "sub_movie_category", "sub_movie_source"
// )VALUES(
//   'U20c2fb6275968599930d9c307b5fe9d6', 'eyny_movie_articles', '', '', '動作', ''
// )