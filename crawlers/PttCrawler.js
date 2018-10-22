const axios = require('axios');
const cheerio = require('cheerio');

const { PTT_SOURCE, PTT_SOURCE_HOTBOARD } = require('../constants/constants')

 
module.exports = class PttCrawler {

  static TYPE_PTT_STRING() {
    return PTT_SOURCE
  }

  static TYPE_PTT_HOTBOARD_STRING() {
    return PTT_SOURCE_HOTBOARD
  }
  
  constructor() {

  }

  async getPttArticles(board = 'Gossiping', pageCount = 1) {

    try {
      const links = await this.getPageLink(board, pageCount)
      const linkPromises = links.map(url => {
        return this.getArticlesByPageLink(url)
      })

      const totalAritcles = []
      const responses = await Promise.all(linkPromises)

      
      responses.forEach(articles => {
        totalAritcles.push(...articles)
      })

    
      return totalAritcles.map(article => {
        return { ...article, board, article_source: PTT_SOURCE}
      })

    } catch (e) {
      throw e
    }

  }

  async getPageLink(boardName, pageCount) {
    try {
      const firstPage = `https://www.ptt.cc/bbs/${boardName}/index.html`

      const response = await axios.get(firstPage, {
        headers: {
          Cookie: "over18=1"
        }
      })

      if (response.statusText !== 'OK') {
        throw new Error(`${boardName}'s statusText is not OK`)
      }

      const $ = cheerio.load(response.data)
      const prev = $('.btn-group-paging a').eq(1).attr('href').match(/\d+/)[0]
      const pages = []

      for (var i = 0; i < pageCount; i++) {
        if (i === 0) {
          pages.push(firstPage)
        } else {
          pages.push(`https://www.ptt.cc/bbs/${boardName}/index${prev - i + 1}.html`)
        }

      }

      return pages
    } catch (e) {
      console.log(e.message)
      throw new Error(`can not ${boardName} ptt pages`)
    }
  }


  async getArticlesByPageLink(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          Cookie: "over18=1"
        }
      })

      if (response.statusText !== 'OK') {
        throw new Error(`${url}'s statusText is not OK`)
      }

      const articles = parsePageToArticles(response.data)

      return articles

    } catch (e) {
      console.log(e.message)
    }
  }


  async getHotBoards() {
    const hotboardUrl = 'https://www.ptt.cc/bbs/hotboards.html'
    try {
      const response = await axios.get(hotboardUrl, {
        headers: {
          Cookie: "over18=1"
        }
      })

      if (response.statusText !== 'OK') {
        throw new Error(`${url}'s statusText is not OK`)
      }

      const boardList = parseHotBoardsHtml(response.data)

      return boardList

    } catch (e) {
      console.log(e)
    }
  }
}





const listSelector = '.r-ent';
const titleSelector = '.title';
const titleLinkSelector = '.title a';
const authorSelector = '.meta .author';
const pushContentSelector = '.nrec';


const getCategory = (value, categoryPattern) => {
  if (value && typeof value === 'string') {
    return value.match(categoryPattern) ? value.match(categoryPattern)[1].trim() : '標題格式錯誤';
  }
};

const fullLink = value => (value ? `https://www.ptt.cc${value}` : '');
const pushContent = value => (value ? value.trim() : '');

const parsePageToArticles = (html) => {
  let $ = cheerio.load(html);
  const items = [];


  $(listSelector).each((i, el) => {
    $ = $.load(el);
    const title = $(titleSelector).text().trim();
    if (title.includes('本文已被刪除')) {
      return
    }

    const category = getCategory(title, /\[(.+)\]/);
    if (category === '公告') {
      return
    }

    const article_url = fullLink($(titleLinkSelector).attr('href'));
    
    const author = $(authorSelector).text();
    const pushString = pushContent($(pushContentSelector).text());
    const rate = parseRate(pushString)

    const timeStampMatch = article_url.match(/\d{10}/)

    //沒連結了 應該被刪除
    if (!timeStampMatch) { return }
    
    const timeStamp = timeStampMatch[0] ? timeStampMatch[0] : ''
    const article_date = new Date(timeStamp * 1000)

    const item = {
      title,
      category,
      article_url,
      article_date,
      author,
      rate
    };

    
    items.push(item);
  });


  return items
};


const parseHotBoardsHtml = (html) => {
  let $ = cheerio.load(html);
  const items = [];

  $('.b-ent').each((i, el) => {
    $ = $.load(el);

    

    const board_en_name = $('.board-name').text().toLowerCase()
    const current_user_count = $('.board-nuser').text().toLowerCase()
    const board_category = $('.board-class').text().toLowerCase()
    const board_desc = $('.board-title').text().toLowerCase()

    const board_tw_name = ''

    const item = {
      board_en_name,
      board_tw_name,
      current_user_count,
      board_category,
      board_desc
    };


    items.push(item);
  });
  return items
};

const parseRate = (text) => {
  const number = Number(text)
  if (!isNaN(number)) return number

  switch (text) {
    case '爆':
      return 100
    case 'X1':
      return -10
    case 'X2':
      return -20
    case 'X3':
      return -30
    case 'X4':
      return -40
    case 'X5':
      return -50
    case 'X6':
      return -60
    case 'X7':
      return -70
    case 'X8':
      return -80
    case 'X9':
      return -90
    case 'XX':
      return -100
    default:
      return 0
  }
}

