const express = require("express");
const cors = require("cors");
const monk = require("monk");

const app = express();

// mongo is like a big array with the entries
const db = monk("localhost/tweeter"); // right now running on localhost, with connection to database tweeter
const tweets = db.get("tweets"); // collection in the database

app.use(cors()); // cors error when trying to access the server
app.use(express.json()); // built into express to parse any json incoming request

app.get("/", (req, res) => {
    res.json({  
      message: "Hello!"
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

app.post("/tweets", (req, res) => {
    if(isValidTweet(req.body)){
        const tweet = {
            name: req.body.name.toString(), // prevent database injection using toString
            content: req.body.content.toString(),
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