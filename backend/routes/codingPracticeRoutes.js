const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getPublishedProblems,
  getPublishedProblem,
  submitCode,
  getMySubmissions,
} = require("../controllers/codingPracticeController");

// Every route here needs to know exactly which candidate is acting —
// submitCode in particular must never trust a client-supplied
// candidate ID, so this whole router requires a verified token.
router.use(protect);

router.get("/", getPublishedProblems);
router.get("/:id", getPublishedProblem);
router.post("/:id/submit", submitCode);
router.get("/:id/submissions", getMySubmissions);

module.exports = router;