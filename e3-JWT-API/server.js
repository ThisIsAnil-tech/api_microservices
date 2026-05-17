const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "mysecretkey";

const users = [];

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, password: hashedPassword });

    res.json({ msg: "User registered successfully" });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

    res.json({ token });
});

function authMiddleware(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ msg: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid token" });
    }
}

app.get("/dashboard", authMiddleware, (req, res) => {
    res.json({
        msg: "Welcome to dashboard",
        user: req.user
    });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});