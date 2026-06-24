const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const connectDB = async () => {
    const mongodb_uri = "mongodb://localhost:27017/product";
    try {
        await mongoose.connect(mongodb_uri);
        console.log("MongoDB connected Successfully.");
    } catch (err) {
        console.error("Error in connecting Mongodb: " + err.message);
    }
};

connectDB();

const prodSchema = new mongoose.Schema({
    Pid: Number,
    name: String,
    price: Number
});

const Prod = mongoose.model("Product", prodSchema);

app.get("/", (req, res) => {
    res.send("API Working...");
});

app.get("/prod", async (req, res) => {
    try {
        const prods = await Prod.find();
        res.status(200).json(prods);
    } catch (err) {
        res.status(400).json({ "Error": err.message });
    }
});

app.get("/prods/:Pid", async (req, res) => {
    try {
        const prod = await Prod.findOne({ Pid: req.params.Pid });
        if (!prod) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(prod);
    } catch (err) {
        res.status(400).json({ "Error": err.message });
    }
});

app.post("/new/add", async (req, res) => {
    try {
        const prod = new Prod(req.body);
        await prod.save();
        res.status(201).json({ ...prod._doc, msg: "Product Added" });
    } catch (err) {
        res.status(400).json({ Error: err.message });
    }
});

app.put("/old/add/:Pid", async (req, res) => {
    try {
        const prods = await Prod.findOneAndUpdate(
            { Pid: req.params.Pid },
            req.body,
            { new: true }
        );
        if (!prods) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ ...prods._doc, msg: "Product Updated" });
    } catch (err) {
        res.status(400).json({ "Error": err.message });
    }
});

app.delete("/old/delete/:Pid", async (req, res) => {
    try {
        const prods = await Prod.findOneAndDelete({ Pid: req.params.Pid });
        if (!prods) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ Pid: req.params.Pid, msg: "Product Deleted" });
    } catch (err) {
        res.status(400).json({ "Error": err.message });
    }
});

const port = 6985;
app.listen(port, () => {
    console.log(`Server Running on the port ${port}`);
});