const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems: [{
          date:{
               type: Date,
               require:true,
          },
          hours:{
               type: String,
               require: true,
          },
          product:{
               type: mongoose.Schema.Types.ObjectId,
               ref:'Product',
               require:true,
          }
    }],
    address:{
         type: String,
         require: true
    },
    name:{
         type:String, //TODO
         require:true
    },
    phone:{
         type:String,
         require:true,
    },
    status:{
         type:String,
         require:true,
         default:"Chờ xác nhận",
    },
    totalPrice: {
         type: Number,
    },
    user: {
         type: mongoose.Schema.Types.ObjectId,
         ref:'User',
    }
     
 })

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Order', orderSchema);



/**
Order Example:

{
    "orderItems" : [
        {
            "date": "23",
            "hours":"3",
            "product" : ""
        }
        
    ],
    "address" : "Flowers Street , 45",
    "name" : "1-B",
    "phone": "0123456789",
    "status": "00000",
    "totalPrice": "123",
    "user": "633c25011fa36c471f4687d0"
}

 */