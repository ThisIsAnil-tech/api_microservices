const express = require("express");
const connectDB = require("./config/db");
const app = express();

app.use(express.json());

connectDB();

const productRoutes = require("./routes/ProductRoutes");
app.use("/products", productRoutes);

app.use((req, res) => {
    res.status(404).json({ msg: "Route" });
});

app.listen(8000, () => {
    console.log("server running");
});