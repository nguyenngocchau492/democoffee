const router = require("express").Router();
const CategoryController = require("../controllers/CategoryController");
const uploadImg = require("../config/multerConfig")
router.get("/", CategoryController.getAllCategory);
router.get("/add",(req,res)=>{
    res.render("adminLayout/main", {
        body: "components/category/add",
       
})
})
router.get("/:id", CategoryController.getCategorybyId);
router.post("/add", uploadImg.single("image"), CategoryController.createCategory);
router.post("/:id",uploadImg.single("image"),  CategoryController.editCategory);
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
