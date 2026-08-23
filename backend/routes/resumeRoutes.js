const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { protect } = require("../middleware/authMiddleware");
const {
  uploadResume,
  getMyResume,
  deleteMyResume,
} = require("../controllers/resumeController");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "resumes");

// Created once at startup if it doesn't already exist — multer's
// diskStorage does NOT create missing directories itself and will
// error every upload if this folder is absent.
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // req.user is set by `protect`, which runs before this via
    // router.use(protect) below — safe to rely on here.
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error("Only PDF and Word documents (.pdf, .doc, .docx) are allowed"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// multer errors (wrong file type, too large) are passed to Express's
// error-handling convention, not thrown normally — wrapping it here so
// the candidate gets a clean JSON message instead of Express's default
// HTML error page.
const handleUpload = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Upload failed",
      });
    }
    next();
  });
};

router.use(protect);

router.post("/", handleUpload, uploadResume);
router.get("/me", getMyResume);
router.delete("/me", deleteMyResume);

module.exports = router;