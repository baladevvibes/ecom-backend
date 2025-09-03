const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    description: {
        type: String
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // ✅ Correct model name with capital 'C'
        }
    ],
    // Uncomment if you want subcategories later
    // subCategory: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'SubCategory'
    //     }
    // ],
    price: {
        type: Number
    },
    ratings: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
    stock: {
        type: Number,
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number
    },
    more_details: {
        type: String
    },
    alt_tag: {
        type: String
    },
    shipping_amount: {
        type: Number
    },
    url: {
        type: String
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            name: {
                type: String
            },
            rating: {
                type: Number
            },
            comment: {
                type: String
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    ispublished: {
        type: String,
        enum: ["Published", "Unpublished"]
    },
    ismetapublished: {
        type: String,
        enum: ["meta", "notmeta"]
    },
    metatitle: {
        type: String
    },
    metadescription: {
        type: String
    },
    keywords: {
        type: String
    },
    canonical: {
        type: String
    },
    schema: {
        type: String
    },
    ogtitle: {
        type: String
    },
    ogdescription: {
        type: String
    },
    ogurl: {
        type: String
    },
    ogalt: {
        type: String
    },
    ipAddress: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a text index for full-text search
productSchema.index(
    { name: "text", description: "text" },
    { weights: { name: 10, description: 5 } }
);

// Export the model
module.exports = mongoose.model("Product", productSchema);
