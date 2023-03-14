const express = require("express");

const db = require("./test-db.json");


const app = express();

app.get("/api", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    console.log("req.query:", req.query);
    const zipCodes = req.query.zipCodes.replace(/\s+/g, "").split(",");
    const getPropertyManagers = req.query.propertyManagers;
    const getRealEstateAgents = req.query.realEstateAgents;
    let contacts = [];
    for (const zipCode of zipCodes) {
        const newContacts = db[zipCode];
        contacts.push(...newContacts);
    }
    res.json(contacts);
});

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});