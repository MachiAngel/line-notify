
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
} = require('../constants/tableSchema.js')

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


exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable(USERS_TABLE_STRING, USERS_TABLE_SCHEMA),
    //爬蟲依例電影表
    knex.schema.createTable(EYNY_MOVIE_TABLE_STRING, EYNY_MOVIE_TABLE_SCHEMA),
    //爬蟲依例BT電影表
    knex.schema.createTable(EYNY_BT_MOVIE_TABLE_STRING, EYNY_BT_MOVIE_TABLE_SCHEMA),
    //爬蟲伊莉影片區表
    knex.schema.createTable(EYNY_VIDEO_TABLE_STRING, EYNY_VIDEO_TABLE_SCHEMA),
    //使用者訂閱依例電影表
    knex.schema.createTable(SUBSCRIBE_EYNY_MOVIE_TABLE_STRING, SUBSCRIBE_EYNY_MOVIE_TABLE_SCHEMA),
    //使用者訂閱依例BT電影表
    knex.schema.createTable(SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING, SUBSCRIBE_EYNY_BT_MOVIE_TABLE_SCHEMA),
    //使用者訂閱依例影片區表
    knex.schema.createTable(SUBSCRIBE_EYNY_VIDEO_TABLE_STRING, SUBSCRIBE_EYNY_VIDEO_TABLE_SCHEMA),

    //PTT
    knex.schema.createTable(PTT_TABLE_STRING, PTT_TABLE_SCHEMA),
    knex.schema.createTable(SUBSCRIBE_PTT_TABLE_STRING, SUBSCRIBE_PTT_TABLE_SCHEMA),
    knex.schema.createTable(PTT_HOTBOARD_TABLE_STRING, PTT_HOTBOARD_TABLE_SCHEMA),

    //推過給user的記錄表
    knex.schema.createTable(USER_PUSHED_TABLE_STRING, USER_PUSHED_TABLE_SCHEMA)
  ])
  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists(USERS_TABLE_STRING),
    knex.schema.dropTableIfExists(EYNY_MOVIE_TABLE_STRING),
    knex.schema.dropTableIfExists(EYNY_BT_MOVIE_TABLE_STRING),
    knex.schema.dropTableIfExists(EYNY_VIDEO_TABLE_STRING),
    knex.schema.dropTableIfExists(SUBSCRIBE_EYNY_MOVIE_TABLE_STRING),
    knex.schema.dropTableIfExists(SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING),
    knex.schema.dropTableIfExists(SUBSCRIBE_EYNY_VIDEO_TABLE_STRING),
    knex.schema.dropTableIfExists(PTT_TABLE_STRING),
    knex.schema.dropTableIfExists(SUBSCRIBE_PTT_TABLE_STRING),
    knex.schema.dropTableIfExists(PTT_HOTBOARD_TABLE_STRING),
    knex.schema.dropTableIfExists(USER_PUSHED_TABLE_STRING),
  ])
};
