const Order = require("../model/OrderModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.paymentProcess = async (req, res) => {
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
}

exports.sendAPIKey = async (req,res) =>{
    res.status(200).json({
        key:process.env.RAZORPAY_KEY_ID
    })
}