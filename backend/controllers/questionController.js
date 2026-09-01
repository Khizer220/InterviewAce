const Question = require("../models/Question");

// =============================
// Create Question (Manual)
// Works for both Coding and MCQ questions unchanged — MCQ fields
// (options, correctAnswer) just pass through req.body like everything
// else, since the Question schema already supports them.
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
// Save AI Questions (Coding / interview-style)
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
// Save AI-Generated MCQ Questions
// Separate from saveAIQuestions because the shape is genuinely
// different (options/correctAnswer vs expectedAnswer/evaluationCriteria)
// rather than overloading one function with branching logic.
// =============================
const saveAIMCQQuestions = async (req, res) => {
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
      // Skip anything malformed rather than failing the whole batch —
      // a partial save with a clear count is more useful than losing
      // every valid question because one was bad.
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        continue;
      }

      const question = await Question.create({
        category,

        question: q.question,

        options: q.options,

        correctAnswer:
          typeof q.correctAnswer === "number" ? q.correctAnswer : 0,

        topic: q.topic || "",

        difficulty: q.difficulty || "Beginner",

        marks: 5,

        source: "AI",
      });

      savedQuestions.push(question);
    }

    res.status(201).json({
      success: true,
      message: `${savedQuestions.length} of ${questions.length} MCQ questions saved successfully.`,
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
// Populate now includes category "type" too, so the frontend can tell
// whether a question belongs to a Coding or MCQ category without a
// second lookup.
// =============================
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("category", "name type")
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
      .populate("category", "name type")
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
  saveAIMCQQuestions,
  getQuestions,
  getQuestionsByCategory,
  updateQuestion,
  deleteQuestion,
};