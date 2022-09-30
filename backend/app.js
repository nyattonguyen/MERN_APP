const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv/config');

const api = process.env.API_URL;

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

const productSchema = mongoose.Schema({
    name:String,
    price:Number
    // countInStock: Number//dem so luong trong kho
})
const Product = mongoose.model('Product', productSchema);



app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'Tối đa 30m vuông',
        price: 120000,
    }
    res.send(product);  
})

app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
        // countInStock:req.body.countInStock
    })
    product.save().then((createProduct=> {
        res.status(201).json(createProduct)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success:false
        })
    })
})

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    dbName:'souji-data'
})
.then(()=>{
    console.log('Database Connection is ready ...')
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000, ()=>{
    console.log('server is running http://localhost:3000');
})