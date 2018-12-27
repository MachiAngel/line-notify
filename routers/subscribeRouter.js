const express = require('express')
const Router = express.Router()
const subController = require('../controller/subscribeController.js')


Router.post('/subscriptions/ptt', async (req, res) => { subController.handleAddPttSub(req, res) })
Router.delete('/subscriptions/ptt', async (req, res) => { subController.handleDeletePttSub(req, res) })

Router.get('/subscriptions/:user_line_id', async (req, res) => { subController.handleGetAllSubs(req, res) })

module.exports = Router