require("dotenv").config()

const express = require("express")
const connectDatabase = require("./config/database")
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors")
const app = express()          // Initialize Express App
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");

//Important App.use()
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



connectDatabase()              // Connect with the database


// Import Routes
const worker = require("./routes/workerRoute")
const customer = require("./routes/customerRoute")




// API's
app.use("/", worker)
app.use("/", customer)










// App Starts from this route
app.get("/", function (req, res) {
    res.send("Working Bro")
})


// Connection with the server
const server = app.listen(process.env.PORT, function () {
    console.log(`Server is working.`)
})