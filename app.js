const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Product = require('./models/products')

app.use(express.json());
app.use(morgan('tiny'));

const url = process.env.API_URL

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})

app.get(`${url}/welcome`, async (req, res) => {
    const product = await Product.find()
    res.send(product)
});

app.post(`${url}/post`, (req, res) => {
    const product = new Product({
        name : req.body.name,
        post :req.body.post
    })
    product.save().then((product) => {
        res.status(201).json(product)
    }).catch((error) => {
        res.status(500).json(error)
    })
})

app.listen(3000, () => {
    console.log("Hello World");
})