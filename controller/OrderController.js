const Order = require("../model/OrderModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ✅ Create order
exports.createOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      billingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // 1️⃣ Razorpay order
    const options = {
      amount: totalPrice * 100, // in paise
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // 2️⃣ Save order in MongoDB
    const order = await Order.create({
      shippingInfo,
      billingInfo,
      orderItems,
      paymentInfo: {
        ...paymentInfo,
        razorpayOrderId: razorpayOrder.id,
      },
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      razorpayOrder,
      order,
      key: process.env.RAZORPAY_KEY_ID, // send key to frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update order as paid
      await Order.findOneAndUpdate(
        { "paymentInfo.razorpayOrderId": razorpay_order_id },
        {
          $set: {
            "paymentInfo.status": "paid",
            "paymentInfo.razorpayPaymentId": razorpay_payment_id,
          },
        },
        { new: true }
      );

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


//getsingleorderbyid


//All my orders

exports.AllMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user?._id })

        if (!orders) {
            return res.status(400).json({
                message: "No Order found",
                error: false,
                success: true
            })
        }

        res.status(200).json({
            success: true,
            orders
        })

    } catch (error) {

    }
}

//Admin get All Order


//update Order status

// update Quality

// delete order