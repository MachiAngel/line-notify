require('dotenv').config()

const express = require('express');
const session = require("express-session");
const line_login = require("line-login");
const bodyParser = require('body-parser');
const path = require('path');

const bot = require('./bots/linebot')


const subscribeRouter = require('./routers/subscribeRouter.js')

const port = process.env.PORT || 30001
const app = express();

const session_options = {
  secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
  resave: false,
  saveUninitialized: false
}

const login = new line_login({
  channel_id: process.env.LINE_LOGIN_CHANNEL_ID,
  channel_secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
  callback_url: process.env.LINE_LOGIN_CALLBACK_URL,
  scope: "openid profile",
  prompt: "consent",
  bot_prompt: "aggressive"
});


// //db 
// const pgdb = require('./db/pgdb.js')

// //script
// const crawlerScript = new CrawlerScript()
// const notify = new Notify(pgdb)


//驗證
const parser = bodyParser.json({
  verify: function (req, res, buf, encoding) {
    req.rawBody = buf.toString(encoding);
  }
});

app.use(session(session_options));


//line bot
app.post('/linewebhook', parser, function (req, res) {
  if (!bot.verify(req.rawBody, req.get('X-Line-Signature'))) {
    return res.sendStatus(400);
  }
  bot.parse(req.body);
  return res.json({});
});


//line login
app.use("/auth", login.auth())

app.use("/callback", login.callback(
  (req, res, next, token_response) => {
    // Success callback
    console.log('token_response')
    console.log(token_response)
    //應該要回傳登入的react page
    res.json(token_response);
    
  },
  (req, res, next, error) => {
    // Failure callback
    res.status(400).json(error);
  }
));




app.use(bodyParser.json());
app.use('/api/v1', subscribeRouter)





app.listen(port, function () {
  console.log(`LineBot is running at ${port} ...`);
  console.log(`process.env.NODE_ENV is ${process.env.NODE_ENV}`)
});