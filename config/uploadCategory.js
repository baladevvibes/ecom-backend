const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadPath = path.join(__dirname, "../uploads/book_card");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// exports.UploadImages = (req,res) =>{
//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({ success: 0, message: "No file uploaded" });
//     }
  
//     const imageUrl = `http://localhost:8000/uploads/${file.filename}`;
  
//     return res.status(200).json({
//       success: 1,
//       file: { url: imageUrl },
//     });
// }


module.exports = router;
