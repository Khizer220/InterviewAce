import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Admin
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import Categories from "../pages/Admin/Categories/Categories";
import Questions from "../pages/Admin/Questions/Questions";
import AIInterviews from "../pages/Admin/AIInterviews/AIInterviews";
import CandidateDashboard from "../pages/Candidate/CandidateDashboard";

// Candidate
import MockInterview from "../pages/Candidate/MockInterview/MockInterview";

const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================
          Public
      ========================== */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =========================
          Candidate
      ========================== */}

   <Route
  path="/candidate/dashboard"
  element={<CandidateDashboard />}
/>
      <Route
        path="/candidate/mock-interview/:id"
        element={<MockInterview />}
      />

      {/* =========================
          Admin
      ========================== */}

      <Route
        path="/admin/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/admin/categories"
        element={<Categories />}
      />

      <Route
        path="/admin/questions"
        element={<Questions />}
      />

      <Route
        path="/admin/ai-interviews"
        element={<AIInterviews />}
      />

    </Routes>
  );
};

export default AppRoutes;