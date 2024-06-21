// Import mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Define the User schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function (value) {
            return validator.isEmail(value);
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate : function (value) {
            return validator.isStrongPassword(value);
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
},
{
    timestamps: true
}

);

// Hash the password before saving the user model
UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});


userSchema.methods.getJWTRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
  };

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate resetPasswordToken
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };

// Export the User model
module.exports = mongoose.model('User', UserSchema);
