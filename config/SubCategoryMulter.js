const multer = require('multer');
// Multer setup
const storage = multer.diskStorage({
    destination: './uploads/sub_category',
    filename: (req, file, cb) => {
        // console.log(req);
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const sub_category_upload = multer({ storage });

module.exports = sub_category_upload;