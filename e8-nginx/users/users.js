const express = require("express");

const app = express();

app.get("/users", (req, res) => {
    res.send("Users Service Response");
});

app.listen(3001, () => {
    console.log("Users Service running on port 3001");
});