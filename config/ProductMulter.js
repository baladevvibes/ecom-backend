const multer = require('multer');
// Multer setup
const storage = multer.diskStorage({
    destination: './uploads/product',
    filename: (req, file, cb) => {
        // console.log(req);
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const product_upload = multer({ storage });

module.exports = product_upload;