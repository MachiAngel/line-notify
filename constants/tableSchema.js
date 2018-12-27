
const USERS_TABLE_STRING = 'users'
const EYNY_BT_MOVIE_TABLE_STRING = 'eyny_movie_bt_articles'
const EYNY_MOVIE_TABLE_STRING = 'eyny_movie_articles'
const EYNY_VIDEO_TABLE_STRING = 'eyny_video_articles'
const PTT_TABLE_STRING = 'ptt_articles'
const PTT_HOTBOARD_TABLE_STRING = 'ptt_hotboards'

const USER_PUSHED_TABLE_STRING = 'user_pushed'


const USER_SUBSCRIBE_TABLE_STRING = 'user_subscribe'  //

const SUBSCRIBE_EYNY_MOVIE_TABLE_STRING = 'user_subscribe_eyny_movie'
const SUBSCRIBE_EYNY_BT_MOVIE_TABLE_STRING = 'user_subscribe_eyny_bt_movie'
const SUBSCRIBE_EYNY_VIDEO_TABLE_STRING = 'user_subscribe_eyny_video'
const SUBSCRIBE_PTT_TABLE_STRING = 'user_subscribe_ptt'


const USER_PUSHED_TABLE_SCHEMA = (table) => {
  table.increments()
  table.string('user_line_id', 100)
  table.string('article_url')
  table.string('sub_type', 100)
  table.timestamps(true, true)
}

const USERS_TABLE_SCHEMA = (table) => {
  table.increments()
  table.string('line_userId', 200)
  table.string('jwt_token')
  table.string('line_displayName', 200)
  table.string('line_pictureUrl')
  table.string('line_statusMessage')
  table.string('status').defaultTo('1')
  table.string('vip').defaultTo('0')
  table.timestamps(true, true)
}



const EYNY_VIDEO_TABLE_SCHEMA = (table) => {
  table.increments()
  table.string('title', 150)
  table.string('author', 100)
  table.string('keyword', 100)
  table.string('views', 100)
  table.string('article_time', 100)
  table.string('article_url')
  table.string('article_source', 100)
  table.string('membership', 100)
  table.string('movie_quality', 100)
  table.timestamps(true, true)
}


const EYNY_MOVIE_TABLE_SCHEMA = (table) => {
  table.increments()
  table.string('title')
  table.string('author')
  table.string('views')
  table.string('article_time')
  table.string('article_url')
  table.string('pre_image_url')
  table.string('article_source')
  table.string('movie_category')
  table.string('movie_source')
  table.timestamps(true, true)
}

const EYNY_BT_MOVIE_TABLE_SCHEMA = (table) => {
  table.increments()
  table.string('title')
  table.string('author')
  table.string('views')
  table.string('article_time')
  table.string('article_url')
  table.string('pre_image_url')
  table.string('article_source')
  table.string('movie_quality')
  table.timestamps(true, true)
}

// const USER_SUBSCRIBE_TABLE_SCHEMA = (table) => {
//   table.increments()
//   table.string('user_line_id', 100)
//   table.string('sub_type', 50).notNullable()
//   //ptt
//   table.string('sub_ptt_board', 50)  //哪個版
//   table.string('sub_ptt_title', 50)  //包含符合文章的title
//   table.string('sub_ptt_not_title', 50)  //不包含符合文章的title
//   table.string('sub_ptt_category', 50) //ptt該版分類
//   table.string('sub_ptt_author', 50)  //作者
//   //eyny bt movie
//   table.string('sub_bt_movie_title', 50)
//   table.string('sub_bt_movie_views', 50)
//   table.string('sub_bt_movie_quality', 50) //先給選畫質

//   //eyny movie   soucre = 下載空間
//   table.string('sub_movie_title', 50)
//   table.string('sub_movie_views', 50)
//   table.string('sub_movie_category', 50) //先只給選擇分類 -> 懸疑推理
//   table.string('sub_movie_source', 50) //下載空間 


//   table.timestamps(true, true)
// }


//PTT


const SUBSCRIBE_PTT_TABLE_SCHEMA = (table) => {
  table.increments()
  table.string('user_line_id', 100)
  table.string('sub_type', 100).notNullable()
  //ptt

  table.string('title', 100)  //標題
  table.string('not_title', 100)  //不要的標題
  table.string('board', 100)  //哪個版
  table.string('author', 100)  //作者
  table.string('category', 100)  //類別
  
  table.integer('rate')  // 推文數
  table.timestamps(true, true)
}

const PTT_TABLE_SCHEMA = (table) => {
  table.increments()

  //ptt
  table.string('title')  //標題
  table.string('board')  //哪個版
  table.string('author')  //作者
  table.string('category')  //類別
  table.string('article_url') //ptt該版分類
  table.timestamp('article_date')
  table.string('article_source')  //時間
  table.integer('rate')  // 推文數
  table.timestamps(true, true)
}


const PTT_HOTBOARD_TABLE_SCHEMA = (table) => {
  table.increments()

  //ptt hot board
  table.string('board_en_name', 100)  //標題
  table.string('board_tw_name', 100)  //標題
  table.string('current_user_count', 100)  //哪個版
  table.string('board_category', 100)  //作者
  table.string('board_desc', 100)  //類別
  table.timestamps(true, true)
}


const SUBSCRIBE_EYNY_BT_MOVIE_TABLE_SCHEMA = (table) => {

  table.increments()
  table.string('user_line_id', 100)
  table.string('sub_type').notNullable()
  //eyny bt movie
  table.string('sub_bt_movie_title')
  table.string('sub_bt_movie_views')
  table.string('sub_bt_movie_quality') //先給選畫質

  table.timestamps(true, true)
}

const SUBSCRIBE_EYNY_MOVIE_TABLE_SCHEMA = (table) => {
  table.increments()
  table.string('user_line_id', 100)
  table.string('sub_type').notNullable()
  
  //eyny movie   soucre = 下載空間
  table.string('sub_movie_title')
  table.string('sub_movie_views')
  table.string('sub_movie_category') //先只給選擇分類 -> 懸疑推理
  table.string('sub_movie_source') //下載空間 

  table.timestamps(true, true)
}

const SUBSCRIBE_EYNY_VIDEO_TABLE_SCHEMA = (table) => {
  table.increments()
  table.string('user_line_id', 100)
  table.string('sub_type').notNullable()

  table.string('keyword')
  table.string('title')
  table.string('views') 
  table.string('membership')
  table.string('quality') 
  table.timestamps(true, true)

}


module.exports = {

  USERS_TABLE_STRING,
  //ptt hot board table 
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
  USER_PUSHED_TABLE_STRING,

  //table creater fuction
  EYNY_VIDEO_TABLE_SCHEMA,
  EYNY_MOVIE_TABLE_SCHEMA,
  EYNY_BT_MOVIE_TABLE_SCHEMA,
  PTT_TABLE_SCHEMA,
  
  SUBSCRIBE_EYNY_BT_MOVIE_TABLE_SCHEMA,
  SUBSCRIBE_EYNY_MOVIE_TABLE_SCHEMA,
  SUBSCRIBE_EYNY_VIDEO_TABLE_SCHEMA,
  SUBSCRIBE_PTT_TABLE_SCHEMA,
  USER_PUSHED_TABLE_SCHEMA,
  PTT_HOTBOARD_TABLE_SCHEMA,
  USERS_TABLE_SCHEMA
}




