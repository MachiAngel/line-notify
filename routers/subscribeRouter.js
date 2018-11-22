const express = require('express')
const Router = express.Router()
const subController = require('../controller/subscribeController.js')


Router.post('/subscriptions', (req, res) => { subController.getAllSubscriptions(req, res) })
Router.get('/subscriptions/:id', (req, res) => { subController.getAllSubscriptions(req, res) })

module.exports = Router