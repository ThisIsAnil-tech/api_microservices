const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());


const url = 'mongodb://localhost:27017/practive';

const connect = async () => {
  try {
    await mongoose.connect(url);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  } 
};

connect();

const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String
});

const User = mongoose.model("User", userSchema);

