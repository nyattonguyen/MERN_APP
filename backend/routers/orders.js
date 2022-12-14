
const {Order} = require('../models/order');

const { OrderItem } = require('../models/orderItem');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const catchasyncerror = require('../middleware/catchasyncerror');
const ErrorHandler = require('../utils/errorHandler');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { User } = require('../models/user');
const { response } = require('express');


// lấy tất cả các order
router.get('/', authorizeRoles(),async(req, res) => {
    const orderList = await Order.find().populate('user', 'name');
    if(!orderList) {
        res.status(500).json({message: false})
    }
    res.status(200).send(orderList);
})

//lấy 1 order
router.get(`/:id`, catchasyncerror(async(req, res, next) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category'}});
    if(!order) {
        return next(new ErrorHandler('Order not found with this Id', 404));
    }
    res.status(200).send(order);
}))

// booking 
router.post(`/` , isAuthenticatedUser ,catchasyncerror( async (req, res, next) =>{
    
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

// cập nhật tình trạng order (-> dang hoat dong)
router.put('/:orderid',isAuthenticatedUser , authorizeRoles() , catchasyncerror(async (req, res, next) => {

    // res.send("Hello")
    const order = await Order.findById( req.params.orderid )
    if(!order){
        return next(new ErrorHandler('Not found', 404));        
    }
    order.status === 'Chờ xác nhận' ? order.status = 'Đang hoạt động' : order
    await order.save();
    res.status(200).json({
        order,
        success: true
    })  
}))

// xóa 1 order 
router.delete('/:id',authorizeRoles(), catchasyncerror((req, res, next)=>{
    
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

// Admin tính tổng tất cả order
router.get('/get/totalsales', authorizeRoles(),catchasyncerror( async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
}))

// 
router.get(`/get/count`, catchasyncerror(async (req, res) =>{
    const orderCount = await Order.countDocuments()

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
}))

// my order
router.get(`/get/userorders/:userid`, async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        });

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})
//user lay danh sach order co nv dang hoat dong(action)
router.get(`/get/userorderactive/:userid`, isAuthenticatedUser, catchasyncerror(async (req, res) =>{
    
    const action = await Order.where({'status':'Đang hoạt động'})

        if(!action) {
            res.status(500).json({success: false})
        } 
        
        res.status(200).json({
            action,
            success: true
        }) 
          
    
    
}))

// lay danh sach order da hoan thanh (history)
router.get(`/get/userorderfinished/:userid`, isAuthenticatedUser, catchasyncerror(async (req, res) =>{
    
    const finished = await Order.where({'status':'Hoàn thành'});

        if(!finished) {
            res.status(500).json({success: false})
        } 
        
        res.status(200).json({
            finished,
            success: true
        }) 
          
    
    
}))

//user update 1 cong viec hoan thanh
router.put(`/get/checkorder/:orderid`,isAuthenticatedUser, catchasyncerror(async (req, res, next) => {
    const action = await Order.findById( req.params.orderid )

    if(!action){
        return next(new ErrorHandler('Not found', 404));        
    }
    action.status === 'Đang hoạt động' ? action.status = 'Hoàn thành' : action
    await action.save();
    res.status(200).json({
        action,
        success: true
    })     
}
))


module.exports =router;


























