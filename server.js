require('dotenv').config()


if (process.env.NODE_ENV !== 'production') {
  require('./worker.js')
  console.log('require worker')
}


const express = require('express');

const bodyParser = require('body-parser');
const bot = require('./bots/linebot')

const subscribeRouter = require('./routers/subscribeRouter.js')

const port = process.env.PORT || 30001
const app = express();





//驗證
const parser = bodyParser.json({
  verify: function (req, res, buf, encoding) {
    req.rawBody = buf.toString(encoding);
  }
});




//line bot
app.post('/linewebhook', parser, function (req, res) {
  if (!bot.verify(req.rawBody, req.get('X-Line-Signature'))) {
    return res.sendStatus(400);
  }
  bot.parse(req.body);
  return res.json({});
});



app.use(bodyParser.json());
app.use('/api/v1', subscribeRouter)





app.listen(port, function () {
  console.log(`LineBot is running at ${port} ...`);
  console.log(`process.env.NODE_ENV is ${process.env.NODE_ENV}`)
});