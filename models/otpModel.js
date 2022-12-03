const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    contact: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: [true, "Please enter your name."]
    },
    password: {
        type: String,
        required: [true, "Please enter your password."],
        minLength: [8, "Password should be greater than 8 characters."]
    },
    createdAt: 
    { 
        type: Date, 
        default: Date.now, 
        index: { expires: 300 } 
    },
    dob: {
        type: String,
        minLength: 10,
        maxLength: 10,
    },
    location: {
        type: [Number],
        required: true
    }
})

module.exports = mongoose.model("Otp", otpSchema)