const {
  generateInterviewQuestions,
  generateMCQQuestions,
} = require("../services/aiService");

exports.generateQuestions = async (req, res) => {
  try {
    let result = await generateInterviewQuestions(req.body);

    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(result);

    res.status(200).json({
      success: true,
      questions,
    });

  } catch (err) {
  console.error("========== AI ERROR ==========");
  console.error(err);

  if (err.response) {
    console.error(err.response.data);
  }

  console.error("==============================");

  res.status(500).json({
    success: false,
    message: err.message,
    error: err,
  });
}
};

exports.generateMCQ = async (req, res) => {
  try {
    let result = await generateMCQQuestions(req.body);

    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(result);

    // Defensive check: silently drop any AI-returned question that doesn't
    // have exactly 4 options — better than saving a malformed MCQ that
    // would break rendering on the candidate side later.
    const validQuestions = questions.filter(
      (q) => Array.isArray(q.options) && q.options.length === 4
    );

    res.status(200).json({
      success: true,
      questions: validQuestions,
    });

  } catch (err) {
    console.error("========== AI MCQ ERROR ==========");
    console.error(err);

    if (err.response) {
      console.error(err.response.data);
    }

    console.error("===================================");

    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};