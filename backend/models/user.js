const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    passwordHash:{
        type: String,
        require: true
    },
    street:{
        type: String,
        default: ''
    },
    country:{
        type: String,
        default: ''
    },
    city:{
        type: String,
        default: ''
    },
    phone:{
        type: String,
        require: true
    },
    isAdmin: {
        type: Boolean,
        require: false
    },
    
})

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);