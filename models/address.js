const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
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
}, { minimize: false })

module.exports = addressSchema