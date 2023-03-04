const express = require("express");
const {scrape} = require("./webscraper");

const app = express();

app.get("/api", async(req,res) => {
    res.set("Access-Control-Allow-Origin", "*");
    await scrape();
    res.json({message: "Hello, world!"});
});

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});