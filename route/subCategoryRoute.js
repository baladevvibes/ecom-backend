

const sub_category_upload = require("../config/SubCategoryMulter");
const { AddSubCategoryController, getSubCategoryController } = require("../controller/SubCategoryController");
const auth = require("../middleware/auth");
const subCategoryRouter   = require("express").Router();

subCategoryRouter.post("/create",auth,sub_category_upload.single("image"),AddSubCategoryController)
subCategoryRouter.get('/get',getSubCategoryController)


module.exports = subCategoryRouter ;