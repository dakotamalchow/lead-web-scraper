const express = require("express");

const app = express();

app.get("/api", (req,res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.json({message: "Hello, world!"});
});

app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});