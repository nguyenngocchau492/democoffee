const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const BookModel = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      default: "Anonymous author",
    },
    categorybook: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Category",
    },
    quantity: {
      type: Number,
      default: 0,
    },
    price_buy: {
      type: Number,
      default: 0,
    },
    img: {
      type: String,
      default:
        "https://dictionary.cambridge.org/vi/images/thumb/book_noun_001_01679.jpg?version=5.0.225",
    },
    img_invole: {
      type: Array,
      default:
         "https://dictionary.cambridge.org/vi/images/thumb/book_noun_001_01679.jpg?version=5.0.225",
    },
    price_rent: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      require: true,
      default: "Title Book",
    },
    description: {
      type: String,
      require: true,
      default: "Description Book",
    },
    feedback: {
      type: Object,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookModel);
