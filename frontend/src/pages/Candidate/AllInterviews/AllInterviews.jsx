import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";

import "./AllInterviews.css";

const API = "http://localhost:5000/api";

// ======================================
// Technology Icon
// ======================================
const getTechnologyIcon = (interview) => {
  const title = (interview?.title || "").toLowerCase();
  const category = (interview?.category?.name || "").toLowerCase();

  const text = `${title} ${category}`;

  if (
    text.includes("data structure") ||
    text.includes("data structures") ||
    text.includes("dsa")
  ) {
    return "/icons/datastructure.png";
  }

  if (text.includes("dbms") || text.includes("database")) {
    return "/icons/dbms.png";
  }

  if (text.includes("mysql")) {
    return "/icons/mysql.png";
  }

  if (text.includes("javascript")) {
    return "/icons/javascript.png";
  }

  if (text.includes("node") || text.includes("nodejs")) {
    return "/icons/nodejs.png";
  }

  if (text.includes("python")) {
    return "/icons/python.png";
  }

  if (text.includes("react")) {
    return "/icons/react.png";
  }

  if (text.includes("html")) {
    return "/icons/html.png";
  }

  if (text.includes("css")) {
    return "/icons/css.png";
  }

  if (text.includes("php")) {
    return "/icons/php.png";
  }

  if (text.includes("java")) {
    return "/icons/java.png";
  }

  return "/icons/react.png";
};

// ======================================
// All Interviews
// ======================================
const AllInterviews = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // ======================================
  // FETCH ACTIVE INTERVIEWS
  // ======================================
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API}/interview-templates/candidate`
        );

        if (response.data.success) {
          setInterviews(response.data.interviews || []);
        } else {
          setError("Unable to load interviews.");
        }
      } catch (err) {
        console.error(
          "Failed to fetch candidate interviews:",
          err
        );

        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // ======================================
  // FILTER
  // ======================================
  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        interview.title?.toLowerCase().includes(searchText) ||
        interview.description
          ?.toLowerCase()
          .includes(searchText) ||
        interview.category?.name
          ?.toLowerCase()
          .includes(searchText);

      const matchesType =
        !type || interview.interviewType === type;

      const matchesDifficulty =
        !difficulty ||
        interview.difficulty === difficulty;

      return (
        matchesSearch &&
        matchesType &&
        matchesDifficulty
      );
    });
  }, [interviews, search, type, difficulty]);

  // ======================================
  // START INTERVIEW
  // ======================================
  const handleStartInterview = (interview) => {
    if (!interview?._id) {
      console.error("Interview ID missing:", interview);
      return;
    }

    navigate(
      `/candidate/mock-interview/${interview._id}`
    );
  };

  return (
    <div className="candidate-layout">

      {/* ======================================
          EXISTING SIDEBAR
      ====================================== */}
      <Sidebar />

      {/* ======================================
          MAIN
      ====================================== */}
      <main className="all-interviews-page">

        {/* ======================================
            TOP BAR
        ====================================== */}
        <header className="candidate-topbar">

          <div className="topbar-left">

            <button
              type="button"
              className="topbar-menu"
            >
              ☰
            </button>

            <div className="topbar-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search interviews, topics or skills..."
              />

            </div>

          </div>

          <div className="topbar-right">

            <button
              type="button"
              className="notification-btn"
            >
              ♧

              <span className="notification-count">
                3
              </span>
            </button>

            <div className="topbar-profile">

              <div className="profile-avatar">
                👤
              </div>

              <div className="profile-info">

                <span className="profile-name">
                  Candidate
                </span>

                <span className="profile-role">
                  Candidate
                </span>

              </div>

              <span className="profile-arrow">
                ˅
              </span>

            </div>

          </div>

        </header>


        {/* ======================================
            CONTENT
        ====================================== */}
        <div className="all-interviews-content">

          {/* ======================================
              HEADER
          ====================================== */}
          <div className="all-interviews-header">

            <div>

              <h1>
                All Interviews
              </h1>

              <p>
                Explore AI-powered mock interviews
                and practice for your next opportunity.
              </p>

            </div>

            <div className="interview-count">

              {interviews.length}{" "}
              {interviews.length === 1
                ? "Interview"
                : "Interviews"}

            </div>

          </div>


          {/* ======================================
              FILTER BAR
          ====================================== */}
          <div className="candidate-filter-bar">

            <div className="search-box">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search interviews..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >

              <option value="">
                All Types
              </option>

              <option value="HR">
                HR
              </option>

              <option value="Technical">
                Technical
              </option>

              <option value="Aptitude">
                Aptitude
              </option>

              <option value="Mixed">
                Mixed
              </option>

            </select>


            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value)
              }
            >

              <option value="">
                All Difficulty
              </option>

              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>

            </select>


            <button
              type="button"
              className="filter-icon-btn"
            >
              ⚱
            </button>

          </div>


          {/* ======================================
              LOADING
          ====================================== */}
          {loading && (
            <div className="interviews-state">

              <div className="loading-spinner"></div>

              <p>
                Loading interviews...
              </p>

            </div>
          )}


          {/* ======================================
              ERROR
          ====================================== */}
          {!loading && error && (
            <div className="interviews-state error">

              <h3>
                Unable to load interviews
              </h3>

              <p>
                {error}
              </p>

            </div>
          )}


          {/* ======================================
              EMPTY
          ====================================== */}
          {!loading &&
            !error &&
            filteredInterviews.length === 0 && (
              <div className="interviews-state empty">

                <h3>
                  No interviews found
                </h3>

                <p>
                  Try changing your search or filters.
                </p>

              </div>
            )}


          {/* ======================================
              INTERVIEW GRID
          ====================================== */}
          {!loading &&
            !error &&
            filteredInterviews.length > 0 && (

              <div className="candidate-interview-grid">

                {filteredInterviews.map(
                  (interview) => (

                    <div
                      className="candidate-interview-card"
                      key={interview._id}
                    >

                      {/* CARD HEADER */}
                      <div className="candidate-card-header">

                        <div className="candidate-card-title">

                          <div className="candidate-tech-icon">

                            <img
                              src={getTechnologyIcon(
                                interview
                              )}
                              alt={
                                interview.category?.name ||
                                "Technology"
                              }
                            />

                          </div>

                          <div>

                            <h3>
                              {interview.title}
                            </h3>

                            <p>
                              {interview.category?.name ||
                                "General Interview"}
                            </p>

                          </div>

                        </div>

                        <span className="active-badge">
                          Active
                        </span>

                      </div>


                      {/* TAGS */}
                      <div className="candidate-interview-tags">

                        <span>
                          {interview.interviewType}
                        </span>

                        <span>
                          {interview.difficulty}
                        </span>

                        <span>
                          ◷ {interview.duration} min
                        </span>

                      </div>


                      {/* DESCRIPTION */}
                      <p className="candidate-interview-description">

                        {interview.description ||
                          "Practice this AI-powered mock interview and improve your interview skills."}

                      </p>


                      {/* META */}
                      <div className="candidate-interview-meta">

                        <span>

                          <strong>
                            {interview.questions?.length ||
                              0}
                          </strong>

                          Questions

                        </span>

                        <span>
                          {interview.category?.name ||
                            "General"}
                        </span>

                      </div>


                      {/* START */}
                      <button
                        type="button"
                        className="start-interview-btn"
                        onClick={() =>
                          handleStartInterview(
                            interview
                          )
                        }
                      >

                        Start Interview

                        <span>
                          →
                        </span>

                      </button>

                    </div>

                  )
                )}

              </div>
            )}

        </div>

      </main>

    </div>
  );
};

export default AllInterviews;