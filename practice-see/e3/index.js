const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());

// Use const for users array (better practice)
const users = [];

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
        return res.status(400).json({ "msg": "Username and password are required" });
    }
    
    try {
        const user = users.find(u => u.username === username);
        if (user) {
            return res.status(400).json({ "msg": "User already present" });
        }
        const hashed = await bcrypt.hash(password, 10);
        users.push({ username, password: hashed });
        res.status(201).json({ "msg": "User Registered" });
    } catch (e) {
        res.status(500).json({ "Error": e.message });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
        return res.status(400).json({ "msg": "Username and password are required" });
    }
    
    try {
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ "msg": "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ "msg": "Wrong password" });
        }
        // No need for await with jwt.sign (it's synchronous)
        const token = jwt.sign({ username }, "my_secret_key", { expiresIn: '1h' });
        res.status(200).json({ "Token": token });
    } catch (e) {
        res.status(500).json({ "Error": e.message });
    }
});

const middleware = (req, res, next) => {
    // Check if authorization header exists
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ "msg": "No token provided" });
    }
    
    // Check if header has Bearer format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ "msg": "Invalid token format. Use Bearer <token>" });
    }
    
    const token = parts[1];
    
    try {
        // No need for await with jwt.verify (it's synchronous)
        const decoded = jwt.verify(token, "my_secret_key");
        // Store user info in req.user (not req.body)
        req.user = decoded;
        next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ "Error": "Token has expired" });
        }
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ "Error": "Invalid token" });
        }
        res.status(500).json({ "Error": e.message });
    }
};

app.get("/dashboard", middleware, (req, res) => {
    res.status(200).send(`Welcome to Authenticated Dashboard, ${req.user.username}`);
});

app.listen(1236, () => {
    console.log(`Server running on the port ${1236}`);
});