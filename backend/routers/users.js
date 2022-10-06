const User = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const catchasyncerror = require('../middleware/catchasyncerror');
const { isAuthenticatedUser } = require('../middleware/auth');



router.get('/test', async(req,res) => res.status(200).json({
    message: 'hello'
}))

router.get(`/`, async (req, res) => {
    const userList =  await User.find().select('-passwordHash');
    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);  
})

router.get(`/:id`, async (req, res) => {
    const user =  await User.findById(req.params.id).select('-passwordHash');
    if(!user) {
        res.status(500).json({success: false})
    }
    res.send(user);  
})

router.post(`/`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        street:req.body.street,
        country: req.body.country,
        city:req.body.city,
        phone:req.body.phone,
        isAdmin: req.body.isAdmin
        // countInStock:req.body.countInStock
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.post('/login', catchasyncerror(
    (async (req, res) => {
        const user = await User.findOne({email: req.body.email})
        const secret = process.env.SECRET_KEY_TOKEN; 
        if(!user) {
            return res.status(400).send('the user not found!');
        }
        if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                secret,
                {
                    expiresIn: '1d'
                }
    
            )
             res.status(400).send({ user: user.email, token: token});
    
        }else {
            res.status(400).send('password is wrong !');
        }
    })
))  


router.post('/register', async (req,res)=>{

    const passwordHash = await bcrypt.hashSync(req.body.password, 10)

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash,
        street:req.body.street,
        country: req.body.country,
        city:req.body.city,
        phone:req.body.phone,
        isAdmin: req.body.isAdmin
        // countInStock:req.body.countInStock
    })
    user = await user.save();
   

    if(!user)
    return res.status(400).send('the user cannot be register!')

    res.send(user);
})
router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments({count : count})

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})



router.delete('/:id',(req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user) {
            return res.status(200).json({success:true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false, message: 'user note found!'})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})


module.exports = router;


// test token 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzM4NjIzNmUzMzU2OGQyMWQ2ODAwOGIiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjY0NjM5NjUyLCJleHAiOjE2NjQ3MjYwNTJ9.DCgQUoUAEf21aAQl9gvLg2NcRlDdE0EwMVAls2wdrf8
