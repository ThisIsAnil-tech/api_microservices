const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

router.post("/", async (req, res) => {
    const product = new Product(req.body);
    const savedProd = await product.save();
    res.json(savedProd);
    
});

router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

router.get("/:uid", async (req, res) => {
    const prod = await Product.findOne({ uid: req.params.uid });
    if (!prod) {
        return res.status(404).json({ msg: "Prod not found" });
    }
    res.json(prod);
});

router.put("/:uid", async (req, res) => {
    const prod = await Product.findOneAndUpdate(
        { uid: req.params.uid },
        req.body,
        { new: true }
    );
    if (!prod) {
        return res.status(404).json({ msg: "Prod not found" });
    }
    res.json(prod);
});

router.delete("/:uid", async (req, res) => {
    const prod = await Product.findOneAndDelete({ uid: req.params.uid });
    if (!prod) return res.status(404).json({ msg: "Prod not found" });
    res.json({ msg: "deleted" });
});

module.exports = router;