

const axios = require('axios')
const cheerio = require('cheerio')
const _ = require('lodash')

const { EYNY_SOURCE_VIDEO, 
  EYNY_SOURCE_MOIVE, 
  EYNY_SOURCE_MOIVE_BT, 
  EYNY_MOVIE_TYPE_ARRAY, 
  EYNY_BT_MOVIE_TYPE_ARRAY
} = require('../constants/constants')



const EYNY_MOVIE_URL = 'https://www.eyny.com/forum.php?mod=forumdisplay&fid=205&filter=author&orderby=dateline'
const EYNY_BT_MOVIE_URL = 'https://www.eyny.com/forum.php?mod=forumdisplay&fid=142&filter=author&orderby=dateline'

const requestConfig = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    'Upgrade-Insecure-Requests': 1,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6',
    'Host': 'www.eyny.com'
  }
}

//eyny_video 9
// { title, author, views, article_time, article_url, article_source, membership, movie_quality,keyword }
//eyny_movie 10
// { title, author, views, article_time, article_url, pre_image_url, article_source, movie_category, movie_source }
//eyny_bt_movie 9
// { title, author, views, article_time, article_url, pre_image_url, article_source, movie_quality}

module.exports = class EynyCrawler {

  static TYPE_VIDEO_STRING () {
    return EYNY_SOURCE_VIDEO
  }
  static TYPE_MOIVE_STRING() {
    return EYNY_SOURCE_MOIVE
  }
  static TYPE_BT_MOIVE_STRING() {
    return EYNY_SOURCE_MOIVE_BT
  }
  static MOVIE_CATEGORY_ARRAY() {
    return EYNY_MOVIE_TYPE_ARRAY
  }
  static BT_MOVIE_CATEGORY_ARRAY() {
    return EYNY_BT_MOVIE_TYPE_ARRAY
  }


  
  /** @description Crawler Eyny Video articles
  * @param {String} keyword
  * @param {number} page count
  * @return {array} return eyny video articles
  */
  async crawlEynyVedioArticles(keyword, count = 1) {
    //para2 is stop
    const numbers = _.range(1, count + 1)

    const pages_promise = numbers.map(number => {
      const uri = encodeURI(keyword)
      return axios.get(`https://www.eyny.com/zh/tag/${uri}&orderby=date&page=${number}`, requestConfig)
    })

    try {
      const articles = []
      const results = await Promise.all(pages_promise)

      results.forEach(({ data: html }) => {
        const articles_array = parseEynyVideoPage(html)
        articles.push(...articles_array)
      })

      const addOnResults = articles.map(article => {
        return { ...article, keyword}
      })

      //重複的url 不拿
      return _.uniqBy(addOnResults, 'article_url')

    } catch (e) {
      console.log(e.message)
      throw e
    }
  }

  async crawlEynyMovieArticles() {

    try {
      const result = await axios.get(EYNY_MOVIE_URL, requestConfig)
      const { data: html } = result 
      return parseEynyMoviePage(html)

    } catch (e) {
      console.log(e.message)
      throw e
    }
    
  }

  async crawlEynyBTMovieArticles() {

    try {
      const result = await axios.get(EYNY_BT_MOVIE_URL, requestConfig)
      const { data: html } = result
      return parseEynyBTMoviePage(html)

    } catch (e) {
      console.log(e.message)
      throw e
    }

  }

}



const parseEynyVideoPage = (html) => {
  const $ = cheerio.load(html)
  //拿最後一個這個class 就是 vedio list
  const div = $('.fixwidth').last()
  //每個item都被這個class包著 
  const tds = $(div).find('.img_box')

  const articles = []

  tds.each((i, el) => {
    
    const p_tags = $(el).find('p')
    const font_tags = $(p_tags[2]).find('font')
    
    //一定要有url(video_path) author title
    const title = $(p_tags[0]).text().trim()
    const video_path = $(p_tags[0]).find('a').attr('href')
    const author = $(p_tags[1]).text().trim()

    if (!title || !video_path || !author){return}
    if (font_tags.length < 1) {return}
    const time_and_views = $(font_tags[0]).text().trim()
    if (time_and_views.includes('重新審核中')) {return}

    //eyny特有
    const movie_quality = $(font_tags[1]).text().trim()
    const membership = $(font_tags[2]).text()

    const [raw_views,raw_time] = time_and_views.split('・')

    const views = raw_views.replace('次觀看','').trim()
    const article_time = raw_time.trim()
    
    const article_url = 'https://www.eyny.com' + video_path
    const article_source = EYNY_SOURCE_VIDEO
    
    articles.push({ title, author, movie_quality, membership, views, article_time, article_url, article_source })
  })

  return articles

}

const parseEynyMoviePage = (html) => {
  const $ = cheerio.load(html)
  
  const tbodys = $('[summary="forum_205"]').find('tbody[id^=normal]')
  
  const articles = []

  tbodys.each((i, tr) => {

    const pre_image_url = $(tr).find('.p_pre').attr('src') || ''
    const movie_category = $(tr).find('th>em>a').text()
    if (movie_category === '待修正' || movie_category === '載點失效') {return}

    const article_path = $(tr).find('th>a').attr('href')
    const title = $(tr).find('th>a').text().trim()

    //title中獲得 下載來源 與 拍攝國家
    const movie_source = _.split(title, '@')[2]

    const country_array = title.match(/\[.*\]/)
    
    const movie_country = country_array ? country_array[0].replace('[', '').replace(']', '').trim() : ''
    
    const author = $(tr).find('td>cite').first().text()
    const article_time = $(tr).find('td>em').first().text() || ''

    if (!movie_source || !article_path || !title || !author) { return }

    const views = $(tr).find('.num>em').text() || ''
    const article_source = EYNY_SOURCE_MOIVE

    const article_url = 'https://www.eyny.com/' + article_path
    articles.push({ title, author, movie_source, movie_country, movie_category, views, article_time, article_url, pre_image_url, article_source })
  })

  return articles
  
}

const parseEynyBTMoviePage = (html) => {

  const $ = cheerio.load(html)
  const tbodys = $('[summary="forum_142"]').find('tbody[id^=normal]')

  const articles = []
  
  tbodys.each((i, tr) => {

    const pre_image_url = $(tr).find('.p_pre_none').attr('src') || ''
    const movie_quality = $(tr).find('th>em>a').text()
    
    const article_path = $(tr).find('th>a').attr('href')
    const title = $(tr).find('th>a').text().trim()    

    if (title.includes('line')) return

    const author = $(tr).find('td>cite').first().text()
    const article_time = $(tr).find('td>em').first().text() || ''

    if (!article_path || !title || !author) { return }

    const views = $(tr).find('.num>em').text() || ''
    const article_source = EYNY_SOURCE_MOIVE_BT

    const article_url = 'https://www.eyny.com/' + article_path
    articles.push({ title, author, views, movie_quality, article_time, article_url, pre_image_url, article_source })
  })
  return articles
}

// const eynyCrawler = new EynyCrawler()


//ok
// eynyCrawler.crawlEynyVedioArticles('海賊',1).then(articles => {
//   console.log(articles)
//   console.log(`article數量: ${articles.length}`)

  
// }).catch(e => {
//   console.log(e.message)
  
// })


//ok

// eynyCrawler.crawlEynyMovieArticles()
//   .then(articles => {
//   console.log(articles)
//   console.log(`article數量: ${articles.length}`)
// }).catch(e => {
//   console.log(e)
// })

// eynyCrawler.crawlEynyBTMovieArticles().then(articles => {
//   console.log(articles)
//   console.log(`article數量: ${articles.length}`)
// }).catch(e => {
//   console.log(e)
// })

