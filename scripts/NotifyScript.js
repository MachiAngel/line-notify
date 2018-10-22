
const schedule = require('node-schedule')
const _ = require('lodash') 


const {
  EYNY_SOURCE_VIDEO,
  EYNY_SOURCE_MOIVE,
  EYNY_SOURCE_MOIVE_BT,
  PTT_SOURCE
} = require('../constants/constants')

const { SUBSCRIBE_EYNY_MOVIE_TABLE_STRING,
  SUBSCRIBE_EYNY_VIDEO_TABLE_STRING,
  SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING
} = require('../constants/tableSchema')

const {
  EYNY_BT_MOVIE_TABLE_STRING,
  EYNY_MOVIE_TABLE_STRING,
  EYNY_VIDEO_TABLE_STRING,
  PTT_TABLE_STRING
} = require('../constants/tableSchema')

const eynyModel = require('../model/EynyModel')
const pushModel = require('../model/PushModel')
const userSubModel = require('../model/UserSubModel')

// const pgdb = require('../db/pgdb')



module.exports = class Notify  {

  constructor(pgdb) {
    this.intervalTime = '*/30 * * * * *'
    this.notifyJob_eyny_movie = undefined 
    this.notifyJob_eyny_bt_movie = undefined
    this.notifyJob_eyny_video = undefined
    this.pgdb = pgdb 

  }


  start() {
    this.notifyJob_eyny_movie = schedule.scheduleJob(this.intervalTime, async () => {
      //爬到的資料送出
      try {
        console.time('eyny movie notify start')
        await doAllEynyMovieNotify()
        console.timeEnd('eyny movie notify end')
      } catch (e) {
        console.log(e.message)
      }
    })

    this.notifyJob_eyny_bt_movie = schedule.scheduleJob(this.intervalTime, async () => {
      //爬到的資料送出
      try {
        console.time('eyny bt movie notify')
        await doAllEynyBtMovieNotify()
        console.timeEnd('eyny bt movie notify')
      } catch (e) {
        console.log(e.message)
      }
    })

  }

}


const doAllEynyMovieNotify = async () => {
  try {
    //拿出一種類型的訂閱
    const userEynyMovieSubs = await userSubModel.getUserSubscriptionsByTable(SUBSCRIBE_EYNY_MOVIE_TABLE_STRING, this.pgdb)
    
    //拿出該類型爬到的資料
    const eynyMovies = await eynyModel.getEynyArticlesFrom(EYNY_MOVIE_TABLE_STRING, this.pgdb)
    // console.log(eynyMovies)

    const promises = []  
    for (let subscription of userEynyMovieSubs) {
      for (let article of eynyMovies) {
        const promise = handleEynyNotifyPromise(subscription, article)
        promises.push(promise)
      }
    }    
    console.log(`eyny movie promise長度 :${promises.length}`)
    await Promise.all(promises)
  
  } catch (e) {
    console.log(e.message)
  }

}


const doAllEynyBtMovieNotify = async () => {
  try {
    //拿出BT類型的訂閱
    const userEynyMovieSubs = await userSubModel.getAllUserSubscriptionsByTable(SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING, this.pgdb)

    //拿出該類型爬到的資料
    const eynyMovies = await eynyModel.getEynyArticlesFrom(EYNY_BT_MOVIE_TABLE_STRING, this.pgdb)
    // console.log(eynyMovies)


    //蒐集所有要執行的promise ~
    const promises = []
    for (let subscription of userEynyMovieSubs) {
      for (let article of eynyMovies) {

        //檢查是否要加入此promise
        const promise = handleEynyNotifyPromise(subscription, article)
        promises.push(promise)
      }
    }
    console.log(`eyny bt movies promise長度 :${promises.length}`)
    await Promise.all(promises)

  } catch (e) {
    console.log(e.message)
  }

}



const handleEynyNotifyPromise = async (subscription, article) => {
  const {sub_type} = subscription
  try {
    
    //檢查是否該推
    const shouldPush = await generateShouldPushFunction(sub_type)(subscription, article)
    if (!shouldPush) { return `${article.title} shouldn't push to${subscription.user_line_id}`}

    const line_pushed_result = await pushModel.push(subscription, article)
    //成功line會回傳空物件
    const isResultEmpty = _.isEmpty(line_pushed_result)
    if (!isResultEmpty) { return JSON.stringify(pushedResult)}

    await userSubModel.savePushedArticleUrlToPGDB(subscription.user_line_id, article, this.pgdb) 

    return `${article.title} push to ${subscription.user_line_id} success`

  } catch (e) {
    return e.message
  }
}



 /** @description Get a Funtion which determine subscription should push or not
  * @param { string } string subscription
  * @return {function} should push fuction 
  */
const generateShouldPushFunction = (sub_type) => {
  switch (sub_type) {
    case EYNY_SOURCE_VIDEO:
      return ''
    case EYNY_SOURCE_MOIVE:
      return isEynyMovieArticleShouldPush
    case EYNY_SOURCE_MOIVE_BT:
      return isEynyBTMovieArticleShouldPush
    case PTT_SOURCE:
      return ''
    default:
      return ''
  }
}


const isEynyMovieArticleShouldPush = async (sub,article) => {

  //一定要有 
  const { title, author, views, article_time, article_url, pre_image_url, article_source, movie_category, movie_source } = article
  const { user_line_id, sub_movie_title, sub_movie_views, sub_movie_category} = sub
  try {
    //規則符合 目前只看電影分類
    if (sub_movie_category !== '所有' && sub_movie_category !== movie_category) {
      return false 
    }

    //有無推過
    const havePushed = await userSubModel.isSubscriptionPushed(user_line_id, article_url, this.pgdb)
    return havePushed ? false : true

  } catch (e) {
    console.log(e.message)
    return false 
  }

}


const isEynyBTMovieArticleShouldPush = async (sub, article) => {

  //一定要有 
  const { title, author, views, article_time, article_url, article_source, movie_quality } = article
  const { user_line_id, sub_bt_movie_title, sub_bt_movie_views, sub_bt_movie_quality } = sub

  try {
    //規則符合 目前只看電影 畫質
    if (sub_bt_movie_quality !== '所有' && sub_bt_movie_quality !== movie_quality) {
      return false
    }

    //有無推過
    const havePushed = await userSubModel.isSubscriptionPushed(user_line_id, article_url, this.pgdb)
    return havePushed ? false : true

  } catch (e) {
    console.log(e.message)
    return false
  }

}