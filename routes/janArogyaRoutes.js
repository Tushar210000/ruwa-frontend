const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // ✅ New middleware
const janarogyaController = require('../controllers/janArogyaController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// User-facing routes
router.post(
  '/apply',
  auth,
  upload.fields([
    { name: 'income_certificate', maxCount: 1 },
    { name: 'caste_certificate', maxCount: 1 },
    { name: 'ration_id', maxCount: 1 }
  ]),
  janarogyaController.applyJanarogya
);

router.get('/my-applications', auth, janarogyaController.getJanarogyaApplications);

router.patch('/withdraw/:id', auth, janarogyaController.withdrawApplication);

// Admin-specific routes (you can add role-checking later)
router.get('/admin/all-applications', auth, janarogyaController.getAllApplications);
router.patch('/admin/update-status/:id', auth, janarogyaController.updateApplicationStatus);

module.exports = router;
