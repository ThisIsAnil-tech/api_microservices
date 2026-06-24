const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
app.use(express.json());
const port = 4562;
const swaggerOptions = {
    swaggerDefinition : {
        openapi:"3.0.0",
        info:{
            title:"Swagger UI for Items API...",
            version:"1.0.0",
            description:"This demonstrated how Swagger helps coders to Document their APIs."
        },
        servers:[{url:`http://localhost:${port}`}]
    },
    apis : ["./index.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-doc",swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /items:
 *   get:
 *     description: This ia an API the gives an item list over the endpoints
 *     responses:
 *       200:
 *         descrription: This returns an array
 *         content:
 *           application/json:
 *             schema:
 *               type:array
 */

const items = [
    {"id":1,"name":"Laptop","price":49999},
    {"id":2,"name":"Iphone","price":89999}
]

app.get("/items",(req,res)=>{
    res.status(200).json(items);
});

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});