
const createbot = require('linebot')
const { askTemplate } = require('./template/askTemplate.js')
const Handler = require('./handlers/handler.js')


const isProd = process.env.NODE_ENV === 'production'
console.log(`line bot token check -> isProd ${isProd}`)

const bot = createbot({
  channelId: isProd ? process.env.LINE_CHANNELID : process.env.LINE_CHANNELID_DEV,
  channelSecret: isProd ? process.env.LINE_SECRET : process.env.LINE_SECRET_DEV,
  channelAccessToken: isProd ? process.env.LINE_TOKEN : process.env.LINE_TOKEN_DEV 
});


//handle message
bot.on('message', async (event) => {

  //先判斷source
  const { userId, type } = event.source
  if (type !== 'user') {return}

  if (!isProd) {
    await logHelper(event)
  }
  

  try {
    const result = await event.reply(event.message.text)  
    //console.log(`reply result success:${JSON.stringify(result)}`)
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