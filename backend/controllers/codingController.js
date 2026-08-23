const CodingProblem = require("../models/CodingProblem");
const InterviewCategory = require("../models/InterviewCategory");
const { generateCodingProblems } = require("../services/aiService");

// ======================================
// GET ALL CODING PROBLEMS
// ======================================

const getCodingProblems = async (req, res) => {
  try {
    const {
      search,
      difficulty,
      category,
      language,
      status,
    } = req.query;

    const filter = {};

    // --------------------------------------
    // Difficulty
    // --------------------------------------

    if (
      difficulty &&
      ["Beginner", "Intermediate", "Advanced"].includes(difficulty)
    ) {
      filter.difficulty = difficulty;
    }

    // --------------------------------------
    // Category
    // --------------------------------------

    if (category) {
      filter.category = category;
    }

    // --------------------------------------
    // Language
    // --------------------------------------

    if (language) {
      filter.languages = language;
    }

    // --------------------------------------
    // Status
    // --------------------------------------

    if (
      status &&
      ["Draft", "Published", "Archived"].includes(status)
    ) {
      filter.status = status;
    }

    // --------------------------------------
    // Search
    // --------------------------------------

    if (search && search.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const problems = await CodingProblem.find(filter)
      .populate("category", "name description icon")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error("Get Coding Problems Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coding problems",
    });
  }
};

// ======================================
// GET SINGLE CODING PROBLEM
// ======================================

const getCodingProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id).populate(
      "category",
      "name description icon"
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Coding problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error("Get Coding Problem Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coding problem",
    });
  }
};

// ======================================
// CREATE CODING PROBLEM
// ======================================

const createCodingProblem = async (req, res) => {
  try {
    const problemData = req.body;

    if (
      !problemData.title ||
      !problemData.description ||
      !problemData.category ||
      !problemData.difficulty
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, category and difficulty are required",
      });
    }

    const problem = await CodingProblem.create({
      ...problemData,
      generatedByAI:
        typeof problemData.generatedByAI === "boolean"
          ? problemData.generatedByAI
          : true,
    });

    const populatedProblem = await CodingProblem.findById(
      problem._id
    ).populate("category", "name description icon");

    return res.status(201).json({
      success: true,
      message: "Coding problem created successfully",
      problem: populatedProblem,
    });
  } catch (error) {
    console.error("Create Coding Problem Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create coding problem",
    });
  }
};

// ======================================
// UPDATE CODING PROBLEM
// ======================================

const updateCodingProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name description icon");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Coding problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coding problem updated successfully",
      problem,
    });
  } catch (error) {
    console.error("Update Coding Problem Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update coding problem",
    });
  }
};

// ======================================
// DELETE CODING PROBLEM
// ======================================

const deleteCodingProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findByIdAndDelete(
      req.params.id
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Coding problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coding problem deleted successfully",
    });
  } catch (error) {
    console.error("Delete Coding Problem Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete coding problem",
    });
  }
};

// ======================================
// UPDATE CODING PROBLEM STATUS
// ======================================

const updateCodingProblemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Draft", "Published", "Archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coding problem status",
      });
    }

    const problem = await CodingProblem.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name description icon");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Coding problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coding problem status updated successfully",
      problem,
    });
  } catch (error) {
    console.error(
      "Update Coding Problem Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update coding problem status",
    });
  }
};

// ======================================
// CODING PROBLEM STATISTICS
// ======================================

const getCodingStatistics = async (req, res) => {
  try {
    const [
      totalProblems,
      beginner,
      intermediate,
      advanced,
      published,
      draft,
      archived,
    ] = await Promise.all([
      CodingProblem.countDocuments(),

      CodingProblem.countDocuments({
        difficulty: "Beginner",
      }),

      CodingProblem.countDocuments({
        difficulty: "Intermediate",
      }),

      CodingProblem.countDocuments({
        difficulty: "Advanced",
      }),

      CodingProblem.countDocuments({
        status: "Published",
      }),

      CodingProblem.countDocuments({
        status: "Draft",
      }),

      CodingProblem.countDocuments({
        status: "Archived",
      }),
    ]);

    const submissionStats = await CodingProblem.aggregate([
      {
        $group: {
          _id: null,

          totalSubmissions: {
            $sum: "$totalSubmissions",
          },

          acceptedSubmissions: {
            $sum: "$acceptedSubmissions",
          },
        },
      },
    ]);

    const submissionData = submissionStats[0] || {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    };

    const acceptanceRate =
      submissionData.totalSubmissions > 0
        ? Math.round(
            (submissionData.acceptedSubmissions /
              submissionData.totalSubmissions) *
              1000
          ) / 10
        : 0;

    return res.status(200).json({
      success: true,

      statistics: {
        totalProblems,

        difficulty: {
          beginner,
          intermediate,
          advanced,
        },

        status: {
          published,
          draft,
          archived,
        },

        totalSubmissions:
          submissionData.totalSubmissions,

        acceptedSubmissions:
          submissionData.acceptedSubmissions,

        acceptanceRate,
      },
    });
  } catch (error) {
    console.error(
      "Get Coding Statistics Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coding statistics",
    });
  }
};

// ======================================
// GENERATE CODING PROBLEMS WITH AI
// ======================================

const generateCodingProblemsWithAI = async (req, res) => {
  try {
    const {
      difficulty,
      language,
      category,
      numberOfProblems,
      instructions,
    } = req.body;

    // --------------------------------------
    // Validate input
    // --------------------------------------

    if (
      !difficulty ||
      !language ||
      !category ||
      !numberOfProblems
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Difficulty, language, category and number of problems are required",
      });
    }

    // --------------------------------------
    // Validate difficulty
    // --------------------------------------

    if (
      !["Beginner", "Intermediate", "Advanced"].includes(
        difficulty
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level",
      });
    }

    // --------------------------------------
    // Validate category
    // --------------------------------------

    const categoryData =
      await InterviewCategory.findById(category);

    if (!categoryData) {
      return res.status(404).json({
        success: false,
        message: "Selected category not found",
      });
    }

    // --------------------------------------
    // Validate number
    // --------------------------------------

    const count = Number(numberOfProblems);

    if (![1, 3, 5, 10].includes(count)) {
      return res.status(400).json({
        success: false,
        message:
          "Number of problems must be 1, 3, 5 or 10",
      });
    }

    // --------------------------------------
    // Generate with Gemini
    // --------------------------------------

    const aiResponse = await generateCodingProblems({
      category: categoryData.name,
      difficulty,
      language,
      numberOfProblems: count,
      instructions: instructions || "",
    });

    // --------------------------------------
    // Parse AI response
    // --------------------------------------

    let generatedProblems;

    try {
      generatedProblems = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error(
        "AI JSON Parse Error:",
        parseError
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned an invalid response. Please try again.",
      });
    }

    // --------------------------------------
    // Validate generated array
    // --------------------------------------

    if (
      !Array.isArray(generatedProblems) ||
      generatedProblems.length === 0
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI did not generate any coding problems.",
      });
    }

    // --------------------------------------
    // Attach category information
    // --------------------------------------

    const problems = generatedProblems.map(
      (problem) => ({
        ...problem,

        category: {
          _id: categoryData._id,
          name: categoryData.name,
        },

        difficulty,
        languages: [language],

        generatedByAI: true,

        aiInstructions: instructions || "",

        status: "Draft",

        totalSubmissions: 0,

        acceptedSubmissions: 0,

        acceptanceRate: 0,
      })
    );

    // --------------------------------------
    // Return preview only
    // --------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Coding problems generated successfully",

      count: problems.length,

      problems,
    });
  } catch (error) {
    console.error(
      "Generate Coding Problems Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate coding problems",
    });
  }
};

module.exports = {
  getCodingProblems,
  getCodingProblem,
  createCodingProblem,
  updateCodingProblem,
  deleteCodingProblem,
  updateCodingProblemStatus,
  getCodingStatistics,
  generateCodingProblemsWithAI,
};