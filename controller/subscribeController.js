
const userSubModel = require('../model/UserSubModel')

const getAllSubscriptions = (req, res) => {

  console.log(req.body)

  res.json({cc:123})

}

module.exports = {
  getAllSubscriptions
}