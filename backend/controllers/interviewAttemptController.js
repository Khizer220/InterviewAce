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

    if (!candidate || !interview || !answers) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    // Save Interview Attempt
    const attempt = await InterviewAttempt.create({
      candidate,
      interview,
      answers,
      totalQuestions: answers.length,
      startedAt: new Date(),
      submittedAt: new Date(),
    });

    // Load Interview Questions
    const interviewData = await InterviewTemplate.findById(
      interview
    ).populate("questions");

    // Evaluate with Gemini
    const aiResponse = await evaluateInterview(
      interviewData,
      answers
    );

    const result = JSON.parse(aiResponse);

    // Update Attempt
    attempt.score = result.overallScore || 0;
    attempt.percentage = result.percentage || 0;
    attempt.aiFeedback = result.overallFeedback || "";
    attempt.strengths = result.strengths || [];
    attempt.improvements = result.improvements || [];
    attempt.status = "Evaluated";

    await attempt.save();

    res.status(201).json({
      success: true,
      message: "Interview evaluated successfully.",
      attempt,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
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
    const attempts = await InterviewAttempt.find({
      candidate: req.params.id,
    })
      .populate("interview")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      attempts,
    });

  } catch (error) {
    res.status(500).json({
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
    const attempt = await InterviewAttempt.findById(
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

    res.status(200).json({
      success: true,
      attempt,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};