require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');

const bot = require('./bots/linebot')
const CrawlerScript = require('./scripts/CrawlerScript')
const Notify = require('./scripts/NotifyScript')

const port = process.env.PORT || 3050
const app = express();


//constant 
// const constant = require('./constants/constants')
// const table = require('./constants/tableSchema')

//db 
const pgdb = require('./db/pgdb.js')

//script
const crawlerScript = new CrawlerScript(pgdb)
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




crawlerScript.startPttHotBoardCrawler()
// crawlerScript.startPttCrawler()
// crawlerScript.startEynyCrawler()

// crawlerScript.start()
// notify.start()


app.listen(port, function () {
  console.log(`LineBot is running at ${port} ...`);
});