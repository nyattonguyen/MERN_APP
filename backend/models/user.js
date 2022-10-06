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
        require: true,
        minLength: [8, "Mật khẩu phải lớn hơn 8 chữ"]
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


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY_TOKEN, {
      expiresIn: process.env.EXPIRES_IN_SECONDS,
    });
  };
  

  userSchema.methods.comparePassword = async function (passwordInput) {
    return await bcrypt.compare(passwordInput, this.password);
  };


module.exports = mongoose.model('User', userSchema);
