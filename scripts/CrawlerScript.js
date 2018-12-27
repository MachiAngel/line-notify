const EventEmitter = require('events').EventEmitter;

const schedule = require('node-schedule')

const EynyCrawler = require('../crawlers/EynyCrawler.js')
const eynyCrawler = new EynyCrawler()

const PttCrawler = require('../crawlers/PttCrawler')
const pttCrawler = new PttCrawler()

const constant = require('../constants/constants')

const pgdb = require('../db/pgdb.js')

const EynyModel = require('../model/EynyModel')
const eynyModel = new EynyModel({ db: pgdb })

const PttModel = require('../model/PttModel')
const pttModel = new PttModel({ db: pgdb })




// const saveActions = new Map([
//   [constant.EYNY_SOURCE_MOIVE, eynyModel.saveEynyMovieArticleToPGDB],
//   [constant.EYNY_SOURCE_MOIVE_BT, eynyModel.saveEynyBTMovieArticleToPGDB],
//   [constant.EYNY_SOURCE_VIDEO, eynyModel.saveEynyVideoArticleToPGDB],
//   [constant.PTT_SOURCE, pttModel.savePttArticleToPGDB],
//   [constant.PTT_SOURCE_HOTBOARD, pttModel.savePttHotBoardsToPGDB]
// ])

const saveActions = (type) => {
  switch (type) {
    case constant.EYNY_SOURCE_MOIVE:
      return eynyModel.saveEynyMovieArticleToPGDB
    case constant.EYNY_SOURCE_MOIVE_BT:
      return eynyModel.saveEynyBTMovieArticleToPGDB
    case constant.EYNY_SOURCE_VIDEO:
      return eynyModel.saveEynyVideoArticleToPGDB
    case constant.PTT_SOURCE:
      return pttModel.savePttArticleToPGDB
    case constant.PTT_SOURCE_HOTBOARD:
      return pttModel.savePttHotBoardsToPGDB
    default :
      throw new Error('no function map')
  }
}

//每20秒
// schedule.scheduleJob('*/20 * * * * *', updateMonster)

module.exports = class CrawlerScript extends EventEmitter{

  constructor() {
    super()
    this.intervalTime = '*/30 * * * * *'
    this.intervalTime2 = '*/50 * * * * *'
    this.intervalTime3 = '*/20 * * * * *'

    this.eynyJob = undefined
    this.pttJob = undefined
    this.pttHotBoardJob = undefined
  }
    
  startEynyCrawler() {

    this.eynyJob = schedule.scheduleJob(this.intervalTime, async () => {
      //爬到的資料送出
      try {
        const results = await eynyCrawler.crawlEynyMovieArticles()

        await this.saveArticlesToPgdb({ type: EynyCrawler.TYPE_MOIVE_STRING(), results })

        // this.emit('notify', { type: EynyCrawler.TYPE_MOIVE_STRING(), results })
      } catch (e) {
        console.log(e.message)
      }  

      try {
        const results = await eynyCrawler.crawlEynyBTMovieArticles()

        await this.saveArticlesToPgdb({ type: EynyCrawler.TYPE_BT_MOIVE_STRING(), results })

        // this.emit('notify', { type: EynyCrawler.TYPE_BT_MOIVE_STRING(), results })
      } catch (e) {
        
        console.log(e.message)
      } 

      try {
        const results = await eynyCrawler.crawlEynyVedioArticles('海賊王',1)

        await this.saveArticlesToPgdb({ type: EynyCrawler.TYPE_VIDEO_STRING(), results })

        // this.emit('notify', { type: EynyCrawler.TYPE_VIDEO_STRING(), results })
      } catch (e) {
        const type = EynyCrawler.TYPE_VIDEO_STRING()
        console.log(`crawler failed :${type}`)
        console.log(e.message)
      } 

    })

  }

  startPttCrawler() {
    this.pttJob = schedule.scheduleJob(this.intervalTime2, async () => {
      //爬到的資料送出

      //TODO: 需要補上需要的版..從user subscription table get Set
      try {
        const boards = await pttModel.getAllUserSubBoard()
        if (!boards.length) {return}

        for (let boardName of boards) {
          try {
            const results = await pttCrawler.getPttArticles(boardName, 2)
            await this.saveArticlesToPgdb({ type: PttCrawler.TYPE_PTT_STRING(), results })
          } catch (e) {
            console.log(e.message)
          }
        }
        
      } catch (e) {
        console.log(e.message)
      }

    })
  }

  startPttHotBoardCrawler() {

    this.pttHotBoardJob = schedule.scheduleJob(this.intervalTime3, async () => {
      //爬到的資料送出

      
      try {
        const results = await pttCrawler.getHotBoards()

        
        await this.saveArticlesToPgdb({ type: PttCrawler.TYPE_PTT_HOTBOARD_STRING(), results })

        // this.emit('notify', { type: PttCrawler.TYPE_PTT_HOTBOARD_STRING(), results })
      } catch (e) {
        console.log('crawler ptt hot board fail:')
        console.log(e.message)
      }

    })
  }


  async saveArticlesToPgdb({ type, results }) {

    switch (type) {
      case constant.EYNY_SOURCE_MOIVE:
        for (let article of results) {
          try {
            await eynyModel.saveEynyMovieArticleToPGDB(article)
          } catch (e) {
            console.log(e)
          }
        }
        return
      case constant.EYNY_SOURCE_MOIVE_BT:
        for (let article of results) {
          try {
            await eynyModel.saveEynyBTMovieArticleToPGDB(article)
          } catch (e) {
            console.log(e)
          }
        }
        return
      case constant.EYNY_SOURCE_VIDEO:
        for (let article of results) {
          try {
            await eynyModel.saveEynyVideoArticleToPGDB(article)
          } catch (e) {
            console.log(e)
          }
        }
        return
      case constant.PTT_SOURCE:
        for (let article of results) {
          try {
            await pttModel.savePttArticleToPGDB(article)
          } catch (e) {
            console.log(e)
          }
        }
        return
      case constant.PTT_SOURCE_HOTBOARD:
        await pttModel.savePttHotBoardsToPGDB(results)

        return
      default:
        console.log(type)
        
    }


    // for (let article of results) {
    //   try {
    //     await action(article)
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }
  }
}


// const crawlerScript = new CrawlerScript()
// module.exports = crawlerScript 


