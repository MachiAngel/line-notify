

const bot = require('../bots/linebot')
const helper = require('../utils/helper')

class PushModel {

  constructor() {
    this.bot = bot
  }

  /** @description Determines articles is pushed or not.  
  * @param {String} user_line_id.
  * @param {object} article   
  * @return {obejct} {} or not {}
  */
  async push(sub , article) {
    
    const {user_line_id} = sub 
    const sub_type_chinese = helper.getSubTypeChinese(sub.sub_type)
    const queryString = helper.getSubTypeConditionString(sub)
    const { title, article_url } = article

    const messageObject = {
      "type": "text",
      "text": `訂閱類型: ${sub_type_chinese}\n` + queryString + `${title}\n` + `${article_url}`
    }

    try {
      return await this.bot.push(user_line_id, messageObject)
    } catch (e) {
      console.log(e.message)
      throw e
    }
  }

}

module.exports = new PushModel()
