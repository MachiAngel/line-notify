
const createbot = require('linebot')
const { askTemplate } = require('./template/askTemplate.js')
const Handler = require('./handlers/handler.js')
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

  await logHelper(event)

  try {
    const result = await event.reply(askTemplate)  
    console.log(`reply result success:${JSON.stringify(result)}`)
  } catch (e) {
    console.log(e.message);
  }

})

bot.on('follow', async (event) => {
    console.log('follow:')
    try {
      await Handler.followHandler(event)
    } catch (e) { console.log(e) }
})

bot.on('unfollow', async (event) => {
  console.log('unfollow:')
  try {
    await Handler.unfollowHandler(event)
  } catch (e) { console.log(e) }
})

bot.on('join', async (event) => {
  console.log('some one join:')
  try {
    await Handler.followHandler(event)
  } catch (e) { console.log(e) }

})

bot.on('leave', async (event) => {
  try {
    await Handler.unfollowHandler(event)
  } catch (e) { console.log(e) }
})

bot.on('postback', async (event) => {
  console.log(event)
})


module.exports = bot


const logHelper = async (event) => {


  
  const { userId, type: sourceType } = event.source 
  const { text='no text type', type: messageType ='no messageType' } = event.message || {}
  //{userId, displayName, pictureUrl, statusMessage}
  const profile = await event.source.profile()

  console.log(`-------------Start--------------`)
  console.log(`來源-類型: ${sourceType}`)
  console.log(`來源-使用者ID: ${userId}`)
  console.log(`----------------------------`)
  console.log(`來源-使用者Profile:`)
  console.log(profile)
  console.log(`----------------------------`)
  console.log(`訊息類型:${messageType}`)
  console.log(`-----------訊息-------------`)
  console.log(`訊息:${text}`)
  console.log(`--------------End----------------`)
}


// bot.on('beacon', async (event) => {})