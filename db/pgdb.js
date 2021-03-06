

const {
  USERS_TABLE_STRING,
  PTT_HOTBOARD_TABLE_STRING,
  //爬蟲table 
  EYNY_BT_MOVIE_TABLE_STRING,
  EYNY_MOVIE_TABLE_STRING,
  EYNY_VIDEO_TABLE_STRING,
  PTT_TABLE_STRING,
  //訂閱table
  SUBSCRIBE_EYNY_MOVIE_TABLE_STRING,
  SUBSCRIBE_EYNY_VIDEO_TABLE_STRING,
  SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING,
  SUBSCRIBE_PTT_TABLE_STRING,
  //推過table
  USER_PUSHED_TABLE_STRING
} = require('../constants/tableSchema')

const {
  USERS_TABLE_SCHEMA,
  EYNY_VIDEO_TABLE_SCHEMA,
  EYNY_MOVIE_TABLE_SCHEMA,
  EYNY_BT_MOVIE_TABLE_SCHEMA,
  PTT_TABLE_SCHEMA,
  SUBSCRIBE_EYNY_BT_MOVIE_TABLE_SCHEMA,
  SUBSCRIBE_EYNY_MOVIE_TABLE_SCHEMA,
  SUBSCRIBE_EYNY_VIDEO_TABLE_SCHEMA,
  SUBSCRIBE_PTT_TABLE_SCHEMA,
  USER_PUSHED_TABLE_SCHEMA,
  PTT_HOTBOARD_TABLE_SCHEMA
} = require('../constants/tableSchema')

const environment = process.env.NODE_ENV || 'development'
const config = require('../knexfile.js')[environment];

const knex = require('knex')

let db;
if (!db) {
  db = knex(config)
}




const createTableIfNotExist = async (tableName,tableSchema) => {
  try {
    const result = await pgdb.schema.hasTable(tableName)

    if (result) {
      const returnString = `${tableName} aready have`
      console.log(returnString)
      return returnString
    }  
    const creatResult = await pgdb.schema.createTable(tableName, tableSchema)
    if (creatResult) {
      const returnString = `${tableName} createTable success`
      console.log(returnString)
      return returnString
    }
  } catch (e) {
    return e.message
  }
}


const run = async () => {


  //使用者表
  await createTableIfNotExist(USERS_TABLE_STRING, USERS_TABLE_SCHEMA)

  //爬蟲依例電影表
  await createTableIfNotExist(EYNY_MOVIE_TABLE_STRING, EYNY_MOVIE_TABLE_SCHEMA)
  //爬蟲依例BT電影表
  await createTableIfNotExist(EYNY_BT_MOVIE_TABLE_STRING, EYNY_BT_MOVIE_TABLE_SCHEMA)
  //爬蟲伊莉影片區表
  await createTableIfNotExist(EYNY_VIDEO_TABLE_STRING, EYNY_VIDEO_TABLE_SCHEMA)
  //使用者訂閱依例電影表
  await createTableIfNotExist(SUBSCRIBE_EYNY_MOVIE_TABLE_STRING, SUBSCRIBE_EYNY_MOVIE_TABLE_SCHEMA)
  //使用者訂閱依例BT電影表
  await createTableIfNotExist(SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING, SUBSCRIBE_EYNY_BT_MOVIE_TABLE_SCHEMA)
  //使用者訂閱依例影片區表
  await createTableIfNotExist(SUBSCRIBE_EYNY_VIDEO_TABLE_STRING, SUBSCRIBE_EYNY_VIDEO_TABLE_SCHEMA)

  //PTT
  await createTableIfNotExist(PTT_TABLE_STRING, PTT_TABLE_SCHEMA)
  await createTableIfNotExist(SUBSCRIBE_PTT_TABLE_STRING, SUBSCRIBE_PTT_TABLE_SCHEMA)
  await createTableIfNotExist(PTT_HOTBOARD_TABLE_STRING, PTT_HOTBOARD_TABLE_SCHEMA)

  //推過給user的記錄表
  await createTableIfNotExist(USER_PUSHED_TABLE_STRING, USER_PUSHED_TABLE_SCHEMA)
  return 'create table process done'
}

// run().then(result => {
//   console.log(result)
// }).catch(e => {
//   console.log(e.message)
// })


module.exports = db


// pgdb.migrate.latest(config)
//   .then(result => {
//     console.log('mirage done')
//   })
//   .catch(e => {
//     console.log(e.message)
//   })