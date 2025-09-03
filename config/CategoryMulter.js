const multer = require('multer');
// Multer setup
const storage = multer.diskStorage({
    destination: './uploads/category',
    filename: (req, file, cb) => {
        // console.log(req);
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const category_upload = multer({ storage });

module.exports = category_upload;