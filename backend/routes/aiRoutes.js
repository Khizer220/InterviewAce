const express = require("express");
const router = express.Router();

const {
  generateQuestions,
  generateMCQ,
} = require("../controllers/aiController");

router.post("/generate-questions", generateQuestions);

router.post("/generate-mcq", generateMCQ);

module.exports = router;