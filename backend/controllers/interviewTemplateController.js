const InterviewTemplate = require("../models/InterviewTemplate");
const Question = require("../models/Question");

// =============================
// Get All Interview Templates
// =============================
exports.getInterviewTemplates = async (req, res) => {
  try {
    const templates = await InterviewTemplate.find()
      .populate("category")
      .populate("questions")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Interview Template
// =============================
exports.getInterviewTemplate = async (req, res) => {
  try {
    const template = await InterviewTemplate.findById(req.params.id)
      .populate("category")
      .populate("questions");

    console.log("========== TEMPLATE AFTER POPULATE ==========");
    console.log(JSON.stringify(template, null, 2));
    console.log("============================================");

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Interview Template not found",
      });
    }

    res.status(200).json({
      success: true,
      template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Create Interview Template
// =============================
exports.createInterviewTemplate = async (req, res) => {
  try {
    const data = { ...req.body };

    console.log("========== CREATE TEMPLATE ==========");
    console.log("AI Questions:", data.aiQuestions);
    console.log("Questions:", data.questions);
    console.log("=====================================");

    // Save AI Questions (only when creating new AI questions)
    if (
      data.aiQuestions &&
      Array.isArray(data.aiQuestions) &&
      data.aiQuestions.length > 0
    ) {
      const savedQuestions = [];

      for (const q of data.aiQuestions) {
        const question = await Question.create({
          category: data.category,
          question: q.question,
          expectedAnswer: q.expectedAnswer || "",
          topic: q.topic || "",
          followUpQuestion: q.followUpQuestion || "",
          evaluationCriteria: q.evaluationCriteria || [],
          difficulty: q.difficulty || data.difficulty,
          marks: 5,
          source: "AI",
        });

        savedQuestions.push(question._id);
      }

      data.questions = savedQuestions;
      delete data.aiQuestions;
    }

    const template = await InterviewTemplate.create(data);

    res.status(201).json({
      success: true,
      message: "Interview Template Created Successfully",
      template,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Interview Template
// =============================
exports.updateInterviewTemplate = async (req, res) => {
  try {
    const template = await InterviewTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Interview Template not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview Template Updated Successfully",
      template,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Interview Template
// =============================
exports.deleteInterviewTemplate = async (req, res) => {
  try {
    const template = await InterviewTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Interview Template not found",
      });
    }

    await template.deleteOne();

    res.status(200).json({
      success: true,
      message: "Interview Template Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Toggle Status
// =============================
exports.toggleInterviewStatus = async (req, res) => {
  try {
    const template = await InterviewTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Interview Template not found",
      });
    }

    template.status = !template.status;

    await template.save();

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Duplicate Interview Template
// =============================
exports.duplicateInterviewTemplate = async (req, res) => {
  try {
    const template = await InterviewTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Interview Template not found",
      });
    }

    const duplicatedTemplate = await InterviewTemplate.create({
      title: `${template.title} (Copy)`,
      description: template.description,
      category: template.category,
      interviewType: template.interviewType,
      difficulty: template.difficulty,
      duration: template.duration,
      instructions: template.instructions,
      questions: template.questions,
      status: false,
      createdBy: template.createdBy,
    });

    res.status(201).json({
      success: true,
      message: "Interview Template Duplicated Successfully",
      template: duplicatedTemplate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};