const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/Products");
        console.log("MongoDB connected");
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};

module.exports = connectDB;