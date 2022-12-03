const express = require("express")

const { registerCustomer, sendOtp, loginCustomer, logoutCustomer, getCustomerDetails, updateName, updateEmail, updatePassword, updateCustomerAddress, updateCustomerAadhar, updateCustomerLocation, updateCustomerContact, updateCustomerContactVerify, updateCustomerProfile, nearbyWorkers } = require("../controllers/customerController")
const { isAuthenticatedCustomer } = require("../middleware/auth")

const router = express.Router()

router.route("/registerCustomer").post(registerCustomer)

router.route("/registerCustomer/verify").post(sendOtp)

router.route("/loginCustomer").post(loginCustomer)

router.route("/logoutCustomer").get(logoutCustomer)

router.route("/getCustomerDetails").get(isAuthenticatedCustomer, getCustomerDetails)

router.route("/updateCustomerName").put(isAuthenticatedCustomer, updateName)

router.route("/updateCustomerEmail").put(isAuthenticatedCustomer, updateEmail)

router.route("/updateCustomerPassword").put(isAuthenticatedCustomer, updatePassword)

router.route("/updateCustomerAddress").put(isAuthenticatedCustomer, updateCustomerAddress)

router.route("/updateCustomerAadhar").put(isAuthenticatedCustomer, updateCustomerAadhar)

router.route("/updateCustomerLocation").put(isAuthenticatedCustomer, updateCustomerLocation)

router.route("/updateCustomerContact").put(isAuthenticatedCustomer, updateCustomerContact)

router.route("/updateCustomerContactVerify").put(isAuthenticatedCustomer, updateCustomerContactVerify)

router.route("/updateCustomerProfile").put(isAuthenticatedCustomer, updateCustomerProfile)

router.route("/nearbyWorkers").post(isAuthenticatedCustomer, nearbyWorkers)

module.exports = router;