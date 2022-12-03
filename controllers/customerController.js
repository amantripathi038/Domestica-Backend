const Customer = require("../models/customerModel")
const Otp = require("../models/otpModel")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const saltRounds = 10
const sendToken = require("../utils/jwtToken")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const cloudinary = require("cloudinary")
const axios = require('axios')
const Worker = require('../models/workerModel')
const request = require('request')
const saveUser = require("../utils/saveUser")

exports.sendOtp = catchAsyncErrors(async function (req, res) {
    const { name, contact, password, longitude, latitude, dob } = req.body;
    console.log(req.body)
    const location = [Number(longitude), Number(latitude)]
    const customer = await Customer.findOne({
        contact: contact
    })
    if (customer) return res.status(409).send("Customer already registered!")
    const OTP = otpGenerator.generate(6, {
        digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
    })
    const otp = await Otp.create({ contact: contact, otp: OTP, name, password, location, dob });
    return res.status(200).send("Otp send successfully!" + otp);
})

exports.registerCustomer = catchAsyncErrors(async function (req, res) {
    const { contact, otp } = req.body

    const otpHolder = await Otp.find({
        number: contact
    })

    if (otpHolder.length === 0) return res.status(410).send("You use an Expired OTP!");

    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = (otp === rightOtpFind.otp)

    // Hashing and salting password
    bcrypt.hash(rightOtpFind.password, saltRounds, async function (err, hash) {
        if (rightOtpFind.contact === contact && validUser) {
            const createdCustomer = await Customer.create({
                name: rightOtpFind.name,
                contact: rightOtpFind.contact,
                password: hash,
                location: rightOtpFind.location,
                birthday: rightOtpFind.dob
            })
            await Otp.deleteMany({
                contact: rightOtpFind.contact
            });
            sendToken(createdCustomer, 200, res, 0);
        } else {
            return res.status(400).send("Your OTP was wrong!")
        }
    })
})

exports.loginCustomer = catchAsyncErrors(async function (req, res) {
    const contact = req.body.contact
    const password = req.body.password

    if (contact.length > 10) {
        Customer.findOne({ email: contact }, catchAsyncErrors(async function (err, foundCustomer) {
            if (err) {
                res.status(401).send("Incorrect Contact or Password")
            }
            else {
                if (foundCustomer) {
                    const isPasswordMatched = await foundCustomer.comparePassword(password);
                    if (isPasswordMatched) {
                        sendToken(foundCustomer, 200, res, 0)
                    }
                    else res.status(401).send("Incorrect Contact or Password")
                }
                else res.status(401).send("Incorrect Contact or Password")
            }
        }))
    }
    else {
        Customer.findOne({ contact: contact }, catchAsyncErrors(async function (err, foundCustomer) {
            if (err) {
                res.send("Incorrect Contact or Password")
            }
            else {
                if (foundCustomer) {
                    const isPasswordMatched = await foundCustomer.comparePassword(password);
                    if (isPasswordMatched) {
                        sendToken(foundCustomer, 200, res, 0)
                    }
                    else res.status(401).send("Incorrect Contact or Password")
                }
                else res.status(401).send("Incorrect Contact or Password")
            }
        }))
    }
})

exports.logoutCustomer = catchAsyncErrors(async function (req, res) {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully"
    })
})

exports.getCustomerDetails = catchAsyncErrors(async function (req, res) {
    const user = await Customer.findById(req.customer.id)

    res.status(200).json({
        success: true,
        customer: user
    })
})

exports.updateName = catchAsyncErrors(async function (req, res) {
    const user = await Customer.findById(req.customer.id)
    user.name = req.body.name
    saveUser(user, res, 0)
})

exports.updateEmail = catchAsyncErrors(async function (req, res) {
    const user = await Customer.findById(req.customer.id)
    user.email = req.body.email
    saveUser(user, res, 0)
})

exports.updatePassword = catchAsyncErrors(async function (req, res) {
    const newPassword = req.body.newPassword
    const password = req.body.password
    const user = await Customer.findById(req.customer.id)
    console.log(user)
    const isPasswordMatched = await user.comparePassword(password);
    if (isPasswordMatched) {
        bcrypt.hash(newPassword, saltRounds, function (err, hash) {
            user.password = hash
            user.save().then((u) => {
                res.status(200).json({
                    success: true,
                })
            }).catch((err) => {
                console.log(err)
                res.status(400).json({
                    success: false,
                })
            })
        })
    }
    else res.status(401).send("Incorrect Password.")
})

exports.updateCustomerAddress = catchAsyncErrors(async function (req, res) {
    const user = await Customer.findById(req.customer.id)
    user.address = req.body
    saveUser(user, res, 0)
})

exports.updateCustomerAadhar = catchAsyncErrors(async function (req, res) {
    const user = await Customer.findById(req.customer.id)
    user.aadhar = req.body.aadhar
    saveUser(user, res, 0)
})

exports.updateCustomerLocation = catchAsyncErrors(async function (req, res) {
    const user = await Customer.findById(req.customer.id)
    const location = [Number(req.body.longitude), Number(req.body.latitude)]
    user.location = location
    saveUser(user, res, 0)
})

exports.updateCustomerContact = catchAsyncErrors(async function (req, res) {
    const user = await Customer.findById(req.customer.id)
    const { newContact } = req.body
    const contact = await Customer.findOne({
        contact: newContact
    })
    if (contact) res.status(409).send({
        message: "Mobile number already exists."
    })
    const OTP = otpGenerator.generate(6, {
        digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
    })
    const otp = await Otp.create({ contact: newContact, otp: OTP, name: user.name, password: user.password, location: user.location });
    return res.status(200).send("Otp send successfully!" + otp);
})

exports.updateCustomerContactVerify = catchAsyncErrors(async function (req, res) {
    const user = await Customer.findById(req.customer.id)
    const { newContact, otp } = req.body
    const otpHolder = await Otp.find({
        number: newContact
    })

    if (otpHolder.length === 0) return res.status(410).send("You use an Expired OTP!");

    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = (otp === rightOtpFind.otp)

    if (rightOtpFind.contact === newContact && validUser) {
        user.contact = newContact
        user.save()
        await Otp.deleteMany({
            contact: rightOtpFind.contact
        });
        res.status(200).send({
            success: "true",
            user
        })
    }
    else res.status(400).send({
        message: "Your OTP was wrong."
    })
})

exports.updateCustomerProfile = catchAsyncErrors(async function (req, res) {
    const user = await Customer.findById(req.customer.id)
    const oldImage = user.profilepic.public_id
    const myCloud = await cloudinary.v2.uploader.upload(req.files.avatar.tempFilePath, {
        folder: "Domestica/customer",
        width: 400,
        crop: "scale",
    });
    const profilepic = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
    }
    user.profilepic = profilepic
    saveUser(user, res, 0)
    cloudinary.v2.uploader
        .destroy(oldImage)
        .then(result => console.log(result))
        .catch(err => console.log(err));
})

exports.nearbyWorkers = catchAsyncErrors(async function (req, res) {
    const user = await Customer.findById(req.customer.id)
    const lat = user.location[1].toString()
    const long = user.location[0].toString()

    const workers = await Worker.find().select({ 'name': 1, 'location': 3, 'contact': 2 })

    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="
    const key = "key=" + process.env.GOOGLE_API_KEY
    const destination = "destinations=" + lat + "," + long
    for (var i = 0; i < workers.length; i++) {
        const dlat = workers[i].location[1]
        const dlong = workers[i].location[0]
        url = url + dlat + "," + dlong + "|"
    }
    const uri = url.slice(0, -1) + "&" + destination + "&" + key
    var options = {
        'method': 'GET',
        'url': uri,
        'headers': {}
    };
    request(options, function (error, response) {
        if (error) throw new Error(error)
        const data = JSON.parse(response.body)
        const row = data["rows"]
        const details = []
        for (var i = 0; i < row.length; i++) {
            details.push({
                worker: workers[i],
                distance: row[i]["elements"][0]["distance"]
            })
        }
        res.send({
            details
        })
    })
})