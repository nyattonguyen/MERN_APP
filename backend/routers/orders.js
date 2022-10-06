
const {Order} = require('../models/order');

const { OrderItem } = require('../models/orderItem');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const catchasyncerror = require('../middleware/catchasyncerror');
const ErrorHandler = require('../utils/errorHandler');
const { isAuthenticatedUser } = require('../middleware/auth');

router.get('/', async(req, res) => {
    const orderList = await Order.find().populate('user', 'name');
    if(!orderList) {
        res.status(500).json({message: false})
    }
    res.status(200).send(orderList);
})

router.get(`/:id`, catchasyncerror(async(req, res, next) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category'}});
    if(!order) {
        return next(new ErrorHandler('Order not found with this Id', 404));
    }
    res.status(200).send(order);
}))

router.post(`/` ,catchasyncerror( async (req, res, next) =>{
    
        const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
            let newOrderItem = new OrderItem({
                date:orderItem.date,
                hours:orderItem.hours,
                product: orderItem.product
            })
    
            newOrderItem = await newOrderItem.save();
    
            return newOrderItem._id;
        }))
        const orderItemsIdsResolved =  await orderItemsIds;

        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price;
            return totalPrice
        }))
    
        const totalPrice = totalPrices.reduce((a,b) => a +b , 0);
    
        let order = new Order({
            orderItems: orderItemsIdsResolved,
            address: req.body.address,
            name: req.body.name,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        })
        order = await order.save();
        if(!order)
            return res.status(400).send('the order cannot be created!')

        res.send(order);
    
}))


router.put('/:id',catchasyncerror(async (req, res)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be update!')

    res.send(order);
}))


router.delete('/:id', catchasyncerror((req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
}))

router.get('/get/totalsales',catchasyncerror( async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
}))

router.get(`/get/count`, catchasyncerror(async (req, res) =>{
    const orderCount = await Order.countDocuments()

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
}))

router.get(`/get/userorders/:userid`, catchasyncerror(async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'date': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
}))


module.exports =router;


























