const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const mongoose = require('mongoose');
const Category = require('../models/category');
const multer  = require('multer')

const FILE_TYPE_MAP = {
    'image/jpeg':'jpeg',
    'image/png':'png',
    'image/jpg':'jpg',
    'image/gif':'gif',
}

const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        const isValid = FILE_TYPE_MAP(file.mimetype);
        let uploadError = new Error('Invalid image type');

        if(isValid) {
            uploadError = null
        }

        cb(uploadError, 'public/uploads')
    },
    filename : function (req, file, cb) {
        const filename = file.originalname.split(' ').join('_')
        const extension = FILE_TYPE_MAP(file.mimetype);
        cb(null, `${filename}-${Date.now()}.${extension}`)
    }
})

const upload = multer({ storage : storage})

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

router.post(`/create`, upload.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);

    if(!category) return res.status(400).send("No category");

    const file = req.file;
    if(!file) return res.status(400).send('No Image in the request');

    const filename = req.file.filename;

    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

    let product = new Product({
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : `${basePath}${filename}`,
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

router.put('/:id', upload.single('image'), async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(500).send("Invalid product ID")
    }
    const category = await Category.findById(req.body.category);

    if(!category) return res.status(400).send("No category")

    const data = await Product.findById(req.params.id);

    if(!data) return res.status(400).send("No product with the Id")

    const file = req.file;
    let imagePath;

    if(file) {
        const filename = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
        imagePath = `${basePath}${filename}`;
    }else {
        imagePath = data.images;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : imagePath,
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
            success : false
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

router.put('/gallery-images/:id', upload.array('images', 10), async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(500).send("Invalid product ID")
    }
    const files = req.files
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

    if(files){
        files.map(file => {
            imagePaths.push(`${basePath}${file.filename}`);
        })
    }

    const product = await Product.findByIdAndUpdate(req.params.id, {
        images : imagePaths
    }, {new: true});

    if(!product){
        return res.status(400).json({
            success : false
        })
    }
    res.status(201).json(product);
})

module.exports = router;