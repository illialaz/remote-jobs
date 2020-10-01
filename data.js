const puppeteer = require('puppeteer')
const mongo = require("mongodb").MongoClient

const url = "mongodb://localhost:27017"
let db, jobs

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db("jobs")
    jobs = db.collection("jobs")

    ;(async () => {
      const browser = await puppeteer.launch({ headless: false })
      const page = await browser.newPage()
      await page.goto('https://remoteok.io/remote-javascript-jobs')
    
      const data = await page.evaluate(() => {
        const list = []
        const items = document.querySelectorAll("tr.job")
    
        for (const item of items) {
          list.push({
            company: item.querySelector(".company h3").innerHTML,
            position: item.querySelector(".company h2").innerHTML,
            link: "https://remoteok.io" + item.getAttribute("data-href"),
          })
        }
    
        return list
      })
    
      console.log(data)
      jobs.deleteMany({})
      jobs.insertMany(data)
      await browser.close()
    })()
  }
)
