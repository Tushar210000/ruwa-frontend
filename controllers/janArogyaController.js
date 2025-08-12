const JanArogyaApplication = require("../model/janArogyaApplication");

const buildApplication = async (req, res, forUserId) => {
  try {
    const { name, aadhar, mobile, state, district } = req.body;

    // Check duplicate Aadhaar
    const existing = await JanArogyaApplication.findOne({ aadhar });
    if (existing) {
      return res.status(400).json({ message: "Aadhaar number already registered" });
    }

    const app = new JanArogyaApplication({
      name,
      aadhar,
      mobile,
      state,
      district,
      appliedBy: req.user.id,
      forUser: forUserId,

      income_certificate: req.files?.income_certificate?.[0]?.buffer || null,
      caste_certificate: req.files?.caste_certificate?.[0]?.buffer || null,
      ration_id: req.files?.ration_id?.[0]?.buffer || null
    });

    await app.save();
    res.status(201).json({ message: "Application submitted", app });

  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: "Error applying", error: err.message });

  }
};

exports.userApplyJanarogya = (req, res) => buildApplication(req, res, req.user.id);

exports.applyJanarogya = (req, res) => {
  if (!req.body.forUserId) {
    return res.status(400).json({ message: "forUserId is required" });
  }
  return buildApplication(req, res, req.body.forUserId);
};

exports.getUserApplication = async (req, res) => {
  try {
    const apps = await JanArogyaApplication.find({ forUser: req.user.id });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user application", error: err.message });
  }
};

exports.getJanarogyaApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApplication.find({ appliedBy: req.user.id }).populate("forUser", "name email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications", error: err.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApplication.find().populate("appliedBy forUser", "name role email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all applications", error: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const app = await JanArogyaApplication.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ message: "Status updated", app });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

exports.withdrawApplication = async (req, res) => {
  try {
    const app = await JanArogyaApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const isOwner = String(app.appliedBy) === req.user.id;
    const isForUser = String(app.forUser) === req.user.id;
    if (!isOwner && !isForUser) {
      return res.status(403).json({ message: "Not authorized" });
    }

    app.status = "WITHDRAWN";
    await app.save();
    res.json({ message: "Application withdrawn", app });
  } catch (err) {
    res.status(500).json({ message: "Error withdrawing application", error: err.message });
  }
};
