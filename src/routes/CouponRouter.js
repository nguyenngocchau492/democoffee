const router = require("express").Router();
const Coupon = require("../controllers/CouponController");


router.get("/add",Coupon.addCouponView)
router.get("/", Coupon.getAllCoupon);
router.get("/:id", Coupon.getCouponbyId);
router.post("/", Coupon.createCoupon);
router.post("/:id", Coupon.editCoupon);
router.delete("/:id", Coupon.deleteCoupon);

module.exports = router;
