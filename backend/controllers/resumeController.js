const fs = require("fs");
const path = require("path");

const Resume = require("../models/Resume");

const RESUME_DIR = path.join(__dirname, "..", "uploads", "resumes");

// ======================================
// Upload / Replace Resume
// One resume per candidate. If they already have one, the old file is
// deleted from disk and the record is updated in place rather than
// creating a second row — matches the "Replace" action in the plan.
// ======================================

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const fileType = ext === ".pdf" ? "pdf" : "docx";

    let resume = await Resume.findOne({ candidate: req.user._id });

    if (resume) {
      const oldPath = path.join(RESUME_DIR, resume.storedFileName);

      fs.unlink(oldPath, (err) => {
        // ENOENT just means the old file was already gone — fine to ignore.
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete old resume file:", err);
        }
      });

      resume.originalFileName = req.file.originalname;
      resume.storedFileName = req.file.filename;
      resume.fileUrl = `/uploads/resumes/${req.file.filename}`;
      resume.fileType = fileType;
      resume.fileSizeBytes = req.file.size;

      // A fresh upload means any previous AI analysis no longer applies
      // to this file — reset it rather than leaving stale analysis
      // attached to a resume that's actually been replaced.
      resume.analysisStatus = "Pending Analysis";
      resume.extractedText = "";
      resume.skills = [];
      resume.education = [];
      resume.experience = [];
      resume.projects = [];
      resume.certifications = [];
      resume.suggestedRoles = [];
      resume.analyzedAt = null;

      await resume.save();
    } else {
      resume = await Resume.create({
        candidate: req.user._id,
        originalFileName: req.file.originalname,
        storedFileName: req.file.filename,
        fileUrl: `/uploads/resumes/${req.file.filename}`,
        fileType,
        fileSizeBytes: req.file.size,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error("Upload Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

// ======================================
// Get My Resume
// ======================================

const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ candidate: req.user._id });

    return res.status(200).json({
      success: true,
      resume: resume || null,
    });
  } catch (error) {
    console.error("Get My Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};

// ======================================
// Delete My Resume
// ======================================

const deleteMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ candidate: req.user._id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    const filePath = path.join(RESUME_DIR, resume.storedFileName);

    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Failed to delete resume file:", err);
      }
    });

    await Resume.findByIdAndDelete(resume._id);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};

module.exports = {
  uploadResume,
  getMyResume,
  deleteMyResume,
};