const mongoose = require("mongoose");

const interviewCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "",
    },

    // Determines which section of the admin Questions page this
    // category's questions belong to, and which question-shape the
    // Add/Edit forms use for it:
    //   Q&A     — expectedAnswer / evaluationCriteria (interview-style)
    //   Coding  — reserved for the separate Coding-problems system
    //   MCQ     — options / correctAnswer
    // Existing categories created before this field existed have no
    // stored value, so they default to "Q&A" — the accurate label for
    // what their questions actually contain (expectedAnswer-based),
    // not "Coding" as originally assumed.
    type: {
      type: String,
      enum: ["Q&A", "Coding", "MCQ"],
      default: "Q&A",
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    duration: {
      type: Number,
      default: 30,
    },

    totalQuestions: {
      type: Number,
      default: 10,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InterviewCategory",
  interviewCategorySchema
);