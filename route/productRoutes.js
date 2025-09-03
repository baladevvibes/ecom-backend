const { getSingleProduct, getAllProducts, getCreateProduct, deleteProductController, updateProductController, createMetaProductController, getProductIDMetaDescription, getProductMetaDescription, createProductReview } = require("../controller/productController");
const auth = require("../middleware/auth");
const product_upload = require("../config/ProductMulter");
const productRouter   = require("express").Router()

productRouter.get('/get',getAllProducts)
productRouter.post('/create',auth ,product_upload.single("image") ,getCreateProduct)
productRouter.get("/get/:id", getSingleProduct);

productRouter.put("/update/:id",auth,product_upload.single("image"),updateProductController)
productRouter.delete("/delete/:id",auth,deleteProductController)

productRouter.route("/createmetaproduct").post(createMetaProductController);
productRouter.route("/metaproducturl/:producturl").get(getProductMetaDescription);
productRouter.route("/metaproductId/:productId").get(getProductIDMetaDescription);
productRouter.post("/review/:productReviewId", createProductReview);


module.exports = productRouter;