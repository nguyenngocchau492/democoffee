const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const OrderModel = mongoose.Schema(
  {
    id_user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
  items: [{
    id_book: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Book"
    },
    quantity: {
      type: Number,
      default: 1
    },
    type_order: {
      type: String,
      require: true,
    },
    total: {
      type: Number,
      required: true,
  },
  }],
    id_coupon: {
      type: Schema.Types.Array,
      ref: "Coupon",
    },
    status: {
      type: Number,
      // 0 la dang cho nguoi dung process 1 la gui len admin 2 la admin chap nhan
      default: 0,
    },
    subTotal: {
      type: Number,
      default: 0
    },
    
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderModel);
