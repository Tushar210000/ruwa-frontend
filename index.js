// server.js or index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./connection');
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
const popupRoutes = require("./routes/PopupRouter");
const contactRoutes = require("./routes/contactRoutes");
const janArogyaRoutes=require("./routes/janArogyaRoutes")
app.use("/api/popup", popupRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services/janarogya",janArogyaRoutes)
// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
