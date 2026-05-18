const express = require('express');
const app = express();

app.get("/prod",(req,res)=>{
    res.send("This is the product page");
});

app.listen(3001,()=>{
    console.log("Server is running on port 3001");
});