const mongoose = require("mongoose");

const applyInsuranceSchema = new mongoose.Schema({
  fullName: String,
  dob: String,
  gender: String,
  email: String,
  phoneNumber: String,
  aadhaarNumber: String,
  address: String,
  state: String,
  district: String,
  pincode: String,
  insuranceType: String,

  id_proof: Buffer,
  passport_photo: Buffer,
  medical_documents: Buffer,
  income_certificate: Buffer,

  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  forUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("ApplyInsuranceApplication", applyInsuranceSchema);
