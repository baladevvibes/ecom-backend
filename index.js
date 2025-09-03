const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const db = require("./config/db");
const path = require('path');

require('dotenv').config();
const cookieParser = require("cookie-parser");
const userRoutes = require('./route/UserRouters');
const productRoutes = require('./route/productRoutes');
const orderRoutes = require('./route/OrderRoutes');
const categoryRouter = require("./route/CategoryRoute");
const subCategoryRouter = require("./route/subCategoryRoute");
const paymentRouter = require('./route/PaymentRoute');
db;

const app = express();

// ✅ Use ONLY THIS ONE CORS setup
// app.use(cors({
//   origin: 'https://www.masterkeynotes.com',
//   credentials: true
// }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/v1', orderRoutes);
app.use("/api/category",categoryRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/v1",paymentRouter)

app.get("/", (req, res) => {
    res.json({
        message: "server is running"
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
