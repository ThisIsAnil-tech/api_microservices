const express = require("express");

const app = express();

app.get("/users", (req, res) => {

    res.send("Orders Service Response");

});

app.listen(3001, () => {

    console.log("Orders Service running on port 3002");

});