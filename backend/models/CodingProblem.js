const mongoose = require("mongoose");

const codingProblemSchema = new mongoose.Schema(
  {
    // ======================================
    // BASIC INFORMATION
    // ======================================

    title: {
      type: String,
      required: [true, "Problem title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
    },

    // ======================================
    // CATEGORY
    // Uses the existing Category collection
    // ======================================

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewCategory",
      required: [true, "Category is required"],
    },

    // ======================================
    // DIFFICULTY
    // ======================================

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: [true, "Difficulty is required"],
    },

    // ======================================
    // PROGRAMMING LANGUAGES
    // ======================================

    languages: [
      {
        type: String,
        trim: true,
      },
    ],

    // ======================================
    // PROBLEM DETAILS
    // ======================================

    inputFormat: {
      type: String,
      default: "",
    },

    outputFormat: {
      type: String,
      default: "",
    },

    constraints: [
      {
        type: String,
        trim: true,
      },
    ],

    // ======================================
    // EXAMPLES
    // ======================================

    examples: [
      {
        input: {
          type: String,
          default: "",
        },

        output: {
          type: String,
          default: "",
        },

        explanation: {
          type: String,
          default: "",
        },
      },
    ],

    // ======================================
    // STARTER CODE
    // ======================================

    starterCode: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ======================================
    // TEST CASES
    // ======================================

    testCases: [
      {
        input: {
          type: String,
          default: "",
        },

        expectedOutput: {
          type: String,
          default: "",
        },

        isHidden: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // ======================================
    // HINTS
    // ======================================

    hints: [
      {
        type: String,
        trim: true,
      },
    ],

    // ======================================
    // COMPLEXITY
    // ======================================

    timeComplexity: {
      type: String,
      default: "",
    },

    spaceComplexity: {
      type: String,
      default: "",
    },

    // ======================================
    // AI INFORMATION
    // ======================================

    generatedByAI: {
      type: Boolean,
      default: true,
    },

    aiInstructions: {
      type: String,
      default: "",
    },

    // ======================================
    // STATUS
    // ======================================

    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },

    // ======================================
    // SUBMISSION STATISTICS
    // These will be updated by the submission
    // system later.
    // ======================================

    totalSubmissions: {
      type: Number,
      default: 0,
      min: 0,
    },

    acceptedSubmissions: {
      type: Number,
      default: 0,
      min: 0,
    },

    acceptanceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CodingProblem",
  codingProblemSchema
);