const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const port = 3000;

const app = express();
app.use(express.json());
app.use(cors());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Item API",
            version: "1.0.0",
            description: "A simple Item API"
        },

        
        servers: [
            { url: "http://localhost:3000" }
        ],
    },
    apis: ["./server.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

let items = [
    { id: 1, name: "I1", price: 10.99 },
    { id: 2, name: "I2", price: 12.99 }
];
/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve all items
 *     description: Get list of items
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Item1
 *                   price:
 *                     type: number
 *                     example: 10.99
 */
app.get("/items", (req, res) => {
    res.json(items);
});

app.listen(port, () => {
    console.log("server is running");
});