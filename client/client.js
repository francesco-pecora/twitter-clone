console.log("It's working...");

const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const tweetsElement = document.querySelector(".tweets");
const API_URL = "http://localhost:5000/tweets";

loadingElement.style.display = "";

listAllTweets();

form.addEventListener('submit', (event) => {
    event.preventDefault();                 // prevent for page reloading every request
    const formData = new FormData(form);    // grab user data
    const name = formData.get("name")
    const content = formData.get("content")
    const tweet = {
        name,
        content
    }
    form.style.display = "none";
    loadingElement.style.display = "";

    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(tweet),    // turn tweet into json object
        headers: {                      // specifying what we are sending
            "content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(createdTweet => {
        form.reset();                   // cleans the tweet (text) area
        setTimeout(() => {              // hiding the form for 30 seconds to avoid users spamming website
            form.style.display = "";
        }, 3000);
        listAllTweets();                // make sure re-render tweets when submit
    });
})

function listAllTweets() {
    tweetsElement.innerHTML = "";                   // cleaning up the output before creating it
    fetch(API_URL)
        .then(response => response.json())
        .then(tweets => {
            tweets.reverse();
            tweets.forEach(tweet => {
                const div = createTweetDiv(tweet);  // create the div using tweet data
                tweetsElement.appendChild(div);
                tweetsElement.style.width = "50%";
            });
            loadingElement.style.display = "none";
        });
}

function createTweetDiv(tweet){
    const div = document.createElement('div');

    const x = document.createElement('button');
    x.textContent = 'X';
    x.addEventListener('click', (event) => {
        event.preventDefault();
        fetch(API_URL + "/" + tweet._id, {
            method: "DELETE",
        })
        .then(() => {
            listAllTweets(); // update the tweets to show the new list
        });
    });

    const header = document.createElement('h3');
    header.textContent = tweet.name;
    // textContent instead of innerHTML to avoid
    // people inputting valid HTML that would render
    const contents = document.createElement('p');
    contents.textContent = tweet.content;

    const date = document.createElement('small');
    date.textContent = new Date(tweet.created);

    const space = document.createElement('div');
    space.style.height = "70px";

    // fetching IP address of the user, so that it can only delete its tweets
    fetch(API_URL + "/ip")
        .then(response => response.json())
        .then(res => {
            // only append if IP addresses are the same
            if(res.ip === tweet.ip) div.appendChild(x);
        });

    // adding content to the tweets divs
    div.appendChild(header);
    div.appendChild(contents);
    div.appendChild(date);
    div.appendChild(space);

    // singular tweet styling
    div.style.textAlign = "center";
    div.style.backgroundColor = "white";
    div.style.border = "thin solid black";
    div.style.marginBottom = "20px";
    div.style.borderRadius = "30px";

    return div;
}