import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./CandidateDashboard.css";

import Sidebar from "./components/Sidebar/Sidebar";
import TopHeader from "./components/TopHeader/TopHeader";
import StatisticsCards from "./components/StatisticsCards/StatisticsCards";
import AvailableInterviews from "./components/AvailableInterviews/AvailableInterviews";
import RecentReports from "./components/RecentReports/RecentReports";
import ImproveSkills from "./components/ImproveSkills/ImproveSkills";
import TrackProgress from "./components/TrackProgress/TrackProgress";

const API = "http://localhost:5000/api";

const CandidateDashboard = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [attempts, setAttempts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [attemptsLoading, setAttemptsLoading] =
    useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {
    fetchInterviews();
    fetchMyAttempts();
  }, []);

  // =========================================
  // FETCH AVAILABLE INTERVIEWS
  // =========================================

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/interview-templates`
      );

      const templates =
        response.data?.templates || [];

      const activeTemplates =
        templates.filter(
          (item) =>
            item.status === true
        );

      setInterviews(activeTemplates);

    } catch (error) {
      console.error(
        "Fetch Interviews Error:",
        error?.response?.data || error
      );

      setInterviews([]);

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH REAL LOGGED-IN CANDIDATE ATTEMPTS
  // =========================================

  const fetchMyAttempts = async () => {
    try {
      setAttemptsLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        console.error(
          "Authentication token not found."
        );

        setAttempts([]);
        return;
      }

      const response = await axios.get(
        `${API}/interview-attempts/my`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      console.log(
        "My Attempts:",
        response.data
      );

      setAttempts(
        Array.isArray(
          response.data?.attempts
        )
          ? response.data.attempts
          : []
      );

    } catch (error) {
      console.error(
        "Fetch My Attempts Error:",
        error?.response?.data || error
      );

      // If token is invalid/expired
      if (
        error?.response?.status === 401
      ) {
        localStorage.removeItem("token");

        navigate("/login");

        return;
      }

      setAttempts([]);

    } finally {
      setAttemptsLoading(false);
    }
  };

  // =========================================
  // REAL PERFORMANCE DATA
  // =========================================

  const completedAttempts =
    attempts.filter(
      (attempt) => {

        const status =
          String(
            attempt?.status || ""
          ).toLowerCase();

        return (
          status === "completed" ||
          status === "evaluated" ||
          attempt?.submittedAt
        );
      }
    );

  const evaluatedAttempts =
    attempts.filter(
      (attempt) =>
        String(
          attempt?.status || ""
        ).toLowerCase() ===
        "evaluated"
    );

  const scores =
    evaluatedAttempts
      .map((attempt) => {
        const percentage =
          Number(
            attempt?.percentage
          );

        return Number.isFinite(
          percentage
        )
          ? Math.max(
              0,
              Math.min(
                100,
                percentage
              )
            )
          : null;
      })
      .filter(
        (score) =>
          score !== null
      );

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (sum, score) =>
              sum + score,
            0
          ) /
            scores.length
        )
      : 0;

  const highestScore =
    scores.length > 0
      ? Math.round(
          Math.max(...scores)
        )
      : 0;

  // =========================================
  // SHARED PERFORMANCE OBJECT
  // =========================================

  const performanceData = {
    interviewsTaken:
      completedAttempts.length,

    averageScore,

    highestScore,

    evaluatedCount:
      evaluatedAttempts.length,

    attempts,

    completedAttempts,

    evaluatedAttempts,
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="candidate-dashboard">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <main className="dashboard-main">

        {/* HEADER */}

        <TopHeader user={user} />

        {/* =====================================
            STATISTICS
        ===================================== */}

        <StatisticsCards
          attempts={attempts}
          interviews={interviews}
          performance={performanceData}
        />

        {/* =====================================
            DASHBOARD CONTENT
        ===================================== */}

        <section className="dashboard-content">

          {/* ===================================
              AVAILABLE INTERVIEWS
          =================================== */}

          <div className="dashboard-interviews">

            <AvailableInterviews
              interviews={interviews}
              loading={loading}
              onStartInterview={(interview) =>
                navigate(
                  `/candidate/mock-interview/${interview._id}`
                )
              }
            />

          </div>

          {/* ===================================
              RECENT REPORTS
          =================================== */}

          <div className="dashboard-reports">

            <RecentReports
              attempts={attempts}
              loading={attemptsLoading}
            />

          </div>

          {/* ===================================
              IMPROVE SKILLS
          =================================== */}

          <div className="dashboard-skills">

            <ImproveSkills
              attempts={attempts}
            />

          </div>

          {/* ===================================
              TRACK PROGRESS
          =================================== */}

          <div className="dashboard-progress">

            <TrackProgress
              attempts={attempts}
              performance={performanceData}
            />

          </div>

        </section>

      </main>

    </div>
  );
};

export default CandidateDashboard;