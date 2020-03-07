const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors()); // cors error when trying to access the server
app.use(express.json()); // built into express to parse any json incoming request

app.get("/", (req, res) => {
    res.json({  
      message: "Hello!"
    });
})

function isValidTweet(tweet){
    return tweet.name && tweet.name.toString().trim() != "" &&
           tweet.content && tweet.content.toString().trim() != ""
}

app.post("/tweets", (req, res) => {
    if(isValidTweet(req.body)){
        //insert into db
        console.log(req.body);
        const tweet = {
            name: req.body.name.toString(), // prevent database injection using toString
            content: req.body.content.toString()
        }
    } 
    else {
        res.status(422);
        res.json({
            message: "Name and Tweet are required..."
        });
    }
})

app.listen(5000, ()=>{
    console.log("Listening on port 5000...")
})