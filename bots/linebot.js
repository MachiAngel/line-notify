
const createbot = require('linebot')


const bot = createbot({
  channelId: process.env.LINE_CHANNELID,
  channelSecret: process.env.LINE_SECRET,
  channelAccessToken: process.env.LINE_TOKEN
});


//handle message
bot.on('message', async (event) => {

  //先判斷source
  const { userId, type } = event.source
  if (type !== 'user') {return}

  logHelper(event)

  try {
    const result = await event.reply(userId)  
    console.log(`reply result success:${JSON.stringify(result)}`)
  } catch (e) {
    console.log(e.message);
  }

})

bot.on('follow', async (event) => {
    console.log('follow:')
    console.log(event)
})

bot.on('unfollow', async (event) => {
  console.log('unfollow:')
  console.log(event)
})

bot.on('join', async (event) => {

})

bot.on('leave', async (event) => {

})

bot.on('postback', async (event) => {

})


module.exports = bot


const logHelper = (event) => {
  const { userId, type: sourceType } = event.source

  const { text, type: messageType } = event.message

  console.log(`-------------Start--------------`)
  console.log(`來源-類型: ${sourceType}`)
  console.log(`來源-使用者ID: ${userId}`)
  console.log(`----------------------------`)
  console.log(`訊息類型:${messageType}`)
  console.log(`-----------訊息-------------`)
  console.log(`訊息:${text}`)
  console.log(`--------------End----------------`)
}


// bot.on('beacon', async (event) => {})