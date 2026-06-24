const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());

users = [];

app.post("/register",async (req,res)=>{
    const {username, password} = req.body;
    try{
        const user = users.find(u=> u.username === username);
        if(user){
            return res.status(400).json({"msg":"User already present"});
        }
        const hashed = await bcrypt.hash(password,10);
        users.push({username,password:hashed});
        res.status(200).json({"msg":"User Registered"});
    }catch(e){
        res.status(500).json({"Error":e.message});
    }
});

app.post("/login",async (req,res)=>{
    const {username, password} = req.body;
    try{
        const user = users.find(u => u.username === username);
        if(!user){
            return res.status(400).json({"msg":'User not found'});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({'msg':'Wrong password'});
        }
        const token = await jwt.sign({username},"my_secret_key",{expiresIn:'1h'});
        res.status(200).json({"Token":token});
    }catch(e){
        res.status(500).json({"Error":e.message});
    }
});

const middleware = async (req,res,next) => {
    const token = req.headers['authorization'].split(" ")[1];
    if(!token){
        return res.status(400).json({"msg":'No token provided'});
    }
    try{
        const decoded = await jwt.verify(token,"my_secret_key");
        req.body = decoded;
        next();
    }catch(e){
        res.status(500).json({"Error":e.message});
    }
};

app.get("/dashboard",middleware,(req,res)=>{
    res.status(200).send("Welcomme to Authenticated Dashboard");
});

app.listen(1236,()=>{
    console.log(`Server running on the port ${1236}`);
});