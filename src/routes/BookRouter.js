const router = require("express").Router();
const BookController = require("../controllers/BookController");
const uploadImg = require("../config/multerConfig");
const Category = require("../models/CategoryModel")
const BookModel = require("../models/BookModel");
router.get("/", BookController.getAllBook);
router.get("/search", BookController.getBookbyName)


router.get("/add",  async (req, res, next) => {
if(req.cookies.role === "1" || req.cookies.role === "2"){
  const category =await Category.find({});
  console.log(req.cookies)
  res.render("adminLayout/main", {
    body: "components/product/add",
   category: category
  })
} else {
 res.redirect('/error')
}
});


router.get("/:id", BookController.getBookbyId);


router.post(
  "/",
  uploadImg.fields([
    { name: "img", maxCount: 1 },
    { name: "img_invole", maxCount: 7 },
  ]),
  BookController.createBook
);
// router.post("/", BookController.createBook);
router.post(
  "/:id",
  uploadImg.fields([
    { name: "img", maxCount: 1 },
    { name: "img_invole", maxCount: 7 },
  ]),
  BookController.editBook
);
router.delete("/:id", BookController.deleteBook);




module.exports = router;
