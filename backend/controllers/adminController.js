const User = require("../models/User");
const InterviewAttempt = require("../models/InterviewAttempt");
const Resume = require("../models/Resume");
const InterviewCategory = require("../models/InterviewCategory");
const Question = require("../models/Question");
const InterviewTemplate = require("../models/InterviewTemplate");

// Only "Evaluated" attempts have gone through the AI scoring pipeline in
// interviewAttemptController.js and therefore have a real percentage.
// "Completed" is the schema's default status the moment an attempt is
// created — before evaluation runs — so an attempt can get stuck there
// if the AI call fails. Counting it as scored would silently average in
// a fake 0%, so only "Evaluated" counts here.
const SCORED_STATUSES = ["Evaluated"];

// ======================================
// Get All Candidates (with real progress)
// ======================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "candidate",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    const progressStats = await InterviewAttempt.aggregate([
      {
        $group: {
          _id: "$candidate",

          // Total interviews taken
          attemptsCount: {
            $sum: 1,
          },

          // Questions answered
          questionsAnswered: {
            $sum: {
              $cond: [
                { $isArray: "$answers" },
                { $size: "$answers" },
                0,
              ],
            },
          },

          // Same average-score calculation used
          // by the Candidate Dashboard
          percentageSum: {
            $sum: "$percentage",
          },
        },
      },
    ]);

    const progressMap = new Map(
      progressStats.map((entry) => [
        entry._id.toString(),
        entry,
      ])
    );

    const formattedUsers = users.map((user) => {
      const stats = progressMap.get(
        user._id.toString()
      );

      const interviewsAttempted =
        stats?.attemptsCount || 0;

      const questionsAnswered =
        stats?.questionsAnswered || 0;

      const avgScore =
        interviewsAttempted > 0
          ? Math.round(
              stats.percentageSum /
                interviewsAttempted
            )
          : null;

      return {
        ...user.toObject(),

        stack: user.stack || [],

        progress: {
          interviewsAttempted,
          interviewsCompleted:
            interviewsAttempted,
          questionsAnswered,
          avgScore,
        },
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
// ======================================
// Get Pending Users
// ======================================

const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "candidate",
      isApproved: false,
      isActive: true,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Pending Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending users",
    });
  }
};

// ======================================
// Approve User
// ======================================

const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "candidate",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        message: "User is already approved",
      });
    }

    user.isApproved = true;
    user.isActive = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Candidate approved successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Approve User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve candidate",
    });
  }
};

// ======================================
// Reject User
// ======================================

const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "candidate",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    user.isActive = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Candidate rejected successfully",
    });
  } catch (error) {
    console.error("Reject User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject candidate",
    });
  }
};

// ======================================
// Delete Candidate
// ======================================

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "candidate",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Candidate removed successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove candidate",
    });
  }
};

// ======================================
// Update Candidate Stack
// ======================================

const updateUserStack = async (req, res) => {
  try {
    const { id } = req.params;
    const { stack } = req.body;

    if (!Array.isArray(stack)) {
      return res.status(400).json({
        success: false,
        message: "Stack must be an array of strings",
      });
    }

    const cleanedStack = [
      ...new Set(
        stack
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      ),
    ];

    const user = await User.findOne({
      _id: id,
      role: "candidate",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    user.stack = cleanedStack;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Technology stack updated successfully",
      stack: user.stack,
    });
  } catch (error) {
    console.error("Update User Stack Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update technology stack",
    });
  }
};

// ======================================
// Get Candidate Interview History
// Real per-category breakdown from InterviewAttempt + InterviewTemplate.
// Used by the admin Users page accordion panel.
// ======================================

const getCandidateInterviews = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, role: "candidate" });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const attempts = await InterviewAttempt.find({ candidate: id })
      .populate({
        path: "interview",
        select: "title category interviewType difficulty",
        populate: { path: "category", select: "name" },
      })
      .sort({ createdAt: -1 });
     

    const formattedAttempts = attempts.map((attempt) => ({
      _id: attempt._id,
      title: attempt.interview?.title || "Untitled Interview",
      category: attempt.interview?.category?.name || "Uncategorized",
      interviewType: attempt.interview?.interviewType || null,
      status: attempt.status,
      // Only "Evaluated" attempts have a real AI-computed score — see
      // the note on SCORED_STATUSES above.
      percentage: attempt.status === "Evaluated" ? attempt.percentage : null,
      totalQuestions: attempt.totalQuestions,
      submittedAt: attempt.submittedAt,
    }));

    // Group into a per-category summary.
    const categoryMap = new Map();

    formattedAttempts.forEach((attempt) => {
      const key = attempt.category;

      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          category: key,
          attempts: 0,
          scoredCount: 0,
          percentageSum: 0,
        });
      }

      const entry = categoryMap.get(key);
      entry.attempts += 1;

      if (attempt.percentage !== null) {
        entry.scoredCount += 1;
        entry.percentageSum += attempt.percentage;
      }
    });

    const categoryBreakdown = Array.from(categoryMap.values()).map((entry) => ({
      category: entry.category,
      attempts: entry.attempts,
      avgScore:
        entry.scoredCount > 0 ? Math.round(entry.percentageSum / entry.scoredCount) : null,
    }));

    return res.status(200).json({
      success: true,
      totalAttempts: formattedAttempts.length,
      categoryBreakdown,
      attempts: formattedAttempts,
    });
  } catch (error) {
    console.error("Get Candidate Interviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidate interview history",
    });
  }
};

// ======================================
// Analytics helpers
// ======================================

const SCORE_BUCKETS = [
  { label: "90-100%", min: 90, max: 100 },
  { label: "80-89%", min: 80, max: 89 },
  { label: "70-79%", min: 70, max: 79 },
  { label: "60-69%", min: 60, max: 69 },
  { label: "50-59%", min: 50, max: 59 },
  { label: "<50%", min: -Infinity, max: 49 },
];

const percentChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
};

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
};

const formatWeekLabel = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

const avgOf = (list) =>
  list.length > 0
    ? Math.round(list.reduce((sum, a) => sum + (a.percentage || 0), 0) / list.length)
    : null;

// ======================================
// Get Platform Analytics
// Real data across all candidates — see the layout doc for what each
// section maps to. "days" controls both the current window and the
// equal-length previous window used for the delta percentages.
// ======================================

const getAnalytics = async (req, res) => {
  try {
    const days = Math.max(7, Math.min(365, parseInt(req.query.days, 10) || 30));

    const now = new Date();
    const rangeStart = new Date(now);
    rangeStart.setDate(rangeStart.getDate() - days);

    const prevRangeStart = new Date(rangeStart);
    prevRangeStart.setDate(prevRangeStart.getDate() - days);

    // Only ever count attempts belonging to real candidate accounts.
    // Without this, an admin account used for testing (attempts made
    // while logged in as "Admin") would show up mixed into every KPI,
    // chart, and ranking below as if it were a real candidate.
    const candidateUsers = await User.find({ role: "candidate" }).select("_id").lean();
    const candidateIds = candidateUsers.map((u) => u._id);

    // ---------- Total Candidates (cumulative, compared to `days` ago) ----------
    const [totalCandidatesNow, totalCandidatesPrev] = await Promise.all([
      User.countDocuments({ role: "candidate", isApproved: true, createdAt: { $lte: now } }),
      User.countDocuments({ role: "candidate", isApproved: true, createdAt: { $lte: rangeStart } }),
    ]);

    // ---------- Attempts inside the current window (used for charts/breakdowns) ----------
    const [currentAttempts, previousAttempts] = await Promise.all([
      InterviewAttempt.find({ candidate: { $in: candidateIds }, createdAt: { $gte: rangeStart, $lte: now } })
        .populate({
          path: "interview",
          select: "title category",
          populate: { path: "category", select: "name" },
        })
        .populate({ path: "candidate", select: "fullName" })
        .lean(),
      InterviewAttempt.find({
        candidate: { $in: candidateIds },
        createdAt: { $gte: prevRangeStart, $lte: rangeStart },
      }).lean(),
    ]);

    // ---------- Cumulative totals (all-time, for the "Total X" KPI cards) ----------
    const [totalInterviewsNow, totalInterviewsPrev] = await Promise.all([
      InterviewAttempt.countDocuments({ candidate: { $in: candidateIds }, createdAt: { $lte: now } }),
      InterviewAttempt.countDocuments({ candidate: { $in: candidateIds }, createdAt: { $lte: rangeStart } }),
    ]);

    const [completedNow, completedPrev] = await Promise.all([
      InterviewAttempt.countDocuments({
        candidate: { $in: candidateIds },
        createdAt: { $lte: now },
        status: { $ne: "In Progress" },
      }),
      InterviewAttempt.countDocuments({
        candidate: { $in: candidateIds },
        createdAt: { $lte: rangeStart },
        status: { $ne: "In Progress" },
      }),
    ]);

    const questionsAnsweredAsOf = async (cutoff) => {
      const result = await InterviewAttempt.aggregate([
        { $match: { candidate: { $in: candidateIds }, createdAt: { $lte: cutoff } } },
        { $project: { count: { $cond: [{ $isArray: "$answers" }, { $size: "$answers" }, 0] } } },
        { $group: { _id: null, total: { $sum: "$count" } } },
      ]);
      return result[0]?.total || 0;
    };

    const [questionsNow, questionsPrev] = await Promise.all([
      questionsAnsweredAsOf(now),
      questionsAnsweredAsOf(rangeStart),
    ]);

    const [activeNow, activePrev] = await Promise.all([
      User.countDocuments({ role: "candidate", lastActive: { $gte: rangeStart, $lte: now } }),
      User.countDocuments({ role: "candidate", lastActive: { $gte: prevRangeStart, $lte: rangeStart } }),
    ]);

    // ---------- Average score (within-window, Evaluated only — see SCORED_STATUSES note) ----------
    const scoredNow = currentAttempts.filter((a) => a.status === "Evaluated");
    const scoredPrev = previousAttempts.filter((a) => a.status === "Evaluated");

    const avgScoreNow = avgOf(scoredNow);
    const avgScorePrev = avgOf(scoredPrev);

    // ---------- Weekly buckets for the two charts ----------
    const weekBuckets = new Map();

    currentAttempts.forEach((attempt) => {
      const weekStart = startOfWeek(attempt.createdAt);
      const key = weekStart.toISOString();

      if (!weekBuckets.has(key)) {
        weekBuckets.set(key, {
          weekStart,
          started: 0,
          completed: 0,
          evaluated: 0,
          scoreSum: 0,
          scoreCount: 0,
        });
      }

      const bucket = weekBuckets.get(key);
      bucket.started += 1;
      if (attempt.status !== "In Progress") bucket.completed += 1;
      if (attempt.status === "Evaluated") {
        bucket.evaluated += 1;
        bucket.scoreSum += attempt.percentage || 0;
        bucket.scoreCount += 1;
      }
    });

    const sortedWeeks = Array.from(weekBuckets.values()).sort((a, b) => a.weekStart - b.weekStart);

    const interviewActivity = sortedWeeks.map((b) => ({
      label: formatWeekLabel(b.weekStart),
      started: b.started,
      completed: b.completed,
      evaluated: b.evaluated,
    }));

    const scoreOverTime = sortedWeeks.map((b) => ({
      label: formatWeekLabel(b.weekStart),
      avgScore: b.scoreCount > 0 ? Math.round(b.scoreSum / b.scoreCount) : null,
    }));

    // ---------- Technology / category breakdown ----------
    const categoryMap = new Map();

    currentAttempts.forEach((attempt) => {
      const name = attempt.interview?.category?.name || "Uncategorized";

      if (!categoryMap.has(name)) {
        categoryMap.set(name, { category: name, attempts: 0, scoreSum: 0, scoreCount: 0 });
      }

      const entry = categoryMap.get(name);
      entry.attempts += 1;

      if (attempt.status === "Evaluated") {
        entry.scoreSum += attempt.percentage || 0;
        entry.scoreCount += 1;
      }
    });

    const totalAttemptsInRange = currentAttempts.length;

    const technologies = Array.from(categoryMap.values())
      .map((entry) => ({
        category: entry.category,
        attempts: entry.attempts,
        percent: totalAttemptsInRange > 0 ? Math.round((entry.attempts / totalAttemptsInRange) * 100) : 0,
      }))
      .sort((a, b) => b.attempts - a.attempts);

    const categoryPerformance = Array.from(categoryMap.values())
      .map((entry) => ({
        category: entry.category,
        attempts: entry.attempts,
        avgScore: entry.scoreCount > 0 ? Math.round(entry.scoreSum / entry.scoreCount) : null,
      }))
      .sort((a, b) => b.attempts - a.attempts);

    // ---------- Score distribution (Evaluated attempts in range) ----------
    const scoreDistribution = SCORE_BUCKETS.map((bucket) => {
      const count = scoredNow.filter((a) => a.percentage >= bucket.min && a.percentage <= bucket.max).length;
      return {
        label: bucket.label,
        count,
        percent: scoredNow.length > 0 ? Math.round((count / scoredNow.length) * 100) : 0,
      };
    });

    // ---------- Top performers / needs improvement ----------
    const candidateScoreMap = new Map();

    currentAttempts
      .filter((a) => a.status === "Evaluated" && a.candidate)
      .forEach((attempt) => {
        const id = attempt.candidate._id.toString();

        if (!candidateScoreMap.has(id)) {
          candidateScoreMap.set(id, {
            candidateId: id,
            name: attempt.candidate.fullName || "Unknown",
            scoreSum: 0,
            scoreCount: 0,
          });
        }

        const entry = candidateScoreMap.get(id);
        entry.scoreSum += attempt.percentage || 0;
        entry.scoreCount += 1;
      });

    const candidateAverages = Array.from(candidateScoreMap.values()).map((entry) => ({
      candidateId: entry.candidateId,
      name: entry.name,
      avgScore: Math.round(entry.scoreSum / entry.scoreCount),
    }));

    const topPerformers = [...candidateAverages].sort((a, b) => b.avgScore - a.avgScore).slice(0, 5);
    const needsImprovement = [...candidateAverages].sort((a, b) => a.avgScore - b.avgScore).slice(0, 5);

    // ---------- Recent activity feed ----------
    const [recentAttempts, recentCandidates] = await Promise.all([
      InterviewAttempt.find({ candidate: { $in: candidateIds } })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate({ path: "candidate", select: "fullName" })
        .populate({
          path: "interview",
          select: "title category",
          populate: { path: "category", select: "name" },
        })
        .lean(),
      User.find({ role: "candidate" }).sort({ createdAt: -1 }).limit(5).select("fullName createdAt").lean(),
    ]);

    const activityItems = [
      ...recentAttempts.map((attempt) => ({
        message: `${attempt.candidate?.fullName || "A candidate"} ${
          attempt.status === "Evaluated" ? "completed" : attempt.status === "Completed" ? "submitted" : "started"
        } ${attempt.interview?.category?.name || attempt.interview?.title || "an"} interview`,
        timestamp: attempt.status === "Evaluated" ? attempt.updatedAt : attempt.createdAt,
      })),
      ...recentCandidates.map((user) => ({
        message: `New candidate ${user.fullName} registered`,
        timestamp: user.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8);

    return res.status(200).json({
      success: true,
      range: { days, from: rangeStart, to: now },
      kpis: {
        totalCandidates: {
          value: totalCandidatesNow,
          deltaPercent: percentChange(totalCandidatesNow, totalCandidatesPrev),
        },
        totalInterviews: {
          value: totalInterviewsNow,
          deltaPercent: percentChange(totalInterviewsNow, totalInterviewsPrev),
        },
        completedInterviews: {
          value: completedNow,
          deltaPercent: percentChange(completedNow, completedPrev),
        },
        averageScore: {
          value: avgScoreNow,
          deltaPercent:
            avgScoreNow !== null && avgScorePrev !== null ? percentChange(avgScoreNow, avgScorePrev) : null,
        },
        questionsAnswered: {
          value: questionsNow,
          deltaPercent: percentChange(questionsNow, questionsPrev),
        },
        activeCandidates: {
          value: activeNow,
          deltaPercent: percentChange(activeNow, activePrev),
        },
      },
      scoreOverTime,
      interviewActivity,
      technologies,
      categoryPerformance,
      scoreDistribution,
      topPerformers,
      needsImprovement,
      recentActivity: activityItems,
    });
  } catch (error) {
    console.error("Get Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

// ======================================
// Get All Resumes (Admin Resume Reviews — Phase 1)
// Real totals only. "Analyzed"/"Analysis Failed" will genuinely stay 0
// until the AI analysis step (Phase 2) exists — every resume is
// honestly "Pending Analysis" until then, not a fabricated number.
// ======================================

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({})
      .populate({ path: "candidate", select: "fullName email stack" })
      .sort({ createdAt: -1 });

    const stats = {
      total: resumes.length,
      analyzed: resumes.filter((r) => r.analysisStatus === "Analyzed").length,
      pending: resumes.filter((r) => r.analysisStatus === "Pending Analysis").length,
      failed: resumes.filter((r) => r.analysisStatus === "Analysis Failed").length,
    };

    return res.status(200).json({
      success: true,
      stats,
      resumes,
    });
  } catch (error) {
    console.error("Get Resumes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

// ======================================
// Get Admin Dashboard Overview
// Real counts + real recent activity across categories, questions,
// candidates, and evaluated interviews. "This week" = created in the
// last 7 days, not a fabricated growth percentage.
// ======================================

const getDashboardOverview = async (req, res) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      categoriesTotal,
      categoriesWeek,
      questionsTotal,
      questionsWeek,
      usersTotal,
      usersWeek,
      interviewsTotal,
      interviewsWeek,
    ] = await Promise.all([
      InterviewCategory.countDocuments({}),
      InterviewCategory.countDocuments({ createdAt: { $gte: weekAgo } }),
      Question.countDocuments({}),
      Question.countDocuments({ createdAt: { $gte: weekAgo } }),
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "candidate", createdAt: { $gte: weekAgo } }),
      InterviewTemplate.countDocuments({}),
      InterviewTemplate.countDocuments({ createdAt: { $gte: weekAgo } }),
    ]);

    const [recentCategories, recentQuestions, recentUsers, recentAttempts] = await Promise.all([
      InterviewCategory.find({}).sort({ createdAt: -1 }).limit(8).select("name createdAt").lean(),
      Question.find({}).sort({ createdAt: -1 }).limit(8).select("question topic createdAt").lean(),
      User.find({ role: "candidate" }).sort({ createdAt: -1 }).limit(8).select("fullName createdAt").lean(),
      InterviewAttempt.find({ status: "Evaluated" })
        .sort({ updatedAt: -1 })
        .limit(8)
        .populate({ path: "candidate", select: "fullName" })
        .select("candidate updatedAt")
        .lean(),
    ]);

    // ---------- Top Performing Questions ----------
    // Real candidate accounts only (see the note on getAnalytics for why).
    // "attempts" = how many submitted interviews included this question —
    // exact. "avgScore" = the average OVERALL score of interviews that
    // happened to include this question, since there's no per-question
    // correctness stored anywhere — an honest proxy, not true per-question
    // grading. Labeled as such on the frontend, not called "Success Rate."
    const candidateUsersForTop = await User.find({ role: "candidate" }).select("_id").lean();
    const candidateIdsForTop = candidateUsersForTop.map((u) => u._id);

    const topQuestionsAgg = await InterviewAttempt.aggregate([
      { $match: { candidate: { $in: candidateIdsForTop } } },
      { $unwind: "$answers" },
      {
        $group: {
          _id: "$answers.question",
          attempts: { $sum: 1 },
          evaluatedScoreSum: {
            $sum: { $cond: [{ $eq: ["$status", "Evaluated"] }, "$percentage", 0] },
          },
          evaluatedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Evaluated"] }, 1, 0] },
          },
        },
      },
      { $sort: { attempts: -1 } },
      { $limit: 5 },
    ]);

    const questionIds = topQuestionsAgg.map((q) => q._id).filter(Boolean);

    const questionDocs = await Question.find({ _id: { $in: questionIds } })
      .select("question category")
      .populate({ path: "category", select: "name" })
      .lean();

    const questionsMap = new Map(questionDocs.map((q) => [q._id.toString(), q]));

    const topQuestions = topQuestionsAgg
      .filter((q) => q._id)
      .map((q) => {
        const doc = questionsMap.get(q._id.toString());
        return {
          question: doc?.question || "Deleted question",
          category: doc?.category?.name || "Uncategorized",
          attempts: q.attempts,
          avgScore: q.evaluatedCount > 0 ? Math.round(q.evaluatedScoreSum / q.evaluatedCount) : null,
        };
      });

    // ---------- Interviews Overview ----------
    // Real statuses only — "In Progress" / "Completed" / "Evaluated".
    // No "Scheduled" bucket: nothing in InterviewAttempt represents a
    // pre-scheduled, not-yet-started interview, so that mockup category
    // doesn't correspond to anything real in this schema.
    const twoWeeksAgo = new Date(weekAgo);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

    const [statusCounts, totalThisWeek, totalLastWeek] = await Promise.all([
      InterviewAttempt.aggregate([
        { $match: { candidate: { $in: candidateIdsForTop } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      InterviewAttempt.countDocuments({
        candidate: { $in: candidateIdsForTop },
        createdAt: { $gte: weekAgo },
      }),
      InterviewAttempt.countDocuments({
        candidate: { $in: candidateIdsForTop },
        createdAt: { $gte: twoWeeksAgo, $lt: weekAgo },
      }),
    ]);

    const interviewsTotalAll = statusCounts.reduce((sum, s) => sum + s.count, 0);

    const statusBreakdown = statusCounts.map((s) => ({
      status: s._id,
      count: s.count,
      percent: interviewsTotalAll > 0 ? Math.round((s.count / interviewsTotalAll) * 100) : 0,
    }));

    const interviewsOverview = {
      total: interviewsTotalAll,
      statusBreakdown,
      deltaPercent: percentChange(totalThisWeek, totalLastWeek),
    };

    const activityItems = [
      ...recentCategories.map((c) => ({
        type: "category",
        message: `"${c.name}" category added`,
        actor: "Admin",
        timestamp: c.createdAt,
      })),
      ...recentQuestions.map((q) => ({
        type: "question",
        message: q.topic ? `Question added — ${q.topic}` : "Question added",
        actor: "Admin",
        timestamp: q.createdAt,
      })),
      ...recentUsers.map((u) => ({
        type: "user",
        message: `New candidate ${u.fullName} registered`,
        actor: "System",
        timestamp: u.createdAt,
      })),
      ...recentAttempts.map((a) => ({
        type: "interview",
        message: `${a.candidate?.fullName || "A candidate"} completed AI evaluation`,
        actor: "Interview Engine",
        timestamp: a.updatedAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 15);

    return res.status(200).json({
      success: true,
      overview: {
        categories: { value: categoriesTotal, weekCount: categoriesWeek },
        questions: { value: questionsTotal, weekCount: questionsWeek },
        users: { value: usersTotal, weekCount: usersWeek },
        interviews: { value: interviewsTotal, weekCount: interviewsWeek },
      },
      recentActivity: activityItems,
      topQuestions,
      interviewsOverview,
    });
  } catch (error) {
    console.error("Get Dashboard Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
    });
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  getUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser,
  updateUserStack,
  getCandidateInterviews,
  getAnalytics,
  getResumes,
  getDashboardOverview,
};