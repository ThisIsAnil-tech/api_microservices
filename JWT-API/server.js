const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const SECRET_KEY = "mysecretkey";

let users = [];

const authenticateToken = (req, res, next) => {
    const token = req.headers["Authorization"];
    if (!token) {
        return res.json({ msg: "Access denied" }).status(401);
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (e) {
        res.status(400).json({ msg: "Invalid token" });
    }
};

app.get("/", (req, res) => {
    res.send("JWT API is working");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hp = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hp
        };

        users.push(newUser);
        res.json({ msg: "registered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(400).json({ msg: "user not found" });
    }

    const vp = await bcrypt.compare(password, user.password);
    if (!vp) {
        return res.status(400).json({ msg: "Invalid pass" });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

app.get("/profile", authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ msg: "user not found" });
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email
    });
});

app.listen(port, () => {
    console.log("server running");
});