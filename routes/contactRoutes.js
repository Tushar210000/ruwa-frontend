// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const { submitContact, getAllEnquiry } = require("../controllers/contactController");

router.post("/submit", submitContact);
router.get("/getAll", getAllEnquiry);

module.exports = router;
