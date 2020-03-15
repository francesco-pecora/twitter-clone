const express = require("express");
const cors = require("cors");
const monk = require("monk");        // database connection mongodb
const Filter = require("bad-words"); // cleans user input from bad words
const rateLimit = require("express-rate-limit");
const mongo = require("mongodb");

const app = express();

const db = monk(process.env.MONGO_URI || "localhost/tweeter");
const tweets = db.get("tweets"); // collection in the database
const filter = new Filter();
const limiter = rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 1
  });

app.use(cors()); // cors error when trying to access the server
app.use(express.json()); // built into express to parse any json incoming request

app.get("/", (req, res) => {
    res.json({  
      message: "Hello!",
    });
});

app.get("/tweets", (req, res) => {
    tweets.find()
          .then(tweet => {
              res.json(tweet);
          })
});

function isValidTweet(tweet){
    return tweet.name && tweet.name.toString().trim() != "" &&
           tweet.content && tweet.content.toString().trim() != ""
}

// placed over here so it only limits the post and not the get requests
app.use(limiter);

app.post("/tweets", (req, res) => {
    if(isValidTweet(req.body)){
        const tweet = {
            name: filter.clean(req.body.name.toString().trim()), // prevent database injection using toString
            content: filter.clean(req.body.content.toString().trim()),
            created: new Date()
        };
        //insert into db
        tweets
            .insert(tweet)
            .then(createdTweet => {
                res.json(createdTweet);
            });
    } 
    else {
        res.status(422);
        res.json({
            message: "Name and Tweet are required..."
        });
    }
});

app.listen(5000, ()=>{
    console.log("Listening on port 5000...")
});