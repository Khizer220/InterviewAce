const express = require("express");

const router = express.Router();

const {
  createQuestion,
  saveAIQuestions,
  saveAIMCQQuestions,
  getQuestions,
  getQuestionsByCategory,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

// ==========================
// Create Manual Question
// ==========================
router.post("/", createQuestion);

// ==========================
// Save AI Generated Questions
// ==========================
router.post("/save-ai", saveAIQuestions);

// ==========================
// Save AI Generated MCQ Questions
// ==========================
router.post("/save-ai-mcq", saveAIMCQQuestions);

// ==========================
// Get All Questions
// ==========================
router.get("/", getQuestions);

// ==========================
// Get Questions By Category
// ==========================
router.get("/category/:categoryId", getQuestionsByCategory);

// ==========================
// Update Question
// ==========================
router.put("/:id", updateQuestion);

// ==========================
// Delete Question
// ==========================
router.delete("/:id", deleteQuestion);

module.exports = router;