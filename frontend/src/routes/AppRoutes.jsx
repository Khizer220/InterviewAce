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
import Coding from "../pages/Admin/Coding/Coding";
import Analytics from "../pages/Admin/Analytics/Analytics";
import ResumeReviews from "../pages/Admin/ResumeReviews/ResumeReviews";


// Candidate
import MockInterview from "../pages/Candidate/MockInterview/MockInterview";
import AllInterviews from "../pages/Candidate/AllInterviews/AllInterviews";
import PendingUsers from "../pages/Admin/PendingUsers/PendingUsers";
import Users from "../pages/Admin/Users/Users";
import Resume from "../pages/Candidate/Resume/Resume";
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

      <Route
  path="/candidate/interviews"
  element={<AllInterviews />}
/>

<Route
  path="/admin/pending-users"
  element={<PendingUsers />}
/>

<Route
  path="/admin/users"
  element={<Users />}
/>
<Route path="/admin/coding" element={<Coding />} />

<Route path="/admin/analytics" element={<Analytics />} />

<Route path="/candidate/resume" element={<Resume />} />
<Route path="/admin/resumes" element={<ResumeReviews />} />

    </Routes>
  );
};

export default AppRoutes;