const mongoose = require("mongoose");
const UserModel = mongoose.Schema(
  {
    email:{
      type: String,
      require:[true, "Please enter email"]
    },
    password: {
      type: String,
      require:[true, "Please enter password"]
    },
    name: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg",
    },
    account_balance: {
      type: Number,
      default: 0,
    },
    role: {
      type: Number,
      //0 is user, 1 is admin, 2 là thủ thư
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserModel);
