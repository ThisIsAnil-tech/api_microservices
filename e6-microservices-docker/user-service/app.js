const express = require('express');
const app = express();
const PORT = 3001;

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

app.get('/', (req, res) => {
  res.send("User Service Running");
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});