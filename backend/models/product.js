const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type:String,
        require:true
    },
    price:{
        type:Number,
        default:0
    },
    quanlity:{
        type:String,
        require:true
    },
    desc:{ /* description*/ 
        type:String, 
        default:''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    
    
})
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});



module.exports = mongoose.model('Product', productSchema);
