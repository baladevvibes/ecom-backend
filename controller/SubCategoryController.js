const SubCategoryModel = require("../model/SubCategoryModel")


exports.AddSubCategoryController = async (req, res) => {
    const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    try {
        const { file, body } = req; // Destructure for cleaner code
        console.log(req.body);

        if (!file) return res.status(400).send('No file uploaded.');

        const subcategory = await SubCategoryModel.create({
            ...req.body,
            image: req.file?.path,
            ipAddress: req.ip,
        })

        const save = await subcategory.save()

        return res.json({
            message: "Sub Category Created",
            data: save,
            error: false,
            success: true
        })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

exports.getSubCategoryController = async(req,res)=>{
    try {
        const data = await SubCategoryModel.find().sort({createdAt : -1}).populate('category')
        return res.json({
            message : "Sub Category data",
            data : data,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}