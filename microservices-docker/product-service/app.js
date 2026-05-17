const express = require('express');
const app = express();
const PORT = 3002;

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" }
];

app.get('/', (req, res) => {
  res.send("Product Service Running");
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});