const JanarogyaApplication = require('../model/janArogyaApplication');
const User = require('../model/user');

// Fetch user's applications
exports.getJanarogyaApplications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const applications = await JanarogyaApplication.find({ userId: user._id });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error: error.message });
  }
};

// Withdraw an application
exports.withdrawApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const applicationId = req.params.id;
    const application = await JanarogyaApplication.findOne({ _id: applicationId, userId: user._id });

    if (!application) {
      return res.status(404).json({ message: "Application not found or access denied." });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: "Only pending applications can be withdrawn." });
    }

    application.status = 'withdrawn';
    await application.save();

    res.status(200).json({ message: "Application withdrawn successfully.", application });
  } catch (error) {
    res.status(500).json({ message: "Error withdrawing application", error: error.message });
  }
};

// Apply for Jan Arogya
exports.applyJanarogya = async (req, res) => {
    console.log("api hitok")
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    const { fullName, mobileNumber, aadhaarNumber, state, district } = req.body;

    const files = {
  incomeCertificate: req.files['income_certificate']?.[0]?.originalname ,
  casteCertificate: req.files['caste_certificate']?.[0]?.originalname ,
  rationId: req.files['ration_id']?.[0]?.originalname || null,
};


    const newApplication = new JanarogyaApplication({
      userId: user._id,
      fullName,
      mobileNumber,
      aadhaarNumber,
      state,
      district,
      files,
      status: 'pending',
    });

    await newApplication.save();

    res.status(201).json({
      message: "Jan Arogya application submitted successfully!",
      applicationId: newApplication._id,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Aadhaar number already exists." });
    }
    console.error("Application error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all applications (Admin only)
exports.getAllApplications = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const applications = await JanarogyaApplication.find({});
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error: error.message });
  }
};

// Update status (Admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { id } = req.params;
    const { status } = req.body;

    const application = await JanarogyaApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ message: "Status updated successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};
