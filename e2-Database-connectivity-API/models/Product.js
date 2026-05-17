const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    uid: String,
    name: String,
    price: Number
});

module.exports = mongoose.model("Product", ProductSchema);