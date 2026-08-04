const mongoose = require("mongoose");

const interviewTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewCategory",
      required: true,
    },

    interviewType: {
      type: String,
      enum: ["HR", "Technical", "Aptitude", "Mixed"],
      default: "Technical",
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    duration: {
      type: Number,
      required: true,
      min: 5,
    },

    instructions: {
      type: String,
      default: "",
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    status: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InterviewTemplate",
  interviewTemplateSchema
);