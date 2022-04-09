const router = require("express").Router();
const OrderModel = require("../models/OrderModel");
const moment = require("moment");

router.get("/", async (req, res, next) => {
  let concac = [];
  const orders = await OrderModel.find({ status: 2 });
  let listDate = [];
  for (let i = 0; i < 7; i++) {
    let obj = {};
    obj.label = moment(new Date())
      .subtract(i, "days")
      .locale("vn")
      .format("ddd - DD/MM");
    obj.value = moment(new Date())
      .subtract(i, "days")
      .endOf("day")
      .format("DD-MM-YYYY")
      .valueOf();
    listDate.push(obj);
  }
  let listOrders = [];
  for (let i = 0; i < orders.length; i++) {
    let obj = {};
    obj.subTotal = orders[i].subTotal;
    obj.date = moment(orders[i].updatedAt).format("DD-MM-YYYY");
    listOrders.push(obj);
  }
  for (let i = 0; i < listDate.length; i++) {
    let obj = {};
    obj.total = 0;
    for (let j = 0; j < listOrders.length; j++) {
      if (listDate[i].value === listOrders[j].date) {
        obj.date = listDate[i].label;
        obj.total += listOrders[j].subTotal;
      }else{
        obj.date = listDate[i].label;
      }
    }
    concac.push(obj);
  }
console.log(concac)
  return res.status(200).send(concac);
});

module.exports = router;
