

const CrawlerScript = require('./scripts/CrawlerScript')
const Notify = require('./scripts/NotifyScript')


//script
const crawlerScript = new CrawlerScript()
const notify = new Notify()

crawlerScript.startPttHotBoardCrawler()
crawlerScript.startPttCrawler()
// crawlerScript.startEynyCrawler()

// crawlerScript.start()
notify.start()

console.log(`worker is running`);