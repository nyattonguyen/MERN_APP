require('dotenv/config');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors  = require('cors');
const cookieParser = require('cookie-parser')

const app = express();
const errorr = require('./middleware/error');

// const authJwt = require('./helpers/jwt');
// const errorHandler = require('./helpers/error-handler');

const router  = require('./routers')



app.use(cookieParser())
app.use(cors({
    origin: '*',
    credentials: true,
}));

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }))
//
// app.use(authJwt());
// app.use(errorHandler);

//Routers
app.use('/api/v1/',router);
app.use(errorr);

//Models


//connnect
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database Connection is ready ...')
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000, ()=>{
    console.log('server is running http://localhost:3000');
})