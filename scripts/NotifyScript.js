
const schedule = require('node-schedule')
const _ = require('lodash') 
const pgdb = require('../db/pgdb')

const {
  EYNY_SOURCE_VIDEO,
  EYNY_SOURCE_MOIVE,
  EYNY_SOURCE_MOIVE_BT,
  PTT_SOURCE
} = require('../constants/constants')

const { SUBSCRIBE_EYNY_MOVIE_TABLE_STRING,
  SUBSCRIBE_EYNY_VIDEO_TABLE_STRING,
  SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING,
  SUBSCRIBE_PTT_TABLE_STRING
} = require('../constants/tableSchema')

const {
  EYNY_BT_MOVIE_TABLE_STRING,
  EYNY_MOVIE_TABLE_STRING,
  EYNY_VIDEO_TABLE_STRING,
  PTT_TABLE_STRING
} = require('../constants/tableSchema')

const eynyModel = require('../model/EynyModel')
const pushModel = require('../model/PushModel')

const UserSubModel = require('../model/UserSubModel')
const userSubModel = new UserSubModel({ db:pgdb })

const PttModel = require('../model/PttModel')
const pttModel = new PttModel({ db: pgdb })



module.exports = class Notify  {

  constructor() {
    this.intervalTime = '*/1 * * * *'
    this.notifyJob_eyny_movie = undefined 
    this.notifyJob_eyny_bt_movie = undefined
    this.notifyJob_eyny_video = undefined
    this.notifyJob_ptt = undefined
  }


  start() {

    this.notifyJob_ptt = schedule.scheduleJob(this.intervalTime, async () => {
      //爬到的資料送出
      
      try {
        const startTime = Date.now()  
        await doAllPttNotify()
        const endTime = Date.now()
        console.log(`ptt notify 耗時: ${(endTime - startTime) / 1000} s`)
      } catch (e) {
        console.log(e.message)
      }
    })

    this.notifyJob_eyny_movie = schedule.scheduleJob(this.intervalTime, async () => {
      //爬到的資料送出
      try {
        
        // await doAllEynyMovieNotify()
        
      } catch (e) {
        console.log(e.message)
      }
    })

    this.notifyJob_eyny_bt_movie = schedule.scheduleJob(this.intervalTime, async () => {
      //爬到的資料送出
      try {
        
        // await doAllEynyBtMovieNotify()
        
      } catch (e) {
        console.log(e.message)
      }
    })

  }

}

const doAllPttNotify = async () => {

  try {
    //拿出PTT所有的訂閱
    const allSubs = await userSubModel.getSubsByTable(SUBSCRIBE_PTT_TABLE_STRING)
    //整理成每個User 
    //[ { user_line_id: 'U20c2fb6275968599930d9c307b5fe9d6',
    //subs: [[Object], [Object], [Object], [Object]] ] 
    const userSubArray = _.chain(allSubs)
      .groupBy('user_line_id')
      .toPairs()
      .map((currentItem) => {
        return _.zipObject(['user_line_id', 'subs'], currentItem)
      })
      .value()

    //拿出爬到的Ptt所有文章
    //TODO 不管哪個版 都必須限制時間 1000篇 縮成 各種10篇 or 各種一天內
    const pttArticles = await pttModel.getAllArticles()
    
    //by每個user去跑
    for (let subObj of userSubArray) {
      const promises = []
      const { user_line_id, subs } = subObj
      //user_line_id 拿到此推過的id 的所有文章

      const pushed_urls = await userSubModel.getLastTwoDayPushedArticleByUser(user_line_id)
      const pttYetPushedArticles = pttArticles.filter(article => {
        return !pushed_urls.includes(article.article_url)
      })

      for (let subscription of subs) {
        const filteredArticles = getPttEligibleArticles(subscription, pttYetPushedArticles)

        for (let article of filteredArticles) {
          const promise = handlePttNotifyPromise(subscription, article)
          promises.push(promise)
        }
      }
      console.log(`userId:${user_line_id} promise長度 :${promises.length}`)
      await Promise.all(promises)
    }
    
    
  } catch (e) {
    console.log(e)
    throw e 
  }

  
}


// const doAllPttNotify = async () => {

//   try {
//     //拿出PTT所有的訂閱
//     const userPttSubs = await userSubModel.getSubsByTable(SUBSCRIBE_PTT_TABLE_STRING)

//     //拿出爬到的Ptt所有文章
//     //TODO 不管哪個版 都必須限制時間
//     const pttArticles = await pttModel.getAllArticles()

//     const promises = []
//     for (let subscription of userPttSubs) {

//       const filteredArticles = getPttEligibleArticles(subscription, pttArticles)

//       for (let article of filteredArticles) {
//         const promise = handlePttNotifyPromise(subscription, article)
//         promises.push(promise)
//       }
//     }
//     console.log(`ptt promise長度 :${promises.length}`)
//     await Promise.all(promises)
//   } catch (e) {
//     console.log(e)
//     throw e
//   }


// }


const doAllEynyMovieNotify = async () => {
  try {
    //拿出一種類型的訂閱
    const userEynyMovieSubs = await userSubModel.getUserSubscriptionsByTable(SUBSCRIBE_EYNY_MOVIE_TABLE_STRING)
    
    //拿出該類型爬到的資料
    const eynyMovies = await eynyModel.getEynyArticlesFrom(EYNY_MOVIE_TABLE_STRING)
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
    const userEynyMovieSubs = await userSubModel.getAllUserSubscriptionsByTable(SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING)

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


const handlePttNotifyPromise = async (subscription, article) => {
  
  try {
    const line_pushed_result = await pushModel.push(subscription, article)
    //成功line會回傳空物件
    const isResultEmpty = _.isEmpty(line_pushed_result)
    if (!isResultEmpty) { return JSON.stringify(pushedResult) }

    await userSubModel.savePushedArticleUrlToPGDB(subscription.user_line_id, article)
    return `${article.title} push to ${subscription.user_line_id} success`

  } catch (e) {
    throw e 
  }
}


// const handlePttNotifyPromise = async (subscription, article) => {
//   const { sub_type } = subscription
//   try {

//     //檢查是否該推
//     const shouldPush = await generateShouldPushFunction(sub_type)(subscription, article)
//     if (!shouldPush) { return `${article.title} shouldn't push to${subscription.user_line_id}` }

//     const line_pushed_result = await pushModel.push(subscription, article)
//     //成功line會回傳空物件
//     const isResultEmpty = _.isEmpty(line_pushed_result)
//     if (!isResultEmpty) { return JSON.stringify(pushedResult) }

//     await userSubModel.savePushedArticleUrlToPGDB(subscription.user_line_id, article)
//     return `${article.title} push to ${subscription.user_line_id} success`

//   } catch (e) {
//     return e.message
//   }
// }



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
      return isPttArticleShouldPush
    default:
      return ''
  }
}


const getPttEligibleArticles = (sub, articles) => {
  const { title: subTitle, board: subBoard, category: subCategory, rate: subRate, author: subAuthor } = sub
  const eligibleArticles = articles.filter(article => {

    const { title, board, author, category, rate } = article
    //版名符合 
    const boardMatch = board.toLowerCase() === subBoard.toLowerCase() ? true : false
    //要沒有subscription title 就算符合 直接是 true , 有title 就跟訂閱檢查
    const titleMatch = subTitle ? title.includes(subTitle) : true
    //副標題要一樣才推
    const categoryMatch = subCategory ? category === subCategory : true
    //作者一樣才推
    const authorMatch = subAuthor ? author === subAuthor : true
    //只有文章推文數比 條件大才推
    const rateMatch = rate >= subRate
    return boardMatch && titleMatch && categoryMatch && authorMatch && rateMatch
  })

  return eligibleArticles
  
}

//檢查是否應該推此PTT文章
const isPttArticleShouldPush = async (sub, article) => {

  //一定要有 
  const { article_url } = article
  const { user_line_id } = sub
  
  try {
    const havePushed = await userSubModel.isSubscriptionPushed(user_line_id, article_url)
    return havePushed ? false : true

  } catch (e) {
    console.log(e.message)
    throw e 
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