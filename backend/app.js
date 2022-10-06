require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors  = require('cors');
const cookieParser = require('cookie-parser')

const app = express();
const errorr = require('./utils/errorHandler');
const router  = require('./routers')


app.use(cookieParser())
app.use(cors({
    origin: '*',
    credentials: true,
}));
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }))


//Routers
app.use('/api/v1/',router)
app.use(errorr);


//connnect
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database Connection is ready ...')
})
.catch((err)=>{
    console.log(err);
})

app.listen(3333, ()=>{
    console.log('server is running http://localhost:3333');
})