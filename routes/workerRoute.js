const express = require("express")

const { registerWorker, sendOtp, loginWorker, logoutWorker, getWorkerDetails, updateName, updateEmail, updatePassword, updateWorkerAddress, updateWorkerAadhar, updateWorkerLocation, updateWorkerContact, updateWorkerContactVerify, updateWorkerProfile, updateDob } = require("../controllers/workerController")
const { isAuthenticatedWorker } = require("../middleware/auth")

const router = express.Router()

router.route("/registerWorker").post(registerWorker)

router.route("/registerWorker/verify").post(sendOtp)

router.route("/loginWorker").post(loginWorker)

router.route("/logoutWorker").get(logoutWorker)

router.route("/getWorkerDetails").get(isAuthenticatedWorker, getWorkerDetails)

router.route("/updateWorkerName").put(isAuthenticatedWorker, updateName)

router.route("/updateWorkerEmail").put(isAuthenticatedWorker, updateEmail)

router.route("/updateWorkerPassword").put(isAuthenticatedWorker, updatePassword)

router.route("/updateWorkerAddress").put(isAuthenticatedWorker, updateWorkerAddress)

router.route("/updateWorkerAadhar").put(isAuthenticatedWorker, updateWorkerAadhar)

router.route("/updateWorkerLocation").put(isAuthenticatedWorker, updateWorkerLocation)

router.route("/updateWorkerContact").put(isAuthenticatedWorker, updateWorkerContact)

router.route("/updateWorkerContactVerify").put(isAuthenticatedWorker, updateWorkerContactVerify)

router.route("/updateWorkerProfile").put(isAuthenticatedWorker, updateWorkerProfile)

router.route("/updateWorkerDob").put(isAuthenticatedWorker, updateDob)

module.exports = router;