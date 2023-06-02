const express = require('express');
const router = express.Router();
const Product = require('../models/products');

router.get(`/`, async (req, res) => {
    const product = await Product.find().select('name  image -_id')

    if (!product) {
        return res.status(201).json({success: false})
    }
    res.send(product)
});

router.post(`/create`, async (req, res) => {
    const category = await Category.findById(req.body.category);

    if(!category) return res.status(404).send("No category")

    const product = new Product({
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : req.body.image,
        brand : req.body.brand,
        price : req.body.price,
        category : req.body.category,
        countInStock : req.body.countInStock,
        rating : req.body.rating,
        numReviews : req.body.numReviews,
        isFeatured : req.body.isFeatured
    })

    product = await product.save()
    
    if (product) {
        return res.status(201).json(product)
    }else{
        return res.status(500).json(error)
    }
});

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return res.status(201).json({success: false})
    }
    res.send(product)
});

module.exports = router;