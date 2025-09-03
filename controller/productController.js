const Product = require("../model/ProductModel.js")
const CategoryModel = require("../model/CategoryModel.js");


exports.getCreateProduct = async (req, res) => {
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    const { file, body } = req; // Destructure for cleaner code
    console.log(req.body, "Hello");

    if (!file) return res.status(400).send('No file uploaded.');

    const product = await Product.create({
      ...req.body,
      image: req.file?.path,
      ipAddress: req.ip,
    })

    const saveProduct = await product.save()

    return res.json({
      message: "Product Created Successfully",
      data: saveProduct,
      error: false,
      success: true
    })

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.messsage || error,
      error: true,
      success: false
    })
  }
}


exports.getAllProducts = async (req, res) => {
  const products = await Product.find()
  res.status(200).json({
    message: "Single All Products",
    data: products
  })

}

exports.getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productCategories = await CategoryModel.find({
      _id: { $in: product.category }
    }).limit(15);

    res.status(200).json({
      message: "Single product fetched",
      data: {
        product,
        categories: productCategories
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createProductReview = async (req, res) => {
  try {
    const { productReviewId } = req.params;
    const { rating, review, comment, } = req.body;
    // const userId = req.user._id;
    // const userName = req.user.name;
    console.log(productReviewId, rating, comment, review[0].rating);

    const product = await Product.findById(productReviewId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent duplicate review
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }
    const ratingValue = Number(review[0].rating);

    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: "Invalid rating value" });
    }

    // Create the review
    const reviewsData = {
      // user: userId,
      // name: userName,
      rating: ratingValue,
      // comment
    };

    
    product.reviews.push(reviewsData);

    product.numOfReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save(); // ✅ CORRECT

    res.status(201).json({ message: "Review added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};






exports.updateProductController = async (req, res) => {
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    const id = req.params.id;

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      ratings: req.body.ratings,
      image: req.body.image,
      stock: req.body.stock,
      url: req.body.url,
      numOfReviews: req.body.numOfReviews,
      discount: req.body.discount,
      more_details: req.body.more_details,
      shipping_amount: req.body.shipping_amount,
      alt_tag: req.body.alt_tag,
      ispublished: req.body.ispublished,
      ismetapublished: req.body.ismetapublished,
      ipAddress: ipAddress,
    };
    if (req.file) {
      updateData.image = `/uploads/product/${req.file.filename}`;
    }

    const updatedPost = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      message: "Updated Product",
      success: true,
      error: false,
      data: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.messsage || error,
      error: true,
      success: false
    })
  }
}

exports.deleteProductController = async (request, response) => {
  try {
    const _id = request.params.id;

    // const checkSubCategory = await Product.find({
    //   category: {
    //     "$in": [_id]
    //   }
    // }).countDocuments()

    // // const checkProduct = await ProductModel.find({
    // //     category: { $in: [_id] }
    // // }).countDocuments();

    // if (checkSubCategory > 0 || checkProduct > 0) {
    //   return response.status(400).json({
    //     message: "Category is already use can't delete",
    //     error: true,
    //     success: false
    //   })
    // }


    const deleteCategory = await Product.deleteOne({ _id: _id })

    return response.json({
      message: "Delete category successfully",
      data: deleteCategory,
      error: false,
      success: true
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true
    })
  }
}


exports.getProductMetaDescription = async (req, res) => {
  console.log("Requested producturl:", req.params.producturl);

  try {
    const data = await Product.findOne({ url: req.params.producturl });

    if (!data) {
      return res.status(404).send("Category not found");
    }

    res.status(200).json({
      title: data?.title,
      description: data?.description,
      metatitle: data?.metatitle,
      canonical: data?.canonical,
      metadescription: data?.metadescription,
      keywords: data?.keywords,
      date: data?.date,
      updatedDate: data?.updatedDate,
      author: data?.author,
      ogdescription: data?.ogdescription,
      ogtitle: data?.ogtitle,
      ogurl: data?.ogurl,
      ogimg: data?.ogimg,
      ogalt: data?.ogalt,
      schema: data?.schema,
      url: data?.url,
      id: data?._id
    });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getProductIDMetaDescription = async (req, res) => {
  console.log(req.params.productId, "hello");
  id = req.params.productId

  try {
    const data = await Product.findOne({ _id: req.params.productId });

    if (!data) {
      return res.status(404).send("Category not found");
    }

    res.status(200).json({
      title: data?.title,
      description: data?.description,
      metatitle: data?.metatitle,
      canonical: data?.canonical,
      metadescription: data?.metadescription,
      keywords: data?.keywords,
      date: data?.date,
      updatedDate: data?.updatedDate,
      author: data?.author,
      ogdescription: data?.ogdescription,
      ogtitle: data?.ogtitle,
      ogurl: data?.ogurl,
      ogimg: data?.ogimg,
      ogalt: data?.ogalt,
      schema: data?.schema,
      url: data?.url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Controller: Create/Update Product Meta
exports.createMetaProductController = async (req, res) => {
  try {
    const {
      productId,        // must come from frontend
      metatitle,
      metadescription,
      keywords,
      canonical,
      schema,
      ogtitle,
      ogdescription,
      ogurl,
      ogalt,
      ismetapublished,
    } = req.body;   // ✅ no need to wrap in .data

    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const updatedMeta = {
      metatitle,
      metadescription,
      keywords,
      canonical,
      schema,
      ogtitle,
      ogdescription,
      ogurl,
      ogalt,
      ismetapublished,
      ipAddress,
      updatedAt: Date.now(),
    };

    // ✅ update product meta fields
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updatedMeta },
      { new: true } // return updated doc
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product Meta Data Saved Successfully", product: updatedProduct });

  } catch (error) {
    console.error("Error in createMetaProductController:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

