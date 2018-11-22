
const pgdb = require('../../db/pgdb.js')
const userModel = require('../../model/UserModel')

const followHandler = async (event) => {
  try {
    const profile = await event.source.profile()
    const user = await userModel.addLineUserToPGDB(profile, pgdb)
    event.reply(`${user.line_displayName} 歡迎你加入~`)
  } catch (e) {
    console.log(e)
  }
}

const unfollowHandler = async (event) => {
  try {
    const userId = event.source.userId
    const update = {
      status:'0'
    }
    await userModel.editLineUserToPGDB(userId, update, pgdb)
    
  } catch (e) {
    console.log(e)
  }
}


module.exports = {
  followHandler,
  unfollowHandler
}