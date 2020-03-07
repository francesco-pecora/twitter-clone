console.log("It's working...");

const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const tweetsElement = document.querySelector(".tweets");
const API_URL = "http://localhost:5000/tweets";

loadingElement.style.display = "";

listAllTweets();

form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent for page reloading every request
    const formData = new FormData(form); // grab user data
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
        body: JSON.stringify(tweet), // turn tweet into json object
        // specifying what we are sending
        headers: {
            "content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(createdTweet => {
        console.log(createdTweet);
        form.reset(); // cleans the tweet (text) area
        form.style.display = "";
        listAllTweets(); // make sure re-render tweets when submit
    });
})

function listAllTweets() {
    tweetsElement.innerHTML = ""; // cleaning up the output before creating it
    fetch(API_URL)
        .then(response => response.json())
        .then(tweets => {
            tweets.reverse();
            tweets.forEach(tweet => {
                // create elements to show in the page for each tweet
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = tweet.name;
                // textContent instead of innerHTML to avoid
                // people inputting valid HTML that would render
                const contents = document.createElement('p');
                contents.textContent = tweet.content;

                const date = document.createElement('small');
                date.textContent = new Date(tweet.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                tweetsElement.appendChild(div);
            });
            loadingElement.style.display = "none";
        });
}