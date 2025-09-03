const mongoose = require("mongoose")


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    url: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    alt_tag: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    ispublished: {
        type: String,
        enum: ["Published", "Unpublished"],
        required: true,
    },
    ismetapublished: {
        type: String,
        enum: ["meta", "notmeta"],
        required: true,
    },
    metatitle: {
        type: String,
        required: false,
    },
    metadescription: {
        type: String,
        required: false,
    },
    keywords: {
        type: String,
        required: false,
    },
    canonical: {
        type: String,
        required: false,
    },
    schema: {
        type: String,
        required: false,
    },
    ogtitle: {
        type: String,
        required: false,
    },
    ogdescription: {
        type: String,
        required: false,
    },
    ogurl: {
        type: String,
        required: false,
    },
    ogalt: {
        type: String,
        required: false,
    },
    ipAddress: {
        type: String,
        required: false,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("category", categorySchema)