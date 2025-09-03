const mongoose = require("mongoose");
const validator = require("validator"); // make sure this is imported

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true, 
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        default: "user"
    },
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry:{
        type:Date,
        default:""
    },
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
