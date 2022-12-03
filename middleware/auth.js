const ErrorHander = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const Worker = require("../models/workerModel")
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Customer = require("../models/customerModel");

exports.isAuthenticatedWorker = catchAsyncErrors(async function (req, res, next) {
    var { token } = req.cookies;
    if (!token) {
        token = req.body.token
        if (!token) return res.status(401).send("Please Login to access this resource")
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.worker = await Worker.findById(decodedData.id);
    next();
})

exports.isAuthenticatedCustomer = catchAsyncErrors(async function (req, res, next) {
    var { token } = req.cookies;
    if (!token) {
        token = req.body.token
        if (!token) return res.status(401).send("Please Login to access this resource")
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.customer = await Customer.findById(decodedData.id);
    next();
})