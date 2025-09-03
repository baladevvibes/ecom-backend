

const { paymentProcess, sendAPIKey } = require("../controller/PaymentController");
const auth = require("../middleware/auth");
const paymentRouter   = require("express").Router()


paymentRouter.post('/payment/process' ,auth,paymentProcess)
paymentRouter.get('/getKey' ,sendAPIKey)




module.exports = paymentRouter;