const category_upload = require("../config/CategoryMulter");
const { AddCategoryController, getCategoryController, updateCategoryController, deleteCategoryController, createMetaCategoryController, getCategoryMetaDescription, getCategoryIDMetaDescription } = require("../controller/CategoryController");
const auth = require("../middleware/auth");


const categoryRouter  = require("express").Router();
categoryRouter.post("/add-category",auth,category_upload.single("image"),AddCategoryController)
categoryRouter.get('/get',getCategoryController)
categoryRouter.put("/update/:id",auth,category_upload.single("image"),updateCategoryController)
categoryRouter.delete("/delete/:id",auth,deleteCategoryController)
categoryRouter.route("/createmetacategory").post(createMetaCategoryController);
categoryRouter.route("/metacategoryurl/:categoryurl").get(getCategoryMetaDescription);
categoryRouter.route("/metacategoryId/:categoryId").get(getCategoryIDMetaDescription);


categoryRouter.route('/upload-image').post(category_upload.single('image'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: 0, message: 'No file uploaded' });
    }
  
    const imageUrl = `http://localhost:5000/uploads/category/${file.filename}`;
    console.log("alert",imageUrl);
    
    return res.status(200).json({
      success: 1,
      file: { url: imageUrl },
    });
  });


module.exports = categoryRouter ;
