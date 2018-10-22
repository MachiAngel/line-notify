

const {EYNY_MOVIE_TABLE_STRING,
  EYNY_BT_MOVIE_TABLE_STRING,
  EYNY_VIDEO_TABLE_STRING
} = require('../constants/tableSchema')


class EynyModel {

  /** @description Get Eyny articles from pgdb
  * @param {object} Knex
  * @return {array} return eyny movie articles
  */
  async getEynyArticlesFrom(tableName,pgdb) {
    try {

      const articles = await pgdb(tableName).returning('*')
      return articles
    } catch (e) {
      
      console.log(e.message)
      throw e
    }
  }


  /** @description Save Eyny movie articles to pgdb
  * @param {object} Article
  * @param {object} Knex
  */
  async saveEynyMovieArticleToPGDB(article, pgdb) {
    const { title, author, views, pre_image_url, article_time, article_url, article_source, movie_source, movie_category } = article

    try {
      const isHavingArticle = await pgdb(EYNY_MOVIE_TABLE_STRING).where('article_url', '=', article.article_url).returning('*')
      if (isHavingArticle.length) {
        //更新
        const updateResult = await pgdb(EYNY_MOVIE_TABLE_STRING)
          .update({ views, updated_at: new Date() })
          .where('article_url', '=', isHavingArticle[0].article_url)
          .returning('*')

        if (!updateResult.length) {
          throw new Error(`update article ${isHavingArticle[0].title} fail`)
        }

        return `title:${updateResult[0].title} 更新成功 `
      } else {
        //insert
        const insertResults = await pgdb.insert({
          title,
          author,
          views,
          article_source,
          pre_image_url,
          article_url,
          article_time,
          movie_source,
          movie_category
        })
          .into(EYNY_MOVIE_TABLE_STRING)
          .returning('*')

        return `title:${insertResults[0].title} 新增成功 `
      }
    } catch (e) {
      
      throw e
    }

  }

  /** @description Save Eyny bt movie articles to pgdb
  * @param {object} Article
  * @param {object} Knex
  */
  async saveEynyBTMovieArticleToPGDB(article, pgdb) {
    const { title, author, views, article_time, article_url, pre_image_url, article_source, movie_quality } = article

    try {
      const isHavingArticle = await pgdb(EYNY_BT_MOVIE_TABLE_STRING).where('article_url', '=', article.article_url).returning('*')
      if (isHavingArticle.length) {
        //更新
        const updateResult = await pgdb(EYNY_BT_MOVIE_TABLE_STRING)
          .update({ views, updated_at: new Date() })
          .where('article_url', '=', isHavingArticle[0].article_url)
          .returning('*')

        if (!updateResult.length) {
          throw new Error(`update article ${isHavingArticle[0].title} fail`)
        }

        return `title:${updateResult[0].title} 更新成功 `
      } else {
        //insert
        const insertResults = await pgdb.insert({
          title,
          author,
          views,
          article_source,
          pre_image_url,
          article_url,
          article_time,
          movie_quality
        })
          .into(EYNY_BT_MOVIE_TABLE_STRING)
          .returning('*')

        return `title:${insertResults[0].title} 新增成功 `
      }
    } catch (e) {
      console.log(e.message)
      throw e
    }

  }

  /** @description Save Eyny video articles to pgdb
  * @param {object} Article
  * @param {object} Knex
  */
  async saveEynyVideoArticleToPGDB(article, pgdb) {
    const { title, author, views, article_time, article_url, article_source, membership, movie_quality, keyword } = article
    
    try {
      const isHavingArticle = await pgdb(EYNY_VIDEO_TABLE_STRING)
        .where({
          article_url: article.article_url,
          keyword
        })
        .returning('*')
      
      if (isHavingArticle.length ) {
        //更新
        const updateResult = await pgdb(EYNY_VIDEO_TABLE_STRING)
          .update({ views, article_time, updated_at: new Date() })
          .where('article_url', '=', isHavingArticle[0].article_url)
          .returning('*')

        if (!updateResult.length) {
          throw new Error(`update article ${isHavingArticle[0].title} fail`)
        }

        return `title:${updateResult[0].title} 更新成功 `
      } else {
        
        const insertResults = await pgdb.insert({
          title,
          author,
          views,
          article_source,
          article_url,
          article_time,
          movie_quality,
          membership,
          keyword
        })
          .into(EYNY_VIDEO_TABLE_STRING)
          .returning('*')

        return `title:${insertResults[0].title} 新增成功 `
      }
    } catch (e) {
      console.log(e.message)
      throw e
    }

  }
}


module.exports = new EynyModel()
