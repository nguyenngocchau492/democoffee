const mongoose = require("mongoose") ;
const CouponModel = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    date_from: {
      type: Date,
      require: true,
    },
    date_to: {
      type: Date,
      require: true,
    },
    code: {
      type: String,
      require: true,
    },
    number_decrement: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);
module.exports= mongoose.model("Coupon", CouponModel);
