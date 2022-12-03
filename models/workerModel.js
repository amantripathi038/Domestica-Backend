const mongoose = require("mongoose")
var ageCalculator = require('age-calculator');
const addressSchema = require("./address");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name."]
    },

    email: { type: String, 
        trim: true, 
        index: {
            unique: true,
            partialFilterExpression: {email: {$exists: "true"}}
        } 
    },

    contact: {
        type: String,
        required: [true, "Please enter your mobile number."],
        unique: [true, "Mobile number already exist."]
    },

    password: {
        type: String,
        required: [true, "Please enter your password."],
        minLength: [8, "Password should be greater than 8 characters."]
    },

    location: {
        type: [Number],
        required: true
    },

    address: {
        type: addressSchema,
    },

    aadhar: {
        type: String
    },

    birthday: {
        type: String,
        minLength: 10,
        maxLength: 10,
        required: true
    },

    joiningdate: {
        type: Date,
        default: Date.now,
    },

    rating: [
        {
            customer: {
                type: mongoose.Schema.ObjectId,
            },
            name: {
                type: String
            },
            rating: {
                type: Number
            },
            review: {
                type: String,
                required: false,
            },
        },
    ],

    specialization: [
        {
            description: {
                type: String
            }
        }
    ],

    pricedescription: {
        type: String
    },

    experience: {
        type: Number,
        max: 60
    },

    customers: [
        {
            type: mongoose.Schema.ObjectId
        }
    ],

    last10views: [
        {
            type: mongoose.Schema.ObjectId
        }
    ],

    profilepic: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

workerSchema.virtual('age').get(function () {
    return new ageCalculator.AgeFromDate(this.birthday).age
})

workerSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

workerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("Worker", workerSchema);