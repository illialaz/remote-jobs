const express = require("express")
const path = require("path")

const app = express()
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "."))

const mongo = require("mongodb").MongoClient

const url = "mongodb://localhost:27017"
let db, jobsCollection, jobs

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
    jobsCollection = db.collection("jobs")
    jobsCollection.find({}).toArray((err, data) => {
      jobs = data
    })
  }
)

app.get("/", (req, res) => {
  res.render("index", {
    jobs,
  })
})

app.listen(3000, () => console.log("Server ready"))
