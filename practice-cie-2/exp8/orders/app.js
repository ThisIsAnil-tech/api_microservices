const express = require("express");

const app = express();

app.get("/orders", (req, res) => {

    res.send("Orders Service Response");

});

app.listen(3002, () => {

    console.log("Orders Service running on port 3002");

});