const Question = require("../models/Question");

// =============================
// Create Question (Manual)
// =============================
const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Save AI Questions
// =============================
const saveAIQuestions = async (req, res) => {
  try {
    const { category, questions } = req.body;

    if (!category || !questions || !questions.length) {
      return res.status(400).json({
        success: false,
        message: "Category and questions are required.",
      });
    }

    const savedQuestions = [];

    for (const q of questions) {
      const question = await Question.create({
        category,

        question: q.question,

        expectedAnswer: q.expectedAnswer || "",

        topic: q.topic || "",

        followUpQuestion:
          q.followUpQuestion || "",

        evaluationCriteria:
          q.evaluationCriteria || [],

        difficulty:
          q.difficulty || "Beginner",

        marks: 5,

        source: "AI",
      });

      savedQuestions.push(question);
    }

    res.status(201).json({
      success: true,
      message: "AI Questions saved successfully.",
      questions: savedQuestions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Questions
// =============================
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Questions By Category
// =============================
const getQuestionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const questions = await Question.find({
      category: categoryId,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Question
// =============================
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Question
// =============================
const deleteQuestion = async (req, res) => {
  try {
    const question =
      await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  saveAIQuestions,
  getQuestions,
  getQuestionsByCategory,
  updateQuestion,
  deleteQuestion,
};