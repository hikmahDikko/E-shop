const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const OrderItem = require('../models/orderItems');

router.get(`/`, async (req, res) => {
    const order = await Order.find().populate('userId', 'name').sort('dateOrdered')

    if(!order){
        res.status(404).json({
            success : false
        })
    }
    res.status(201).json(order)
});

router.post(`/create`, async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product : orderItem.product 
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    })) 
    const  orderItemIdResolved = await OrderItemIds; 
    const totalPrices = await Promise.all(orderItemIdResolved.map(async (orderItemId) => {
        const orderItem = await OrderItems.findById(orderItemId).populate('product', 'price')
        const totalPrice = orderItem.product.price * orderItem.quantity

        return totalPrice;
    }))

    const totalPrice = totalPrices.reduce((a,b) => a + b, 0); 

    const order = new Order({
        orderItems : orderItemIdResolved,
        shippingAddress1 : req.body.shippingAddress,
        shippingAddress2 : req.body.shippingAddress,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        phone : req.body.phone,
        status : req.body.status,
        totalPrice : totalPrice,
        userId : req.body.userId
    });

    order.save().then((order) => {
        res.status(201).json(order)
    }).catch((error) => {
        res.status(500).json(error)
    })
});

router.delete('/:id', async (req, res) => {
    Order.findByIdAndDelete(req.params.id).then(async (order) => {
        if (order) {
            await order.orderItems.map(async (item) => {
                await OrderItem.findByIdAndDelete(item)
            })
            return res.status(204)
        }else {
            return res.status(404).json({success : "false", message : "Not Found"})
        }
    }).catch((error) => {
        res.status(500).json({error: error.message})
    })
})

router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
        path : 'orderItems', 
        populate : 'category'
    });

    if (order) {
        return res.status(201).json({
            data : order
        })
    }
    res.status(500).json("Not Found")
});

router.put('/:id', async(req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status : req.body.status,
    }, {new: true});

    if(!order){
        return res.status(400).json({
            success : false
        })
    }
    res.status(201).json(order);
})

router.get ('/get/total-sales', async(req, res) => {
    const totalSales = await Order.aggregate([
        { $group: {_id : null, totalSales : {$sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated');
    }

    res.send({totalSales : totalSales.pop().totalSales})
})

router.get('/get/count', async (req, res) => {
    const orderCount = await Order.countDocuments()

    if (!orderCount) {
        return res.status(201).json({success: false})
    }
    res.send({
        count : orderCount
    })
})

router.get(`/history/:userId`, async (req, res) => {
    const order = await Order.find({userId : req.params.userId})
    .populate({
        path : 'orderItems', 
        populate : {
            path : 'product',
            populate : 'category'
        }
    }).sort('dateOrdered')

    if(!order){
        res.status(404).json({
            success : false
        })
    }
    res.status(201).json(order)
});

module.exports = router;