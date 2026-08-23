const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // One resume per candidate — uploading again replaces it (see
    // resumeController.uploadResume), matching the "Replace" action
    // in the plan rather than keeping a history of old resumes.
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    originalFileName: {
      type: String,
      required: true,
    },

    // Name the file is actually saved as on disk — kept separate from
    // originalFileName so we can safely delete/replace the right file
    // even if two candidates upload files with the same name.
    storedFileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      enum: ["pdf", "docx"],
      required: true,
    },

    fileSizeBytes: {
      type: Number,
      required: true,
    },

    // ================================
    // Phase 2/3 — AI analysis fields.
    // Present now so this doesn't need another migration later, but
    // nothing writes to these until the AI analysis step is built.
    // Every resume sits at "Pending Analysis" until then — genuinely,
    // not as a placeholder number.
    // ================================

    analysisStatus: {
      type: String,
      enum: ["Pending Analysis", "Analyzed", "Analysis Failed"],
      default: "Pending Analysis",
    },

    extractedText: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    experience: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    projects: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    certifications: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    preferredRoles: {
      type: [String],
      default: [],
    },

    suggestedRoles: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    analyzedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);