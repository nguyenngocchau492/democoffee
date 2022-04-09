const Coupon = require("../models/CouponModel");
const CouponController = {
  getAllCoupon: async (req, res, next) => {


    try {
      const coupon = await Coupon.find({});
      if(req.cookies.role==="1"){
        res.render("adminLayout/main",{
          body: "components/coupon/list",
          coupons: coupon
        })
      } else {
        res.redirect("/error")
      }
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },

addCouponView: async(req,res,next)=>{
res.render("adminLayout/main",{
  body: "components/coupon/add"
})
},

  getCouponbyId: async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    console.log({coupon: coupon.date_from})
 res.render("adminLayout/main",{
   body: "components/coupon/edit",
   coupons: coupon
 })
  },

  // create category
  createCoupon: async (req, res, next) => {
    const {
      name,
      title,
      date_from,
      date_to,
      code,
      number_decrement,
    } = req.body;
    if (
      !name ||
      !title ||
      !date_from ||
      !date_to ||
      !code ||
      !number_decrement
    ) {
      return res.status(500).json({
        success: false,
        message: "Please enter all fill",
      });
    } else {
      const coupon = new Coupon({
        name,
        title,
        date_from,
        date_to,
        code,
        number_decrement,
      });
      coupon.save();
     res.redirect("/coupon")
    }
  },

  editCoupon: async (req, res, next) => {
    const {
      name,
      title,
      date_from,
      date_to,
      code,
      title_coupon,
      number_decrement,
    } = req.body;
    try {
      await Coupon.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          name,
          title,
          date_from,
          date_to,
          code,
          title_coupon,
          number_decrement,
        },
        {
          new: true,
        }
      );
     res.redirect("/coupon")
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  deleteCoupon: async (req, res, next) => {
    const id = req.params.id; 
    try {
      await Coupon.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Misson Success" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = CouponController;
