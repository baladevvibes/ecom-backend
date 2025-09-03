const CategoryModel = require("../model/CategoryModel.js")
// const ProductModel = require("../model/product.model.js");
const SubCategoryModel = require("../model/SubCategoryModel.js");
const { decrypt } = require("../utils/EncryptDecrypt.js");

exports.AddCategoryController = async (req, res) => {
    const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    try {
        const { file, body } = req; // Destructure for cleaner code
        console.log(req.body);

        if (!file) return res.status(400).send('No file uploaded.');


        const category = await CategoryModel.create({
            ...req.body,
            image: req.file?.path,
            ipAddress: req.ip,
        })

        await category.save();

        if (!category) {
            return res.status(500).json({
                message: "Not Created",
                error: true,
                success: false
            })
        }
        return res.json({
            message: "Add Category",
            data: category,
            success: true,
            error: false
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

exports.getCategoryController = async (req, res) => {
    try {

        const data = await CategoryModel.find().sort({ createdAt: -1 })

        return res.json({
            data: data,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.messsage || error,
            error: true,
            success: false
        })
    }
}


exports.updateCategoryController = async (req, res) => {
    const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    try {
        const id = req.params.id;

        const updateData = {
            name: req.body.name,
            title: req.body.title,
            url: req.body.url,
            position: req.body.position,
            image: req.body.image,
            alt_tag: req.body.alt_tag,
            content: req.body.content,
            ispublished: req.body.ispublished,
            ismetapublished: req.body.ismetapublished,
            ipAddress: ipAddress,
        };
        if (req.file) {
            updateData.image = `/uploads/category/${req.file.filename}`;
        }

        const updatedPost = await CategoryModel.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedPost) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.json({
            message: "Updated Category",
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

exports.deleteCategoryController = async (request, response) => {
    try {
        const _id = request.params.id;

        // const checkSubCategory = await SubCategoryModel.find({
        //     category: {
        //         "$in": [_id]
        //     }
        // }).countDocuments()

        // // const checkProduct = await ProductModel.find({
        // //     category: { $in: [_id] }
        // // }).countDocuments();

        // if (checkSubCategory > 0 || checkProduct > 0) {
        //     return response.status(400).json({
        //         message: "Category is already use can't delete",
        //         error: true,
        //         success: false
        //     })
        // }


        const deleteCategory = await CategoryModel.deleteOne({ _id: _id })

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


exports.getCategoryMetaDescription = async (req, res) => {
  console.log("Requested categoryurl:", req.params.categoryurl);

  try {
    const data = await CategoryModel.findOne({ url: req.params.categoryurl });

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
    console.error("Backend Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getCategoryIDMetaDescription = async (req, res) => {
  console.log(req.params.categoryId, "hello");
  id= req.params.categoryId

  try {
    const data = await CategoryModel.findOne({ _id: req.params.categoryId });

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

exports.createMetaCategoryController = async (req, res) => {
  // req.body.data is already an object
  const id = req.body.data;

  const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    const {
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
    } = id;

    const updatedMeta = {
      $set: {
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
        timeStamp: Date.now(),
      },
    };

    await CategoryModel
      .updateOne({ _id: id.categoryId }, updatedMeta, { new: true })
      .then(() => res.status(200).send("Blog Meta Data Saved Successfully"))
      .catch((err) => res.status(404).send(err));
  } catch (error) {
    console.log("error :", error);
    res.status(500).send("Internal Server Error");
  }
};
