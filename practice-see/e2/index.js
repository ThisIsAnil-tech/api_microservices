const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const connectDB = async () =>{
    const mongodb_uri = "mongodb://localhost:27017/product";
    try{
        await mongoose.connect(mongodb_uri);
        console.log("MongoDB connected Successfulle.");
    }catch(err){
        console.error("Error in connecting Mongodb: " + err.message);
    }
};

connectDB();

const prodSchema = new mongoose.Schema({
    Pid:Number,
    name:String,
    price:Number
});

const Prod = mongoose.model("Product", prodSchema);

app.get("/",(req,res)=>{
    res.send("API Working...");
});

app.get("/prod",async (req,res)=>{
    try{
        const prods = await Prod.find();
        res.status(200).json(prods);
    }catch(err){
        res.status(400).json({"Error: " : err.message});
    }
});

app.get("/prods/:Pid",async (req,res)=>{
    try{
        const prod = await Prod.findOne({Pid:req.params.Pid});
        if(!prod) res.status(404).json({'msg':"Product not found"});
        res.status(200).json(prod);
    }catch(err){
        res.status(400).json({"Error: " : err.message});
    }
});

app.post("/new/add",async (req,res)=>{
    try{
        const prod = await new Prod(req.body);
        prod.save();
        res.status(200).json({...prod,msg:"User Added"});
    }catch(err){
        res.status(400).send({Error:err.message});
    }
});

app.put("/old/add/:Pid",async (req,res)=>{
    try{
        const prods = await Prod.findOneAndUpdate({Pid:req.params.Pid},req.body,{new:true});
        if(!prod) res.status(404).json({'msg':"Product not found"});
        res.status(200).json({...prods,msg:"Producted Updated"});
    }catch(err){
        res.status(400).json({"Error: " : err.message});
    }
});

app.delete("/old/delete/:Pid",async (req,res)=>{
    try{
        const prods = await Prod.findOneAndDelete({Pid:res.params.Pid});
        if(!prod) res.status(404).json({'msg':"Product not found"});
        res.status(200).json({prods,msg:"Product Deleted"});
    }catch(err){
        res.status(400).json({"Error: " : err.message});
    }
});

const port = 6985;
app.listen(port,()=>{
    console.log(`Server Running on the port ${port}`);
});