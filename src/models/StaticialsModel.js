const mongoose = require("mongoose");
const StaticialModel = mongoose.Schema(
  {
    total_price: {
      type: Number,
      default: 0,
    },
    total_number: {
      type: Number,
      default: 0,
    },
    type_order: {
      type: String,
      require: true,
    },
    category: {
      name: {type: String, require: true},
      quantity: {type: Number, require: true}
    },
    date: {
      type: String,
      require: true,
    },
    number_book: {
      type: Object,
      require: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Staticial", StaticialModel);
