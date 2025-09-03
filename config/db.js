const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

mongoose.Promise = global.Promise;

// Connect MongoDB
mongoose.connect(process.env.CONT_STR)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });
