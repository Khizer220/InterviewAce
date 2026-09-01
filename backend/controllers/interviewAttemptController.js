const InterviewAttempt = require("../models/InterviewAttempt");
const InterviewTemplate = require("../models/InterviewTemplate");
const { evaluateInterview } = require("../services/aiService");

// ======================================
// Create Interview Attempt
// ======================================
exports.createInterviewAttempt = async (req, res) => {
  try {
    const {
      candidate,
      interview,
      answers,
    } = req.body;

    if (!interview || !answers) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    // Prefer authenticated user
    const candidateId = req.user?._id || candidate;

    if (!candidateId) {
      return res.status(401).json({
        success: false,
        message: "Candidate authentication required.",
      });
    }

    // ======================================
    // Load Interview First
    // ======================================

    const interviewData =
      await InterviewTemplate.findById(interview)
        .populate("questions");

    if (!interviewData) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    // ======================================
    // Save Interview Attempt
    // ======================================

    const attempt = await InterviewAttempt.create({
      candidate: candidateId,
      interview,
      answers,
      totalQuestions: answers.length,
      startedAt: new Date(),
      submittedAt: new Date(),
      status: "Completed",
    });

    // ======================================
    // AI Evaluation
    // ======================================

    try {
      const aiResponse = await evaluateInterview(
        interviewData,
        answers
      );

      const result =
        typeof aiResponse === "string"
          ? JSON.parse(aiResponse)
          : aiResponse;

      // ======================================
      // Get Valid AI Score
      // ======================================

      let score = Number(result.overallScore);

      if (!Number.isFinite(score)) {
        score = 0;
      }

      // Keep score between 0 and 100
      score = Math.max(
        0,
        Math.min(100, Math.round(score))
      );

      // Percentage is derived from the actual score.
      // Do NOT depend on Gemini returning percentage.
      const percentage = score;

      // ======================================
      // Update Attempt
      // ======================================

      attempt.score = score;
      attempt.percentage = percentage;

      attempt.aiFeedback =
        result.overallFeedback || "";

      attempt.strengths =
        Array.isArray(result.strengths)
          ? result.strengths
          : [];

      attempt.improvements =
        Array.isArray(result.improvements)
          ? result.improvements
          : [];

      attempt.status = "Evaluated";

      await attempt.save();

    } catch (aiError) {
      console.error(
        "AI Evaluation Error:",
        aiError
      );

      // Keep the interview attempt even if
      // AI evaluation fails.
      attempt.status = "Completed";

      await attempt.save();
    }

    // ======================================
    // Return Attempt
    // ======================================

    const populatedAttempt =
      await InterviewAttempt.findById(
        attempt._id
      ).populate("interview");

    return res.status(201).json({
      success: true,
      message: "Interview submitted successfully.",
      attempt: populatedAttempt,
    });

  } catch (error) {
    console.error(
      "Create Interview Attempt Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Logged-in Candidate Attempts
// ======================================

exports.getMyAttempts = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const attempts =
      await InterviewAttempt.find({
        candidate: req.user._id,
      })
        .populate("interview")
        .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });

  } catch (error) {
    console.error(
      "Get My Attempts Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Candidate Attempts
// ======================================

exports.getCandidateAttempts = async (req, res) => {
  try {
    const attempts =
      await InterviewAttempt.find({
        candidate: req.params.id,
      })
        .populate("interview")
        .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });

  } catch (error) {
    console.error(
      "Get Candidate Attempts Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Single Attempt
// ======================================

exports.getInterviewAttempt = async (req, res) => {
  try {
    const attempt =
      await InterviewAttempt.findById(
        req.params.id
      )
        .populate("candidate")
        .populate("interview")
        .populate("answers.question");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Interview Attempt not found.",
      });
    }

    return res.status(200).json({
      success: true,
      attempt,
    });

  } catch (error) {
    console.error(
      "Get Interview Attempt Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};