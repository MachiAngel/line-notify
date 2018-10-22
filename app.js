require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');

const bot = require('./bots/linebot')
const CrawlerScript = require('./scripts/CrawlerScript')
const Notify = require('./scripts/NotifyScript')

const port = process.env.PORT || 3050
const app = express();
const eynyModel = require('./model/EynyModel')
const pttModel = require('./model/PttModel')

//constant 
const constant = require('./constants/constants')
const table = require('./constants/tableSchema')

//db 
const pgdb = require('./db/pgdb.js')

//script
const crawlerScript = new CrawlerScript()
const notify = new Notify(pgdb)


//驗證
const parser = bodyParser.json({
  verify: function (req, res, buf, encoding) {
    req.rawBody = buf.toString(encoding);
  }
});

app.post('/linewebhook', parser, function (req, res) {
  if (!bot.verify(req.rawBody, req.get('X-Line-Signature'))) {
    return res.sendStatus(400);
  }
  bot.parse(req.body);
  return res.json({});
});



crawlerScript.on('notify', async ({type,results}) => {
  console.log(`收到通知: ${type}`)

  // const userId = 'U20c2fb6275968599930d9c307b5fe9d6'

  switch (type) {
    case constant.EYNY_SOURCE_MOIVE:

      for (let article of results) {
        try {
          await eynyModel.saveEynyMovieArticleToPGDB(article, pgdb)  
        } catch (e) {
          console.log('saveEynyMovieArticleToPGDB fail:')
          console.log(article)
          console.log(e.message)
        }
      }
      break

    case constant.EYNY_SOURCE_MOIVE_BT:

      for (let article of results) {
        try {
          await eynyModel.saveEynyBTMovieArticleToPGDB(article, pgdb)
        } catch (e) {
          console.log('saveEynyBTMovieArticleToPGDB fail:')
          console.log(e.message)
        }
      }

      break
    case constant.EYNY_SOURCE_VIDEO:
    
      for (let article of results) {
        // console.log(article)
        try {
          await eynyModel.saveEynyVideoArticleToPGDB(article, pgdb)
        } catch (e) {
          console.log('saveEynyVideoArticleToPGDB fail')
          console.log(e.message)
        }
      }

      break
    case constant.PTT_SOURCE:

      for (let article of results) {
        try {
          await pttModel.savePttArticleToPGDB(article, pgdb)
        } catch (e) {
          console.log('savePttArticleToPGDB fail:')
          console.log(e.message)
        }
      }
      break

    case constant.PTT_SOURCE_HOTBOARD:

      try {
        const savedResult = await pttModel.savePttHotBoardsToPGDB(results, pgdb)
        console.log(savedResult)
      } catch (e) {
        console.log('savePttHotBoardsToPGDB fail:')
        console.log(e.message)
      }

      break

    default:
      break
  }

})


crawlerScript.startPttHotBoardCrawler()
crawlerScript.startPttCrawler()
crawlerScript.startEynyCrawler()

// crawlerScript.start()
// notify.start()


app.listen(port, function () {
  console.log(`LineBot is running at ${port} ...`);
});