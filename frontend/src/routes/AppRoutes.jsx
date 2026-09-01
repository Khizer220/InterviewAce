import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Candidate/Landing/LandingPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Admin
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import Categories from "../pages/Admin/Categories/Categories";
import Questions from "../pages/Admin/Questions/Questions";
import AIInterviews from "../pages/Admin/AIInterviews/AIInterviews";
import Coding from "../pages/Admin/Coding/Coding";
import Analytics from "../pages/Admin/Analytics/Analytics";
import ResumeReviews from "../pages/Admin/ResumeReviews/ResumeReviews";
import PendingUsers from "../pages/Admin/PendingUsers/PendingUsers";
import Users from "../pages/Admin/Users/Users";

// Candidate
import CandidateDashboard from "../pages/Candidate/CandidateDashboard";
import MockInterview from "../pages/Candidate/MockInterview/MockInterview";
import AllInterviews from "../pages/Candidate/AllInterviews/AllInterviews";
import Resume from "../pages/Candidate/Resume/Resume";
import CodingList from "../pages/Candidate/Coding/CodingList/CodingList";
import CodingSolve from "../pages/Candidate/Coding/CodingSolve/CodingSolve";
import Performance from "../pages/Candidate/Performance/Performance";
import Profile from "../pages/Candidate/Profile/Profile";
import Results from "../pages/Candidate/Results/Results";

// Candidate Sidebar
import Sidebar from "../pages/Candidate/components/Sidebar/Sidebar";

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

      <Route
        path="/candidate/interviews"
        element={<AllInterviews />}
      />

      <Route
        path="/candidate/resume"
        element={<Resume />}
      />


      {/* =========================
          Candidate Coding Practice
      ========================== */}

      <Route
        path="/candidate/coding"
        element={
          <div className="candidate-layout">
            <Sidebar />

            <main className="candidate-main">
              <CodingList />
            </main>
          </div>
        }
      />

      <Route
        path="/candidate/coding/:id"
        element={
          <div className="candidate-layout">
            <Sidebar />

            <main className="candidate-main">
              <CodingSolve />
            </main>
          </div>
        }
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
        path="/admin/pending-users"
        element={<PendingUsers />}
      />

      <Route
        path="/admin/users"
        element={<Users />}
      />

      <Route
        path="/admin/coding"
        element={<Coding />}
      />

      <Route
        path="/admin/analytics"
        element={<Analytics />}
      />

      <Route
        path="/admin/resumes"
        element={<ResumeReviews />}
      />

      <Route
  path="/candidate/performance"
  element={<Performance />}
/>

<Route
  path="/candidate/profile"
  element={<Profile />}
/>

<Route
  path="/candidate/profile"
  element={<Profile />}
/>

<Route
  path="/candidate/results"
  element={<Results />}
/>

    </Routes>
  );
};

export default AppRoutes;