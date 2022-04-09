const multer = require("multer");
const path = require("path");

module.exports = multer({
  
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLocaleLowerCase();
    console.log(ext);
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" ||ext === ".jfif") {
      cb(null, true);
    } else {
      cb(new Error("File types is not supported"), false);
      return;
    }
  },
});
