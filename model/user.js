const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true, required: true },
  password: String,
  isVerified: { type: Boolean, default: true }
});
module.exports = mongoose.model("User", userSchema);
