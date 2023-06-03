const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const productRoute = require('./routers/products');
const categoryRoute = require('./routers/category');
const userRoute = require('./routers/user');
const cors = require("cors");
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');

app.use(express.json());
app.use(morgan('tiny'));

//middleware
app.use(cors());
app.options('*', cors());
app.use(authJwt())
app.use(errorHandler);

const url = process.env.API_URL


app.use(`${url}/products`, productRoute)
app.use(`${url}/categories`, categoryRoute)
app.use(`${url}/users`, userRoute)

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})


app.listen(3000, () => {
    console.log("Hello World");
})