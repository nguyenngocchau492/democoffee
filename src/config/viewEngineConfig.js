const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const configViewEngine = (app) => {
  app.use(cookieParser());
  app.use('/css',express.static(path.resolve(__dirname,"../public/css")))
  app.use('/js',express.static(path.resolve(__dirname,"../public/js")))
  app.use('/images',express.static(path.resolve(__dirname,"../public/images")))
  app.use('/vendor',express.static(path.resolve(__dirname,"../public/vendors")))
  app.use("/fonts",express.static(path.resolve(__dirname,"../public/fonts")))
  app.use("/plugins",express.static(path.resolve(__dirname,"../public/adminTemplate/plugins")))
  app.use("/dist",express.static(path.resolve(__dirname,"../public/adminTemplate/dist")))
 
  app.set("view engine", "ejs");
  app.set("views",path.join(__dirname, "../views"));
};

module.exports = configViewEngine;
