
const { 
  USER_PUSHED_TABLE_STRING,
  SUBSCRIBE_PTT_TABLE_STRING,
  SUBSCRIBE_EYNY_VIDEO_TABLE_STRING
} = require('../constants/tableSchema')


class UserSubModel {

  /** @description Save pushed article to pgdb
  * @param {String} table name  
  * @param {object} pgdb
  * @return {array} return all data from table u given
  */
  async getAllUserSubscriptionsByTable(tableName, pgdb) {
    try {

      const subs = await pgdb(tableName).returning('*')
      return subs

    } catch (e) {
      console.log(e.message)
      throw e
    }
  }


  /** @description Save pushed article to pgdb
  * @param {String} user_line_id.
  * @param {String} article_url   
  * @param {object} Knex 
  */
  async savePushedArticleUrlToPGDB(user_line_id, article, pgdb) {
    const { article_url, article_source } = article
    try {

      const insertResult = await pgdb.insert({
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
  * @param {object} Knex
  * @return {Boolean} 回传 true or false 
  */
  async isSubscriptionPushed(user_line_id, article_url, pgdb) {
    try {

      const query = {
        user_line_id,
        article_url
      }
      const subs = await pgdb(USER_PUSHED_TABLE_STRING)
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
      const boards = await pgdb
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
      const keywords = await pgdb
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


module.exports = new UserSubModel()