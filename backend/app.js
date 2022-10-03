const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors  = require('cors');
const jwt = require('./helpers/jwt') //dung de ngan chan su dung maf ko co API
const errorHandler = require('./helpers/error-handler');


app.use(cors());
app.options('*', cors());


require('dotenv/config');


const api = process.env.API_URL;

const productsRouter = require('./routers/products');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');
const categoriesRouter = require('./routers/categories');


//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(jwt()); // chuui

app.use(errorHandler);

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoriesRouter);
//Models
const Product = require('./models/product');
const User = require('./models/user');
const Order = require('./models/order');
const Category = require('./models/category');

//connnect
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