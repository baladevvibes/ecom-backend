const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        },
        state: {
            type: String,
            require: true
        },
        country: {
            type: String,
            require: true
        },
        pinCode: {
            type: Number,
            require: true
        },
        phoneNo: {
            type: String,
            require: true
        }
    },
    billingInfo: {
        address: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        },
        state: {
            type: String,
            require: true
        },
        country: {
            type: String,
            require: true
        },
        pinCode: {
            type: Number,
            require: true
        },
        phoneNo: {
            type: String,
            require: true
        }
    },
    orderItems: [
        {
            discount: {
                type: Number,
                require: true
            },
            discountedPrice: {
                type: Number,
                require: true
            },
            image: {
                type: String,
                require: true
            },
            name: {
                type: String,
                require: true
            },
            price: {
                type: Number,
                require: true
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "product",
                require: true
            },
            quantity: {
                type: Number,
                require: true
            },
            shipping_amount: {
                type: Number,
                require: true
            },
            stock: {
                type: Number,
                require: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true
    },
    paymentInfo: {
        id: {
            type: String,
            require: true
        },
        // status: {
        //     type: String,
        //     require: true
        // },
        razorpayOrderId: {
            type: String,
            required: true,
        },
        razorpayPaymentId: {
            type: String,
            default: null, // initially null before payment
        },
        razorpaySignature: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ['created', 'paid', 'failed'],
            required: true,
            default: 'created',
        },
    },
    paidAt: {
        type: String,
        require: false
    },
    itemPrice: {
        type: Number,
        require: true,
        default: 0
    },
    taxPrice: {
        type: Number,
        require: true,
        default: 0
    },
    shippingPrice: {
        type: Number,
        require: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        require: true,
        default: 0
    },
    deliveredAt: Date,
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("order", OrderSchema);