const BookRouter = require("../routes/BookRouter");
const CategoryRouter = require("../routes/CategoryRouter");
const UserRouter = require("../routes/UserRouter");
const CouponRouter = require("../routes/CouponRouter");
const StaticialRouter = require("../routes/StaticialsRouter");
const OrderRouter = require("../routes/OrderRouter");
const CategoryController = require("../controllers/CategoryController");
const Category = require("../models/CategoryModel");
const BookModel = require("../models/BookModel");
const OrderModel = require("../models/OrderModel");
const charRouter = require("../routes/chartRouter");
const UserModels = require("../models/UserModels");


function now() {
  var d = new Date();
  d.setDate(d.getDate())
  return d.toISOString();
}
function tenDayago(){
  var d = new Date();
  d.setDate(d.getDate()-10)
  return d.toISOString();
}

const routerConfig = (app) => {
  app.use("/coffee", BookRouter);
  app.use("/category", CategoryRouter);
  app.use("/coupon", CouponRouter);
  app.use("/user", UserRouter);
  app.use("/staticial", StaticialRouter);
  app.use("/order", OrderRouter);
  app.use("/chart",charRouter)

  app.get("/", async (req, res, next) => {
   
    
    const newOrder =await OrderModel.find({updatedAt: {
      $gte: tenDayago(),
      $lte: now()
     }}).count()
   console.log(newOrder)

   const waitAccpet = await OrderModel.find({status: 1}).count()

     const newUser = await UserModels.find({updatedAt: {
      $gte: tenDayago(),
      $lte: now()
     }}).count()
     const orderAcept = await OrderModel.find({status: 2})
     let totalReceive = 0 ;
     orderAcept.forEach((order)=>{
       totalReceive += order.subTotal
     })

    const category =await Category.find({});
    const bookBack =  await BookModel.find({}).sort({createdAt
      : -1})
      const bookFront = await BookModel.find({}).limit(4)
   const newBook = await BookModel.find({}).limit(6)
   if(req.cookies.role==='0'|| !req.cookies.role){
    console.log(req.cookies)
    res.render("userLayout/main", {
      body: "components/home",
      category:category,
      books: bookBack,
      bookFront,
      newBook
    });
   } else {
    res.render("adminLayout/main", {
      body: "components/home",
      newOrder,
      waitAccpet,
      newUser,
      totalReceive
    });
   }
  });

  app.get("/error", async(req,res)=>{
    const category =await Category.find({});
    res.render("userLayout/main",{
      body: "components/error",
      category
    })
  })
  


};
module.exports = routerConfig;
