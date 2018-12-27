
const constant = require('../constants/constants')

const getSubTypeChinese = (type) => {

  switch (type) {
    case constant.EYNY_SOURCE_MOIVE:
      return '電影下載區(上傳空間)'
    case constant.EYNY_SOURCE_MOIVE_BT:
      return 'BT電影下載區'
    case constant.EYNY_SOURCE_VIDEO:
      return '伊莉影片區'
    case constant.PTT_SOURCE:
      return 'Ptt'
    default:
      return ''
  }

}


const getSubTypeConditionString = (sub) => {
  const { sub_type,
    sub_bt_movie_title,
    sub_bt_movie_views,
    sub_bt_movie_quality,
    sub_movie_title,
    sub_movie_views,
    sub_movie_category,
    sub_movie_source } = sub

  switch (sub_type) {
    case constant.EYNY_SOURCE_MOIVE:

      const movie_title = sub_movie_title ? `符合關鍵字:${sub_movie_title}` + '\n' : ''
      const movie_category = sub_movie_category ? `符合電影類型:${sub_movie_category}` + '\n' : ''
      return movie_title + movie_category

    case constant.EYNY_SOURCE_MOIVE_BT:

      const bt_movie_title = sub_bt_movie_title ? `符合關鍵字:${sub_bt_movie_title}` + '\n' : ''
      const quality = sub_bt_movie_quality ? `符合畫質:${sub_bt_movie_quality}` + '\n' : ''
      return bt_movie_title + quality

    case constant.EYNY_SOURCE_VIDEO:

      return ''

    case constant.PTT_SOURCE:
      const {title,author,board,category,rate } = sub

      const subBoard = board ? `符合版名:${board}` + '\n' : ''
      const subTitle = title ? `符合關鍵字:${title}` + '\n' : ''
      const subCategory = category ? `符合分類:${category}` + '\n' : ''
      const subAuthor = author ? `符合作者:${author}` + '\n' : ''
      const subRate = rate ? `符合推文數:${rate}` + '\n' : ''
      return subBoard + subTitle + subCategory + subAuthor + subRate

    default:
      return ''
  }

}

module.exports = {
  getSubTypeChinese,
  getSubTypeConditionString
}



