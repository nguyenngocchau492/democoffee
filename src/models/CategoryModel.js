const mongoose = require("mongoose") ;
const CategoryModel = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    iconcategory: {
      type: String,
      default:
        "https://cdn1.iconfinder.com/data/icons/ecommerce-vol1-filled-outline-bukeicon/32/book_ecommerce_bukeicon_category_marketplace_library_school-512.png",
    },
  },
  { timestamps: true }
);
module.exports= mongoose.model("Category", CategoryModel);
