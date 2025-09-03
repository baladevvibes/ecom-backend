const mongoose = require("mongoose")

const subCategorySchema = new mongoose.Schema({
    name: { type: String, default: "" },
    url: { type: String, default: "" },
    image: { type: String, default: "" },
    position: { type: Number, default: "" },
    alt_tag: { type: String, default: "" },
    category: [{ type: mongoose.Schema.ObjectId, ref: "category" }],
    ispublished: { type: String, enum: ["Published", "Unpublished"], required: true },
    ismetapublished: { type: String, enum: ["meta", "notmeta"], required: true },
    metatitle: String,
    metadescription: String,
    keywords: String,
    canonical: String,
    schema: String,
    ogtitle: String,
    ogdescription: String,
    ogurl: String,
    ogalt: String,
    ipAddress: String,
}, { timestamps: true });


module.exports = mongoose.model("subCategory", subCategorySchema)


