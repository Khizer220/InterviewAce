const CodingProblem = require("../models/CodingProblem");
const CodingSubmission = require("../models/CodingSubmission");
const { evaluateCodeSubmission } = require("../services/aiService");

const SUPPORTED_LANGUAGES = ["python", "javascript", "java", "cpp", "c"];

// ======================================
// Get Published Problems (candidate-facing)
// ======================================

const getPublishedProblems = async (req, res) => {
  try {
    const { difficulty, category, language, search } = req.query;

    const filter = { status: "Published" };

    if (difficulty && ["Beginner", "Intermediate", "Advanced"].includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    if (category) filter.category = category;
    if (language) filter.languages = language;

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const problems = await CodingProblem.find(filter)
      .select("-testCases") // hidden + visible test cases stay server-side until a problem is opened
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error("Get Published Problems Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coding problems",
    });
  }
};

// ======================================
// Get One Published Problem
// Hidden test cases' input/expectedOutput are stripped — a candidate
// should never see them, only whether their submission passed.
// ======================================

const getPublishedProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findOne({
      _id: req.params.id,
      status: "Published",
    }).populate("category", "name");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const problemObj = problem.toObject();

    problemObj.testCases = (problemObj.testCases || []).map((tc) =>
      tc.isHidden ? { isHidden: true } : tc
    );

    return res.status(200).json({
      success: true,
      problem: problemObj,
    });
  } catch (error) {
    console.error("Get Published Problem Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch problem",
    });
  }
};

// ======================================
// Submit Code
// AI-evaluated via Gemini — NOT real sandboxed execution. Gemini reads
// the code and reasons about what it would output for each test case.
// Good for typical logic problems; can occasionally be wrong in ways
// real execution never would be (exact whitespace, subtle runtime
// errors, infinite loops). Labeled "AI Evaluated" on the frontend for
// that reason, matching the same labeling already used for interview
// scoring elsewhere in the app.
// ======================================

const submitCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problemId = req.params.id;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: "Code is required" });
    }

    if (!language || !SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language. Supported: ${SUPPORTED_LANGUAGES.join(", ")}`,
      });
    }

    const problem = await CodingProblem.findOne({ _id: problemId, status: "Published" });

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This problem has no test cases configured yet.",
      });
    }

    let aiResponse = await evaluateCodeSubmission({
      title: problem.title,
      description: problem.description,
      language,
      code,
      testCases: problem.testCases,
    });

    aiResponse = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    let evaluation;
    try {
      evaluation = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("AI Code Evaluation Parse Error:", parseError, aiResponse);
      return res.status(500).json({
        success: false,
        message: "AI returned an invalid response. Please try submitting again.",
      });
    }

    if (
      !Array.isArray(evaluation.testCaseResults) ||
      evaluation.testCaseResults.length !== problem.testCases.length
    ) {
      return res.status(500).json({
        success: false,
        message: "AI evaluation didn't cover every test case. Please try submitting again.",
      });
    }

    const results = problem.testCases.map((testCase, index) => {
      const r = evaluation.testCaseResults[index] || {};
      return {
        isHidden: !!testCase.isHidden,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: r.predictedOutput || "",
        passed: !evaluation.compilationError && !!r.passed,
        statusDescription: evaluation.compilationError
          ? "Compilation Error"
          : r.passed
          ? "Accepted"
          : "Wrong Answer",
        stderr: "",
        compileOutput: evaluation.compilationError ? evaluation.compilationErrorMessage || "" : "",
      };
    });

    const testCasesPassed = results.filter((r) => r.passed).length;
    const totalTestCases = results.length;

    let overallStatus;
    if (evaluation.compilationError) {
      overallStatus = "Compilation Error";
    } else if (testCasesPassed === totalTestCases) {
      overallStatus = "Accepted";
    } else {
      overallStatus = "Wrong Answer";
    }

    const submission = await CodingSubmission.create({
      candidate: req.user._id,
      problem: problem._id,
      code,
      language,
      status: overallStatus,
      testCasesPassed,
      totalTestCases,
      results,
    });

    // Update real submission stats on the problem — these were always
    // 0 before since nothing wrote to them.
    problem.totalSubmissions += 1;
    if (overallStatus === "Accepted") {
      problem.acceptedSubmissions += 1;
    }
    problem.acceptanceRate =
      problem.totalSubmissions > 0
        ? Math.round((problem.acceptedSubmissions / problem.totalSubmissions) * 1000) / 10
        : 0;
    await problem.save();

    // Strip hidden test case details before responding — pass/fail
    // only, never the hidden input/expected/predicted output.
    const responseResults = results.map((r) =>
      r.isHidden
        ? { isHidden: true, passed: r.passed, statusDescription: r.statusDescription }
        : r
    );

    return res.status(201).json({
      success: true,
      submission: {
        _id: submission._id,
        status: overallStatus,
        testCasesPassed,
        totalTestCases,
        results: responseResults,
        aiEvaluated: true,
        overallFeedback: evaluation.overallFeedback || "",
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error("Submit Code Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit code",
    });
  }
};

// ======================================
// Get My Submissions For a Problem
// ======================================

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await CodingSubmission.find({
      candidate: req.user._id,
      problem: req.params.id,
    })
      .select("-results.input -results.expectedOutput -results.actualOutput")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Get My Submissions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
    });
  }
};

module.exports = {
  getPublishedProblems,
  getPublishedProblem,
  submitCode,
  getMySubmissions,
};