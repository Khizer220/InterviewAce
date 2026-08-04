const {
  generateInterviewQuestions,
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