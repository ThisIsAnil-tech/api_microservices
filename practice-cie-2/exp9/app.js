const express = require("express");
const net = require("net");
const app = express();

function sendLog(log){
    const client = new net.Socket();
    client.connect(5000, "localhost", () => {
        client.write(log);
        client.end();
    });
}
 
app.get("/", (req, res) => {
    const log = `User accessed the home page at ${new Date().toISOString()}`;
    sendLog(log);
    res.send("ELK Stack running");
});

app.listen(3000, () => {
    console.log("Users Service running on port 3000");
});