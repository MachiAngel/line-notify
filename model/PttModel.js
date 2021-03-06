
const { PTT_TABLE_STRING, SUBSCRIBE_PTT_TABLE_STRING , PTT_HOTBOARD_TABLE_STRING } = require('../constants/tableSchema')
const moment = require('moment')


class PttModel {

  constructor({ db, redis }) {
    this.db = db
    this.redis = redis
  }

  //拿到所有爬蟲的存入的資料
  async getAllArticles(){
    try {
      const articles = await this.db
        .select('*')
        .from(PTT_TABLE_STRING)
        .where('created_at', '>', moment().subtract(1, 'days'))
      return articles

    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  //拿到所有定用的版 給爬蟲用
  async getAllUserSubBoard() {
    try {
      const result = await this.db(SUBSCRIBE_PTT_TABLE_STRING)
        .select('board')
        .groupBy('board')

      // [{ board: 'codejob' },
      // { board: 'movie' },
      //   { board: 'gossiping' }]

      const boards = result.map(row => {
        return row.board
      })
      return boards

    } catch (error) {
      console.log(error.message)
      throw error
    }
  }
  async savePttArticleToPGDB(article) {

    const { title, category, article_source, article_url, article_date, author, rate, board } = article

    try {
      const isHavingArticle = await this.db(PTT_TABLE_STRING).where('article_url', '=', article.article_url).returning('*')
      
      if (isHavingArticle.length) {
        //更新
        const updateResult = await this.db(PTT_TABLE_STRING)
          .update({ rate, updated_at: new Date() })
          .where('article_url', '=', isHavingArticle[0].article_url)
          .returning('*')

        if (!updateResult.length) {
          throw new Error(`update article ${isHavingArticle[0].title} fail`)
        }

        return `title:${updateResult[0].title} 更新成功 `
      } else {
        //insert
        const insertResults = await this.db.insert({
          title,
          author,
          category,
          article_url,
          article_date,
          article_source,
          rate,
          board
        })
          .into(PTT_TABLE_STRING)
          .returning('*')

        return `title:${insertResults[0].title} 新增成功 `
      }
    } catch (e) {
      console.log(e.message)
      throw e
    }

  }
  
   /** @description Remove current ptt hot boards and renew all Ptt hot boards to pgdb from crawler
  * @param {array} hotboards
  * @param {object} Knex
  * @return {boolen} return true or false 
  */
  async savePttHotBoardsToPGDB(hotboards=[]) {

    if (!hotboards.length) {
      console.log('no hotbaords data')
      return 'no hotboards data'
    }

    try {
      //刪除表
      await this.db(PTT_HOTBOARD_TABLE_STRING).delete()

      const promises = hotboards.map(hotboard => {
        // const { board_en_name, board_tw_name, current_user_count, board_category, board_desc } = hotboard
        const promise = this.db.insert(hotboard)
          .into(PTT_HOTBOARD_TABLE_STRING)
          .returning('*')
        return promise
      })

      const results = await Promise.all(promises)
      return results.length === promises.length && hotboards !== 0? true : false 
      
    } catch (e) {
      console.log(e.message)
      throw e
    }

  }
  
}

module.exports = PttModel



