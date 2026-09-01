const mongoose = require("mongoose");

const codingSubmissionSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodingProblem",
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    // Overall verdict across all test cases.
    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Runtime Error",
        "Compilation Error",
        "Error",
      ],
      default: "Error",
    },

    testCasesPassed: {
      type: Number,
      default: 0,
    },

    totalTestCases: {
      type: Number,
      default: 0,
    },

    // Per-test-case results. Hidden test cases keep their input/expected
    // output stripped before this is ever sent back to the candidate —
    // see codingPracticeController — only pass/fail is shown for those.
    results: [
      {
        isHidden: { type: Boolean, default: true },
        input: { type: String, default: "" },
        expectedOutput: { type: String, default: "" },
        actualOutput: { type: String, default: "" },
        passed: { type: Boolean, default: false },
        statusDescription: { type: String, default: "" },
        stderr: { type: String, default: "" },
        compileOutput: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CodingSubmission", codingSubmissionSchema);