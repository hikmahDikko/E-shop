const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const productRoute = require('./routers/products');
const categoryRoute = require('./routers/category');
const cors = require("cors");


app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());

const url = process.env.API_URL


app.use(`${url}/products`, productRoute)
app.use(`${url}/category`, categoryRoute)

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})


app.listen(3000, () => {
    console.log("Hello World");
})