const path = require("path");
const router = require("express").Router();
const User = require("../controllers/UserController");
const { isLoggin } = require("../middlewares/Authen");
const uploadImg = require("../config/multerConfig")
router.get("/register", uploadImg.single("avatar"), (req, res) => {
  res.render("authLayout/register");
});
router.get("/login",(req,res)=>{
  res.render("authLayout/login")
})

router.get("/logout",User.logOut)

router.get("/change-password",(req,res)=>{
  res.render("userLayout/components/changePass")
})
// router.get("/addmoney", (req, res)=>{
 
//   res.render("adminLayout/components/main",{
//     body: "components/list",
//   })
// })
router.post("/change-password",User.changePassword)
router.get("/", User.getAllUser);
router.post("/add-money/:id",User.addMoney)
router.get("/:id", User.getUserbyId);
router.post("/register",uploadImg.single("avatar"), User.register);
router.post("/login", User.login);
router.patch("/:id", User.editUser);
router.delete("/:id", User.deleteUser);

module.exports = router;
