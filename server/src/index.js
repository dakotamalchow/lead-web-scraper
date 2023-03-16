const express = require("express");
const mongoose = require("mongoose");

const Lead = require("./leads/model");

const app = express();

require("dotenv").config();

mongoose.connect(process.env.ATLAS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Mongo connection open");
})
.catch(error => {
    console.log("Error connecting to Mongo: " + error);
});

app.get("/api", async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    console.log("req.query:", req.query);
    const zipCodes = req.query.zipCodes.replace(/\s+/g, "").split(",");
    const getPropertyManagers = req.query.propertyManagers;
    const getRealEstateAgents = req.query.realEstateAgents;
    let leads = [];
    for (const zipCode of zipCodes) {
        const newLeads = await Lead.find({zipCodes: zipCode});
        leads.push(...newLeads);
    }
    console.log("Number of leads:",leads.length);
    res.json(leads);
});

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});