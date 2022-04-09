const Order = require("../models/OrderModel");
const User = require("../models/UserModels");
const Book = require("../models/BookModel");
const Coupon = require("../models/CouponModel");
const mongoose = require("mongoose");
const CategoryModel = require("../models/CategoryModel");
const OrderController = {
  countOrder: async (req, res, next) => {
    console.log("counter order");
    try {
      const order = await Order.findOne({ id_user: req.cookies.id, status: 0 });
      console.log(order);
      if (order) {
        const count = order.items.length;
        console.log(count);
        return res.status(200).json({ count });
      } else {
        console.log("Đéo");
        return res.status(200).json({ count: 0 });
      }
    } catch (error) {
      return error;
    }
  },

  getAllOrder: async (req, res, next) => {
    try {
      const order = await Order.find({ status: { $ne: 0 }}).sort({createdAt: -1})

        .populate("id_user")
        .populate("items.id_book")
        .populate({
          path: "items.id_book",
          populate: {
            path: "categorybook",
          },
        })
        .populate("id_coupon");
      console.log(order);

      //  let orders = []
      //  console.log(order)

      //  if(order.forEach()){
      //    order.forEach(o=>{
      //      orders.push(order)
      //    })
      //  }else {
      //    orders.push(order)
      //  }
      // console.log(orders)
      res.render("adminLayout/main", {
        body: "components/order/list",
        orders: order,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },

  aceptedOrder: async (req, res, next) => {
    console.log("Acpet order");
    try {
      // console.log(req.params.id);
      const order = await Order.find({ _id: req.params.id })
        .populate("id_user")
        .populate("items.id_book")
        .populate({
          path: "items.id_book",
          populate: {
            path: "categorybook",
          },
        })
        .populate("id_coupon");

      // order.items.forEach(item=>{
      //   const book = await Book.findOne({_id: item.id_book })
      //  book.quantity -=item.quantity
      //  book.save()
      // })

      const book = await Book.find();

      let arrayBook = [];
      for (let i = 0; i < order[0].items.length; i++) {
        arrayBook.push({
          id: order[0].items[i].id_book._id,
          quantity: order[0].items[i].quantity,
        });
      }

      console.log(arrayBook);

      for (let i = 0; i < arrayBook.length; i++) {
        // console.log(arrayBook[i].id)
        let objIndex = book.findIndex((obj) => {
          console.log(mongoose.Types.ObjectId(obj._id).valueOf());
          return (
            mongoose.Types.ObjectId(obj._id).valueOf() ==
            mongoose.Types.ObjectId(arrayBook[i].id).valueOf()
          );
        });

        if (order.status !== 2) {
          const response = await Book.findOneAndUpdate(
            { _id: arrayBook[i].id },
            { quantity: (book[objIndex].quantity -= arrayBook[i].quantity) }
          );

          if (response) {
            await Order.findOneAndUpdate({ _id: req.params.id }, { status: 2 });

            res.redirect("/order/all");
          }
        } else {
          res.redirect("/order/all");
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  getOrder: async (req, res, next) => {
    const category = await CategoryModel.find({});
    if (!req.cookies.id) {
      return res.redirect("/user/login");
    }
    if (req.cookies.role === "0") {
      const user = await User.findOne({ _id: req.cookies.id });
      const order = await Order.findOne({ id_user: req.cookies.id })
        .where("status")
        .equals(0)
        .populate("items.id_book")
        .populate({
          path: "items.id_book",
          populate: {
            path: "categorybook",
          },
        })
        .populate("id_coupon");

      let decreMoney = 0;

      let subTotal = 0;
      if (order !== null) {
        subTotal = order.subTotal;
        order.id_coupon.forEach((coupon) => {
          decreMoney += coupon.number_decrement;
          console.log("Coupon", coupon);
          subTotal = order.subTotal - decreMoney;
        });
      } else {
        console.log("Order not exist");
      }

      res.render("userLayout/main", {
        body: "components/cart/checkout",
        orders: order ? order.items : [],
        total: order ? order.subTotal : [],
        coupon: decreMoney,
        subTotal,
        user,
        category: category,
      });
    } else {
      res.redirect("/error");
    }
  },
  getOrderbyAdmin: async (req, res, next) => {
    // console.log("Im herre");
    try {
      const order = await Order.findOne({ _id: req.params.id })
        .populate("id_user")
        .populate("items.id_book")
        .populate({
          path: "items.id_book",
          populate: {
            path: "categorybook",
          },
        })
        .populate("id_coupon");

      if (order) {
        res.render("adminLayout/main", {
          body: "components/order/detail",
          orders: order,
        });
      } else {
        return console.log("Null");
      }
      res.status(200).status({ order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  addToCart: async (req, res, next) => {
    console.log("Add to cart");
    const userId = req.cookies.id;
    if (typeof userId === "undefined") {
      return res.status(500).send({ message: "Please login first" });
    }
    const bookid = req.body.bookId;
    const cart = await Order.findOne({ id_user: req.cookies.id })
      .where("status")
      .equals(0);
    const book = await Book.findOne({ _id: bookid });
    const quantity = Number.parseInt(req.body.quantity);
    const type_order = req.body.type_order;
    const price = type_order === "buy" ? book.price_buy : book.price_rent;
    const total = price * quantity;

    if (!book) {
      console.log("Not found shit book");
      return;
    }

    let subTotal = 0;
    if (cart !== null) {
      console.log("Cart is exits");

      const bookIndex = cart.items.findIndex((item) => {
        return (
          mongoose.Types.ObjectId(item.id_book).valueOf() === bookid &&
          item.type_order === type_order &&
          cart.status === 0
        );
      });
      console.log(bookIndex);

      if (bookIndex > -1) {
        console.log("Book is exist");

        console.log(type_order);
        cart.items[bookIndex].quantity += quantity;
        console.log(price, cart.items[bookIndex].quantity);
        cart.items[bookIndex].total = cart.items[bookIndex].quantity * price;
        cart.items.forEach((item) => {
          subTotal += item.total;
        });
        cart.subTotal = subTotal;
      } else {
        cart.items.push({ id_book: book._id, quantity, type_order, total });
        cart.items.forEach((item) => {
          subTotal += item.total;
        });
        cart.subTotal = subTotal;
      }
      cart.save();
    } else {
      console.log(total);
      const order = new Order({
        id_user: userId,
        items: {
          id_book: bookid,
          type_order: type_order,
          quantity,
          total,
        },
        subTotal: total,
      });

      order.save();
    }
    return res.status(200).send({ message: "Thêm vào giỏ hàng thành công" });
  },

  readyToAcept: async (req, res, next) => {
    console.log("Hi");
    const order = await Order.findOneAndUpdate(
      { id_user: req.cookies.id, status: 0 },
      { status: 1 },
      { new: true }
    );
    console.log("order", order);
    if (!order) {
      return res.status(500).json({ message: "Giỏ hàng đang rỗng" });
    } else {
      return res
        .status(200)
        .json({ message: "Đã gửi đơn hàng để chờ xác nhận!" });
    }
  },
  addCoupon: async (req, res, next) => {
    const idCoupon = req.body.idCoupon;
    const coupon = await Coupon.findOne({ code: idCoupon });
    if (!coupon) {
      return res.status(500).json({ message: "Coupon code is wrong!!" });
    }
    const couponexistCheck = await Order.findOne({
      id_user: req.cookies.id,
    })
      .where("status")
      .equals(0)
      .populate("id_coupon");
    // return res.status(200).json({couponexistCheck})
    const couponIndex = couponexistCheck.id_coupon.findIndex((cou) => {
      return cou.code === idCoupon;
    });
    console.log(couponIndex);
    if (!couponexistCheck) {
      res.status(500).json({ message: "Order empty" });
    }
    if (couponIndex === -1) {
      const order = await Order.findOneAndUpdate(
        { id_user: req.cookies.id, status: 0 },
        { $push: { id_coupon: coupon._id } },
        { new: true }
      );
      // return res.status(200).json({order})
      if (order) {
        res.redirect("/order");
      } else {
        res.redirect("/login/user");
      }
    } else {
      res.status(500).json({ message: "Bạn đã sử dựng mã giảm giả này" });
    }
  },

  editOrder: async (req, res, next) => {
    const { id_user, id_book, type_order, quantity, status } = req.body;
    try {
      const order = await Order.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          id_user,
          id_book,
          type_order,
          quantity,
          status,
        },
        {
          new: true,
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Update Success!!!?" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  deleteOrder: async (req, res, next) => {
    const cart = await Order.findOne({ id_user: req.cookies.id, status: 0 });
    console.log(cart);

    const id = req.params.id;
    const id_user = req.cookies.id;
    console.log("cart", cart);
    if (!cart) {
      return res.status(500).json({ message: "Your cart not exits" });
    }

    const bookIndex = cart.items.findIndex((item) => {
      console.log(mongoose.Types.ObjectId(item._id).valueOf());
      console.log(id);
      return mongoose.Types.ObjectId(item._id).valueOf() === id;
    });
    console.log(bookIndex);
    if (bookIndex > -1) {
      console.log("Book is exist");
      cart.items.splice(bookIndex, 1);
      console.log(cart);
    } else {
      return res.status(500).json({ message: "Book not exist" });
    }
    console.log("ready to save");
    cart.save();
    return res.status(200).json({ message: "Đã xóa sách khỏi giỏ hàng" });
  },
  // try {

  //   const order = await Order.findOne({items: id});
  //   console.log("order",order)
  //   return
  //   res.status(200).json({ success: true, message: "Delete success" });
  // } catch (error) {
  //   res.status(500).json(error.message);
  // }

  getwaitcart: async (req, res, next) => {
    if (!req.cookies.id) {
      res.redirect("/user/login");
    }
    const order = await Order.find({ id_user: req.cookies.id })
      .where("status")
      .equals(1)
      .populate("items.id_book")
      .populate({
        path: "items.id_book",
        populate: {
          path: "categorybook",
        },
      })
      .populate("id_coupon");

    // console.log(order);
    let orderBook = []
    order.forEach(orde=>{
      orde.items.forEach(o=>{
        orderBook.push({o})
      })
    })
    orderBook.forEach(orderb=>{
      console.log(orderb.o)
    })
    
    res.render("userLayout/main", {
      body: "components/cart/cartwait",
      orders: orderBook,
      // total: order ? order.subTotal : [],
    });
  },
  historyCart: async(req,res, next)=>{
    if (!req.cookies.id) {
      res.redirect("/user/login");
    }
    const order = await Order.find({ id_user: req.cookies.id })
      .where("status")
      .equals(2)
      .populate("items.id_book")
      .populate({
        path: "items.id_book",
        populate: {
          path: "categorybook",
        },
      })
      .populate("id_coupon");

    // console.log(order);
    let orderBook = []
    order.forEach(orde=>{
      orde.items.forEach(o=>{
        orderBook.push({o})
      })
    })
    orderBook.forEach(orderb=>{
      console.log(orderb.o)
    })
    
    res.render("userLayout/main", {
      body: "components/cart/historycart",
      orders: orderBook,
      // total: order ? order.subTotal : [],
    });
  }
};

module.exports = OrderController;
