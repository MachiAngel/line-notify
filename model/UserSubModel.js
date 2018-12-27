
const { 
  USER_PUSHED_TABLE_STRING,
  SUBSCRIBE_PTT_TABLE_STRING,
  SUBSCRIBE_EYNY_VIDEO_TABLE_STRING,
  SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING,
  SUBSCRIBE_EYNY_MOVIE_TABLE_STRING
} = require('../constants/tableSchema')




// user_line_id
// sub_type
// title
// not_title
// board
// author
// category
// rate

class UserSubModel {

  constructor({ db }) {
    this.db = db
  }

  /** @description Get all user subscriotions
  * @param {String} user_line_id  
  * @param {object} pgdb
  * @return { object } return all data from table u given
  */
  
  async getAllUserSubscriptions(user_line_id) {
    
    try {
      const pttSubs = await this.db(SUBSCRIBE_PTT_TABLE_STRING).where({ user_line_id}).returning('*')
      const eynyVideoSubs = await this.db(SUBSCRIBE_EYNY_VIDEO_TABLE_STRING).where({ user_line_id }).returning('*')
      const eynyBTMovieSubs = await this.db(SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING).where({ user_line_id }).returning('*')
      const eynyMovieSubs = await this.db(SUBSCRIBE_EYNY_MOVIE_TABLE_STRING).where({ user_line_id }).returning('*')

      return { pttSubs, eynyVideoSubs, eynyBTMovieSubs, eynyMovieSubs}

    } catch (e) {
      console.log(e.message)
      throw e
    }
  }

  
  async getSubsByTable(tableName) {
    try {
      const tableSubs = await this.db.select('*').from(tableName)
      
      return tableSubs

    } catch (e) {
      console.log(e.message)
      throw e
    }
    
  }
  

  /** @description Save pushed article to pgdb
  * @param {String} user_line_id.
  * @param {String} article_url   
  */
  async savePushedArticleUrlToPGDB(user_line_id, article) {
    const { article_url, article_source } = article
    try {

      const insertResult = await this.db.insert({
        user_line_id,
        article_url,
        sub_type: article_source
      })
        .into(USER_PUSHED_TABLE_STRING)
        .returning('*')

      if (!insertResult.length) {
        throw new Error(`insert ${USER_PUSHED_TABLE_STRING} table return nothing`)
      }
      return insertResult[0]

    } catch (e) {

      console.log(e.message)
      throw e
    }
  }


  /** @description Determines articles is pushed or not.
  * @param {String} user_line_id.
  * @param {String} article_url   
  * @return {Boolean} return true or false 
  */
  async isSubscriptionPushed(user_line_id, article_url) {
    try {

      const query = {
        user_line_id,
        article_url
      }
      const subs = await this.db(USER_PUSHED_TABLE_STRING)
        .where(query)
        .select('id')

      return subs.length ? true : false 

    } catch (e) {
      console.log(e.message)
      throw e
    }
  }

  /** @description Get array of ptt board by all user subscription
  * @return {array} array of ptt board by all user subscription
  */
  async getSubscriptionBoardsFromPtt(pgdb) {
    try {
      const boards = await this.db
        .select('board')
        .from(SUBSCRIBE_PTT_TABLE_STRING)
        .groupBy('board')
        .returning('board')

      return boards.map(sub => {
        return sub.board
      })
        
    } catch (e) {
      console.log(e)
      throw e
    }

  }

  /** @description Get array of keyword of eyny video by all user subscription
  * @return {array} array of keyword of eyny video by all user subscription
  */
  async getSubscriptionsOfKeywordFromEynyVideo(pgdb) {
    try {
      const keywords = await this.db
        .select('keyword')
        .from(SUBSCRIBE_EYNY_VIDEO_TABLE_STRING)
        .groupBy('keyword')
        .returning('keyword')

      return keywords.map(sub => {
        return sub.keyword
      })

    } catch (e) {
      console.log(e)
      throw e
    }

  }

  


  
}


module.exports = UserSubModel