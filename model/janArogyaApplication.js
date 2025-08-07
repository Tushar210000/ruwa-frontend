const mongoose = require("mongoose");
const janarogyaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  aadhaarNumber: { type: String, unique: true, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  files: {
    
    incomeCertificate: { type: String ,required:true},
    casteCertificate: { type: String ,required:true},
    rationId: { type: String,required:true },
  },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("JanarogyaApplication", janarogyaSchema);