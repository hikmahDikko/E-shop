const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.get(`/`, async (req, res) => {
    const category = await category.find()

    if(!category){
        res.status(404).json({
            success : false
        })
    }
    res.status(201).json(category)
});

router.post(`/create`, (req, res) => {
    const category = new Category({
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color
    });

    category.save().then((category) => {
        res.status(201).json(category)
    }).catch((error) => {
        res.status(500).json(error)
    })
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id).then((category) => {
        if (category) {
            return res.status(204)
        }else {
            return res.status(404).json({success : "false", message : "Not Found"})
        }
    }).catch((error) => {
        res.status(500).json({error: error.message})
    })

})

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        return res.status(201).json({
            data : category
        })
    }
    res.status(500).json("Not Found")
});

router.put('/:id', async(req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color
    }, {new: true});

    if(!category){
        return res.status(400).json({
            sucess : false
        })
    }
    res.status(201).json(category);
})

module.exports = router;