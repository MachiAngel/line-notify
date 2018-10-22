const EventEmitter = require('events').EventEmitter;

const schedule = require('node-schedule')

const EynyCrawler = require('../crawlers/EynyCrawler.js')
const eynyCrawler = new EynyCrawler()

const PttCrawler = require('../crawlers/PttCrawler')
const pttCrawler = new PttCrawler()

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

    this.on

  }

    

  startEynyCrawler() {

    this.eynyJob = schedule.scheduleJob(this.intervalTime, async () => {
      //爬到的資料送出
      try {
        const results = await eynyCrawler.crawlEynyMovieArticles()

        this.emit('notify', { type: EynyCrawler.TYPE_MOIVE_STRING(), results })
      } catch (e) {
        const type = EynyCrawler.TYPE_MOIVE_STRING()
        console.log(`crawler failed :${type}`)
        console.log(e.message)
      }  

      try {
        const results = await eynyCrawler.crawlEynyBTMovieArticles()
        this.emit('notify', { type: EynyCrawler.TYPE_BT_MOIVE_STRING(), results })
      } catch (e) {
        const type = EynyCrawler.TYPE_BT_MOIVE_STRING()
        console.log(`crawler failed :${type}`)
        console.log(e.message)
      } 

      try {
        const results = await eynyCrawler.crawlEynyVedioArticles('海賊王',1)
        this.emit('notify', { type: EynyCrawler.TYPE_VIDEO_STRING(), results })
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
        this.emit('notify', { type: PttCrawler.TYPE_PTT_STRING(), results })
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
        this.emit('notify', { type: PttCrawler.TYPE_PTT_HOTBOARD_STRING(), results })
      } catch (e) {
        console.log('crawler ptt hot board fail:')
        console.log(e.message)
      }

    })
  }

}






// const crawlerScript = new CrawlerScript()
// module.exports = crawlerScript 

