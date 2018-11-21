const EventEmitter = require('events').EventEmitter;

const schedule = require('node-schedule')

const EynyCrawler = require('../crawlers/EynyCrawler.js')
const eynyCrawler = new EynyCrawler()

const PttCrawler = require('../crawlers/PttCrawler')
const pttCrawler = new PttCrawler()

const constant = require('../constants/constants')

const eynyModel = require('../model/EynyModel')
const pttModel = require('../model/PttModel')


const saveActions = new Map([
  [constant.EYNY_SOURCE_MOIVE, eynyModel.saveEynyMovieArticleToPGDB],
  [constant.EYNY_SOURCE_MOIVE_BT, eynyModel.saveEynyBTMovieArticleToPGDB],
  [constant.EYNY_SOURCE_VIDEO, eynyModel.saveEynyVideoArticleToPGDB],
  [constant.PTT_SOURCE, pttModel.savePttArticleToPGDB]
])

//每20秒
// schedule.scheduleJob('*/20 * * * * *', updateMonster)

module.exports = class CrawlerScript extends EventEmitter{

  constructor(pgdb) {
    super()
    this.intervalTime = '*/30 * * * * *'
    this.intervalTime2 = '*/50 * * * * *'
    this.intervalTime3 = '*/20 * * * * *'

    this.eynyJob = undefined
    this.pttJob = undefined
    this.pttHotBoardJob = undefined

    this.pgdb = pgdb

  }
    
  startEynyCrawler() {

    this.eynyJob = schedule.scheduleJob(this.intervalTime, async () => {
      //爬到的資料送出
      try {
        const results = await eynyCrawler.crawlEynyMovieArticles()

        await this.saveArticlesToPgdb({ type: EynyCrawler.TYPE_MOIVE_STRING(), results },this.pgdb)

        // this.emit('notify', { type: EynyCrawler.TYPE_MOIVE_STRING(), results })
      } catch (e) {
        console.log(e.message)
      }  

      try {
        const results = await eynyCrawler.crawlEynyBTMovieArticles()

        await this.saveArticlesToPgdb({ type: EynyCrawler.TYPE_BT_MOIVE_STRING(), results }, this.pgdb)

        // this.emit('notify', { type: EynyCrawler.TYPE_BT_MOIVE_STRING(), results })
      } catch (e) {
        
        console.log(e.message)
      } 

      try {
        const results = await eynyCrawler.crawlEynyVedioArticles('海賊王',1)

        await this.saveArticlesToPgdb({ type: EynyCrawler.TYPE_VIDEO_STRING(), results }, this.pgdb)

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
        const results = await pttCrawler.getPttArticles('baseball', 2)

        
        await this.saveArticlesToPgdb({ type: PttCrawler.TYPE_PTT_STRING(), results }, this.pgdb)

        // this.emit('notify', { type: PttCrawler.TYPE_PTT_STRING(), results })
      } catch (e) {
        console.log(e.message)
      }

    })
  }

  startPttHotBoardCrawler() {

    this.pttHotBoardJob = schedule.scheduleJob(this.intervalTime3, async () => {
      //爬到的資料送出

      //TODO: 需要補上需要的版..從user subscription table get Set 
      try {
        const results = await pttCrawler.getHotBoards()
        await this.saveArticlesToPgdb({ type: PttCrawler.TYPE_PTT_HOTBOARD_STRING(), results }, this.pgdb)

        // this.emit('notify', { type: PttCrawler.TYPE_PTT_HOTBOARD_STRING(), results })
      } catch (e) {
        console.log('crawler ptt hot board fail:')
        console.log(e.message)
      }

    })
  }


  async saveArticlesToPgdb({ type, results }, pgdb) {

    const action = saveActions.get(type)
    if(!action){
      console.log(`crawler type: ${type} can not find action`)
      return
    }

    for (let article of results) {
      try {
        await action(article, pgdb)
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}






// const crawlerScript = new CrawlerScript()
// module.exports = crawlerScript 






















// async saveArticlesToPgdb({ type, results }, pgdb) {


  //   switch (type) {
  //     case constant.EYNY_SOURCE_MOIVE:

  //       for (let article of results) {
  //         try {
  //           await eynyModel.saveEynyMovieArticleToPGDB(article, pgdb)
  //         } catch (e) {
  //           console.log('saveEynyMovieArticleToPGDB fail:')
  //           console.log(article)
  //           console.log(e.message)
  //         }
  //       }
  //       break

  //     case constant.EYNY_SOURCE_MOIVE_BT:

  //       for (let article of results) {
  //         try {
  //           await eynyModel.saveEynyBTMovieArticleToPGDB(article, pgdb)
  //         } catch (e) {
  //           console.log('saveEynyBTMovieArticleToPGDB fail:')
  //           console.log(e.message)
  //         }
  //       }

  //       break
  //     case constant.EYNY_SOURCE_VIDEO:

  //       for (let article of results) {
  //         // console.log(article)
  //         try {
  //           await eynyModel.saveEynyVideoArticleToPGDB(article, pgdb)
  //         } catch (e) {
  //           console.log('saveEynyVideoArticleToPGDB fail')
  //           console.log(e.message)
  //         }
  //       }

  //       break
  //     case constant.PTT_SOURCE:

  //       for (let article of results) {
  //         try {
  //           await pttModel.savePttArticleToPGDB(article, pgdb)
  //         } catch (e) {
  //           console.log('savePttArticleToPGDB fail:')
  //           console.log(e.message)
  //         }
  //       }
  //       break

  //     case constant.PTT_SOURCE_HOTBOARD:

  //       try {
  //         const savedResult = await pttModel.savePttHotBoardsToPGDB(results, pgdb)

  //         if (savedResult) {
  //           console.log('PTT_SOURCE_HOTBOARD save to pgdb success')
  //         }else {
  //           console.log('PTT_SOURCE_HOTBOARD save to pgdb fail')
  //         }



  //       } catch (e) {
  //         console.log('savePttHotBoardsToPGDB fail:')
  //         console.log(e.message)
  //       }

  //       break

  //     default:
  //       break
  //   }

  // }

