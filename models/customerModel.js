const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name."]
    },

    email: {
        type: String,
        index: {
            unique: [true, "Email already registered."],
            partialFilterExpression: { email: { $type: 'string' } },
        },
        default: null
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

    birthday: {
        type: String,
        minLength: 10,
        maxLength: 10
    },

    location: {
        type: [Number],
        required: true
    },

    address: {
        house: {
            type: String,
            default: ""
        },
        area: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        pincode: {
            type: Number,
            default: 0
        },
        state: {
            type: String,
            default: ""
        },
        landmark: {
            type: String,
            default: ""
        }
    },

    aadhar: {
        type: String,
        minLength: [12, "Must have 12 digits."],
        maxLength: [12, "Must have 12 digits."]
    },

    joiningdate: {
        type: Date,
        default: Date.now,
    },

    rating: [
        {
            worker: {
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

    workers: [
        {
            type: mongoose.Schema.ObjectId
        }
    ],

    savedWorkers: [
        {
            type: mongoose.Schema.ObjectId
        }
    ],

    profilepic: {
        public_id: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: ""
        },
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { minimize: false })

customerSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

customerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


module.exports = mongoose.model("Customer", customerSchema)