const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    const users = await User.find().select('-password')

    if(!users){
        res.status(404).json({
            sucess : false
        })
    }
    res.status(201).json(users)
});

router.post(`/create`, (req, res) => {
    const user = new User({
        name: req.body.name,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10),
        street : req.body.street,
        apartment : req.body.apartment,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        phone : req.body.phone,
        isAdmin : req.body.isAdmin
    });

    user.save().then((user) => {
        res.status(201).json(user)
    }).catch((error) => {
        res.status(500).json(error)
    })
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email : req.body.email});
    const secret = process.env.secret;
    console.log(user.password, req.body.password);

    if (!user) {
        return res.status(400).json({ message : 'User not found'});
    }

    if (user && bcrypt.compareSync(req.body.password, user.password)){
        const token = jwt.sign(
            {
                userId : user.id,
                isAdmin : user.isAdmin
            },
            secret,
            {expiresIn : process.env.expiresIn}
        )
        return res.status(200).json({
            email : user.email,
            token : token
        })
    }else {
        res.status(400).json({
            message : "Invalid password"
        })
    }
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        return res.status(201).json({
            data : user
        })
    }
    res.status(500).json("Not Found")
})

router.put('/:id', async(req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword;

    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.password, 10)
    }else{
        newPassword = userExist.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email : req.body.email,
        password : newPassword,
        street : req.body.street,
        apartment : req.body.apartment,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        phone : req.body.phone,
        isAdmin : req.body.isAdmin
    }, {new: true});

    if(!user){
        return res.status(400).json({
            success : false
        })
    }
    res.status(201).json(user);
})

router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments()
    if (!userCount) {
        return res.status(200).json({success: false})
    }
    res.send({
        count : userCount
    })
})

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then((user) => {
        if (user) {
            return res.status(204)
        }else {
            return res.status(404).json({success : "false", message : "Not Found"})
        }
    }).catch((error) => {
        return res.status(500).json({error: error.message})
    })
})

module.exports = router;