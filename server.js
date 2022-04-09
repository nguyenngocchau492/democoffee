const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const routerConfig = require("./src/config/routerConfig");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const methodOverride = require("method-override")
const configViewEngine = require("./src/config/viewEngineConfig");


const app = express();
app.use(cors());
app.use(cookieParser())
app.options("*", cors());
app.use(morgan("tiny"));
app.use(methodOverride('_method'));
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// router
routerConfig(app);
configViewEngine(app);



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
const URI = process.env.URI;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to mongodb");
  }
);
