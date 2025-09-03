
const {  AllMyOrders, createOrder, verifyPayment } = require("../controller/OrderController");
const auth = require("../middleware/auth");
const orderRouter   = require("express").Router()


orderRouter.post('/new/order' ,auth,createOrder)
orderRouter.get('/orders/user',auth ,AllMyOrders)
orderRouter.post("/verify-payment",auth, verifyPayment);



module.exports = orderRouter;