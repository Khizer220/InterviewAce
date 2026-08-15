const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const interviewAttemptRoutes = require("./routes/interviewAttemptRoutes");
const interviewCategoryRoutes = require("./routes/interviewCategoryRoutes");
const questionRoutes = require("./routes/questionRoutes");
const interviewTemplateRoutes = require("./routes/interviewTemplateRoutes");
const aiRoutes = require("./routes/aiRoutes");

// ======================================
// Connect Database
// ======================================

connectDB();

const app = express();

// ======================================
// Middleware
// ======================================

app.use(cors());

app.use(express.json());

// ======================================
// Routes
// ======================================

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use(
  "/api/categories",
  interviewCategoryRoutes
);

app.use(
  "/api/questions",
  questionRoutes
);

app.use(
  "/api/interview-templates",
  interviewTemplateRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/interview-attempts",
  interviewAttemptRoutes
);

// ======================================
// Root Route
// ======================================

app.get("/", (req, res) => {
  res.send("🚀 Welcome to InterviewAce Backend API");
});

// ======================================
// Health Check
// ======================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
    timestamp: new Date().toISOString(),
  });
});

// ======================================
// Start Server
// ======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});