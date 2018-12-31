
const userSubModel = require('../model/UserSubModel')
const pgdb = require('../db/pgdb.js')


const handleAddPttSub = async (req, res) => {

  const {
    user_line_id,
    title,
    not_title,
    board,
    author,
    category,
    rate
  } = req.body

  if (!user_line_id || !board) {
    return res.status(400).json({success:0, msg: '參數錯誤' })
  }
  try {

    const result = await userSubModel.addPttSubScription({ 
      user_line_id, 
      title, not_title, 
      board: board.toLowerCase(), 
      author, category, rate 
    },pgdb)

    res.json({result, success:1, msg:''})
  } catch (e) {
    res.status(500).json({ success: 0, msg:e.message})
  }
  

}


const handleDeletePttSub = async (req, res) => {

  const {
    user_line_id,
    id
  } = req.body

  if (!user_line_id || !id) {
    return res.status(400).json({ success: 0, msg: '參數錯誤' })
  }
  try {

    const result = await userSubModel.deletePttSubScription({
      user_line_id,
      id
    }, pgdb)

    if (!result) {
      return res.status(400).json({ success: 0, msg: '參數錯誤' })
    }

    res.json({ result: result, success: 1, msg: '' })

  } catch (e) {
    res.status(500).json({ success: 0, msg: e.message })
  }


}

const handleGetAllSubs = async (req,res) => {
  const {user_line_id} = req.params 
  if (!user_line_id) {
    return res.status(400).json({ success: 0, msg: '參數錯誤' })
  }

  const result = await userSubModel.getAllUserSubscriptions(user_line_id, pgdb)

  return res.json({ result, success: 1, msg: '' })
}

module.exports = {
  handleAddPttSub,
  handleDeletePttSub,
  handleGetAllSubs
}