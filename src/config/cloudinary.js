const cloudinary = require("cloudinary")
require("dotenv").config()
cloudinary.config({
    cloud_name: process.env.Cloudin_name,
    api_key : process.env.Cloudin_apiKey,
    api_secret: process.env.Cloudin_apiSecret
})

module.exports = cloudinary