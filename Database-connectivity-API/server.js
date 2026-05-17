/* 
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

*/































const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const url = 'mongodb://localhost:27017/prod';
mongoose.connect(url)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


const connect = async () => {
  try {
    await mongoose.connect(url);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  } 
};

connect();

// Schema & Model
const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String
});

const User = mongoose.model("User", userSchema);

// Routes

// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// CREATE
app.post("/api/users",  (req, res) => {
  try {
    const user = new User(req.body)
    .then( user.save())
    .then(() => res.json(user))
    .catch(err => res.status(500).json({ error: err.message })  );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
app.get("/api/users/:id", async (req, res) => {
  try {
    const users = await User.find();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// UPDATE
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findOneAndDelete({ id: req.params.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));