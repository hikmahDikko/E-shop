const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const mongoose = require('mongoose');
const Category = require('../models/category');

router.get(`/`, async (req, res) => {
    let filter = {};
    if(req.query.categories){
        filter = {category : req.query.categories.split(',')};
    }

    const product = await Product.find(filter).populate('category').select('name  image')

    if (!product) {
        return res.status(201).json({success: false})
    }
    res.send(product)
});

router.post(`/create`, async (req, res) => {
    const category = await Category.findById(req.body.category);

    if(!category) return res.status(400).send("No category")

    let product = new Product({
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
    const product = await Product.findById(req.params.id).populate('category')

    if (!product) {
        return res.status(201).json({success: false})
    }
    res.send(product)
});

router.put('/:id', async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(500).send("Invalid product ID")
    }
    const category = await Category.findById(req.body.category);

    if(!category) return res.status(400).send("No category")

    const product = await Product.findByIdAndUpdate(req.params.id, {
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
    }, {new: true});

    if(!product){
        return res.status(400).json({
            sucess : false
        })
    }
    res.status(201).json(product);
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then((product) => {
        if (product) {
            return res.status(204)
        }else {
            return res.status(404).json({success : "false", message : "Not Found"})
        }
    }).catch((error) => {
        return res.status(500).json({error: error.message})
    })
})

router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments()

    if (!productCount) {
        return res.status(201).json({success: false})
    }
    res.send({
        count : productCount
    })
})

router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured : true}).limit(+count)

    if (!products) {
        return res.status(201).json({success: false})
    }
    res.send(products)
})

module.exports = router;