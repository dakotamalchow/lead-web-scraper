const express = require("express");

const {scrape} = require("./webscraper");
const db = require("./test-db.json");


const app = express();

app.get("/api", async(req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    // await scrape();
    res.json({message: "Hello, world!"});
});

app.get("/api/:zipCodes", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    const zipCodes = req.params.zipCodes.split("+");
    let contacts = [];
    for (const zipCode of zipCodes) {
        const newContacts = db[zipCode];
        contacts.push(...newContacts);
    }
    console.log(contacts);
    res.json(contacts);
});

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});