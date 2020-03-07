console.log("It's working...");

const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const API_URL = "http://localhost:5000/tweets";

loadingElement.style.display = "none";

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
})