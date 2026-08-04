const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewCategory",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    // Only for MCQ questions
    options: {
      type: [String],
      default: [],
    },

    // Only for MCQ questions
    correctAnswer: {
      type: Number,
      default: null,
    },

    // For AI interview questions
    expectedAnswer: {
      type: String,
      default: "",
    },

    topic: {
      type: String,
      default: "",
    },

    evaluationCriteria: {
      type: [String],
      default: [],
    },

    followUpQuestion: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      enum: ["Manual", "AI"],
      default: "Manual",
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    marks: {
      type: Number,
      default: 5,
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

module.exports = mongoose.model("Question", questionSchema);