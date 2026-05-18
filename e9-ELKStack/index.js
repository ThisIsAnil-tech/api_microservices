const express = require('express');
const app = express();
const port = 3000;

const net = require('net');
const client = new net.Socket();

const logstashHost = 'localhost';
const logstashPort = 5000;

const sendLogToLogstash = (log) => {
  const logMessage = JSON.stringify(log);
  client.connect(logstashPort, logstashHost, () => {
    client.write(logMessage + '\n');
  });
  client.on("error", (err) => {
    console.log("Logstash connection error:", err.message);
});
};

client.end();

app.get('/', (req, res) => {
  sendLogToLogstash({ log: `Request received at ${new Date().toISOString()}` });
  res.send('Logging to ELK Stack!!!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});