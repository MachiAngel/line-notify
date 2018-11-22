require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const bot = require('./bots/linebot')
const CrawlerScript = require('./scripts/CrawlerScript')
const Notify = require('./scripts/NotifyScript')

const subscribeRouter = require('./routers/subscribeRouter.js')

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



app.use(bodyParser.json());

app.use('/api/v1', subscribeRouter)





// // Serve the static files from the React app
// app.use(express.static(path.join(__dirname, 'client/build')));

// // An api endpoint that returns a short list of items
// app.get('/api/getList', (req, res) => {
//   var list = ["item1", "item2", "item3"];
//   res.json(list);
//   console.log('Sent list of items');
// });

// // Handles any requests that don't match the ones above
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });




// crawlerScript.startPttHotBoardCrawler()
// crawlerScript.startPttCrawler()
// crawlerScript.startEynyCrawler()

// crawlerScript.start()
// notify.start()


app.listen(port, function () {
  console.log(`LineBot is running at ${port} ...`);
});