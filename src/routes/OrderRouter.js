const router = require("express").Router();
const Order = require("../controllers/OrderController");
// router.get("/checkout",(req,res)=>{
//     console.log(req.cookies)

// })

router.get("/", Order.getOrder);
router.get("/wait-acept",Order.readyToAcept)
router.post("/add-coupon", Order.addCoupon)
router.post("/:id",Order.getOrderbyAdmin)
router.get("/all", Order.getAllOrder);
router.get("/count",Order.countOrder)
router.post("/", Order.addToCart);
router.patch("/:id", Order.editOrder);
router.delete("/:id", Order.deleteOrder);
router.post("/:id/acept",Order.aceptedOrder)
router.get("/wait-order",Order.getwaitcart)
router.get("/history",Order.historyCart)
module.exports = router;
