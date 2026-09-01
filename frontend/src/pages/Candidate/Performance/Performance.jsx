import { useEffect, useMemo, useState } from "react";

import {
  FaChartLine,
  FaTrophy,
  FaClipboardCheck,
  FaBullseye,
  FaArrowUp,
  FaClock,
  FaChevronRight,
  FaFire,
  FaStar,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar/Sidebar";
import "./Performance.css";

const API = "http://localhost:5000/api";

const Performance = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // GET REAL CANDIDATE DATA
  // =========================================

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        const candidateId =
          storedUser?._id ||
          storedUser?.id;

        if (!candidateId) {
          console.error("Candidate ID not found.");
          setAttempts([]);
          return;
        }

        const response = await fetch(
          `${API}/interview-attempts/candidate/${candidateId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch performance: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "Performance API Response:",
          data
        );

        setAttempts(
          Array.isArray(data.attempts)
            ? data.attempts
            : []
        );

      } catch (error) {
        console.error(
          "Performance Error:",
          error
        );

        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  // =========================================
  // SCORE
  // =========================================

  const getScore = (attempt) => {
    if (
      typeof attempt?.percentage === "number"
    ) {
      return Math.max(
        0,
        Math.min(100, attempt.percentage)
      );
    }

    if (
      typeof attempt?.score === "number"
    ) {
      return Math.max(
        0,
        Math.min(100, attempt.score)
      );
    }

    return null;
  };

  // =========================================
  // COMPLETED INTERVIEWS
  // =========================================

  const completedAttempts = useMemo(() => {
    return attempts.filter((attempt) => {
      const status = String(
        attempt?.status || ""
      ).toLowerCase();

      return (
        status === "completed" ||
        status === "evaluated" ||
        attempt?.completed === true ||
        attempt?.submittedAt
      );
    });
  }, [attempts]);

  // =========================================
  // EVALUATED INTERVIEWS
  // =========================================

  const scoredAttempts = useMemo(() => {
    return completedAttempts.filter(
      (attempt) =>
        getScore(attempt) !== null
    );
  }, [completedAttempts]);

  // =========================================
  // AVERAGE SCORE
  // =========================================

  const averageScore = useMemo(() => {
    if (!scoredAttempts.length) {
      return null;
    }

    const total = scoredAttempts.reduce(
      (sum, attempt) =>
        sum + getScore(attempt),
      0
    );

    return Math.round(
      total / scoredAttempts.length
    );
  }, [scoredAttempts]);

  // =========================================
  // HIGHEST SCORE
  // =========================================

  const highestScore = useMemo(() => {
    if (!scoredAttempts.length) {
      return null;
    }

    return Math.round(
      Math.max(
        ...scoredAttempts.map(getScore)
      )
    );
  }, [scoredAttempts]);

  // =========================================
  // CURRENT LEVEL
  // =========================================

  const currentLevel = useMemo(() => {
    if (averageScore === null) {
      return "Not Rated";
    }

    if (averageScore >= 80) {
      return "Excellent";
    }

    if (averageScore >= 60) {
      return "Good";
    }

    if (averageScore >= 40) {
      return "Average";
    }

    return "Beginner";
  }, [averageScore]);

  // =========================================
  // RECENT INTERVIEWS
  // =========================================

  const recentAttempts = useMemo(() => {
    return [...completedAttempts]
      .sort((a, b) => {
        const dateA = new Date(
          a.submittedAt ||
          a.createdAt ||
          a.updatedAt ||
          0
        );

        const dateB = new Date(
          b.submittedAt ||
          b.createdAt ||
          b.updatedAt ||
          0
        );

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [completedAttempts]);

  // =========================================
  // FORMAT SCORE
  // =========================================

  const formatScore = (score) => {
    if (score === null || score === undefined) {
      return "—";
    }

    return `${Math.round(score)}%`;
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // INTERVIEW TITLE
  // =========================================

  const getInterviewTitle = (attempt) => {
    return (
      attempt?.interview?.title ||
      attempt?.interview?.name ||
      "AI Mock Interview"
    );
  };

  return (
    <div className="candidate-performance-layout">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <main className="performance-page">

        <div className="performance-container">

          {/* =================================
              HEADER
          ================================= */}

          <header className="performance-header">

            <div>

              <span className="performance-badge">
                Performance
              </span>

              <h1>
                Your Performance
              </h1>

              <p>
                Track your interview performance,
                scores and improvement over time.
              </p>

            </div>

            <div className="performance-header-icon">
              <FaChartLine />
            </div>

          </header>


          {/* =================================
              STATISTICS
          ================================= */}

          <section className="performance-stats">

            {/* INTERVIEWS */}

            <div className="performance-stat-card purple">

              <div className="stat-icon">
                <FaClipboardCheck />
              </div>

              <div className="stat-content">

                <span className="stat-label">
                  Interviews Taken
                </span>

                <strong>
                  {loading
                    ? "..."
                    : completedAttempts.length}
                </strong>

                <small>
                  Completed interviews
                </small>

              </div>

            </div>


            {/* AVERAGE */}

            <div className="performance-stat-card blue">

              <div className="stat-icon">
                <FaBullseye />
              </div>

              <div className="stat-content">

                <span className="stat-label">
                  Average Score
                </span>

                <strong>
                  {loading
                    ? "..."
                    : formatScore(
                        averageScore
                      )}
                </strong>

                <small>
                  Based on evaluated interviews
                </small>

              </div>

            </div>


            {/* HIGHEST */}

            <div className="performance-stat-card green">

              <div className="stat-icon">
                <FaTrophy />
              </div>

              <div className="stat-content">

                <span className="stat-label">
                  Highest Score
                </span>

                <strong>
                  {loading
                    ? "..."
                    : formatScore(
                        highestScore
                      )}
                </strong>

                <small>
                  Best interview score
                </small>

              </div>

            </div>


            {/* LEVEL */}

            <div className="performance-stat-card orange">

              <div className="stat-icon">
                <FaFire />
              </div>

              <div className="stat-content">

                <span className="stat-label">
                  Current Level
                </span>

                <strong>
                  {loading
                    ? "..."
                    : currentLevel}
                </strong>

                <small>
                  Based on evaluated scores
                </small>

              </div>

            </div>

          </section>


          {/* =================================
              ANALYTICS
          ================================= */}

          <section className="performance-main-grid">

            {/* OVERALL PERFORMANCE */}

            <div className="performance-card score-overview">

              <div className="card-heading">

                <div>

                  <span className="card-badge">
                    Analytics
                  </span>

                  <h2>
                    Overall Performance
                  </h2>

                  <p>
                    Your performance across
                    completed and evaluated
                    interviews.
                  </p>

                </div>

              </div>


              <div className="score-content">

                <div className="score-circle">

                  <div
                    className="score-circle-progress"
                    style={{
                      background:
                        averageScore === null
                          ? "conic-gradient(#edf0f7 0deg 360deg)"
                          : `conic-gradient(
                              #6846f5 ${
                                averageScore * 3.6
                              }deg,
                              #edf0f7 ${
                                averageScore * 3.6
                              }deg
                            )`,
                    }}
                  >

                    <div className="score-circle-inner">

                      <strong>
                        {formatScore(
                          averageScore
                        )}
                      </strong>

                      <span>
                        Average Score
                      </span>

                    </div>

                  </div>

                </div>


                <div className="score-details">

                  <div className="score-detail-row">

                    <span>
                      <i className="dot purple-dot" />
                      Excellent
                    </span>

                    <strong>
                      80–100%
                    </strong>

                  </div>


                  <div className="score-detail-row">

                    <span>
                      <i className="dot green-dot" />
                      Good
                    </span>

                    <strong>
                      60–79%
                    </strong>

                  </div>


                  <div className="score-detail-row">

                    <span>
                      <i className="dot orange-dot" />
                      Needs Improvement
                    </span>

                    <strong>
                      Below 60%
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* INTERVIEW PROGRESS */}

            <div className="performance-card progress-card">

              <div className="card-heading">

                <div>

                  <span className="card-badge">
                    Progress
                  </span>

                  <h2>
                    Interview Progress
                  </h2>

                  <p>
                    Your actual interview activity
                    and evaluated performance.
                  </p>

                </div>

              </div>


              <div className="progress-list">

                {/* COMPLETION */}

                <div className="progress-item">

                  <div className="progress-item-top">

                    <span>
                      Interview Completion
                    </span>

                    <strong>
                      {completedAttempts.length}
                    </strong>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill purple"
                      style={{
                        width:
                          completedAttempts.length > 0
                            ? "100%"
                            : "0%",
                      }}
                    />

                  </div>

                </div>


                {/* AVERAGE */}

                <div className="progress-item">

                  <div className="progress-item-top">

                    <span>
                      Average Performance
                    </span>

                    <strong>
                      {formatScore(
                        averageScore
                      )}
                    </strong>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill blue"
                      style={{
                        width:
                          averageScore !== null
                            ? `${averageScore}%`
                            : "0%",
                      }}
                    />

                  </div>

                </div>


                {/* BEST */}

                <div className="progress-item">

                  <div className="progress-item-top">

                    <span>
                      Best Performance
                    </span>

                    <strong>
                      {formatScore(
                        highestScore
                      )}
                    </strong>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill green"
                      style={{
                        width:
                          highestScore !== null
                            ? `${highestScore}%`
                            : "0%",
                      }}
                    />

                  </div>

                </div>

              </div>


              <div className="motivation-box">

                <div className="motivation-icon">
                  <FaStar />
                </div>

                <div>

                  <strong>
                    Keep going!
                  </strong>

                  <p>
                    Complete more interviews
                    to build a stronger
                    performance history.
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* =================================
              RECENT INTERVIEWS
          ================================= */}

          <section className="performance-card recent-performance">

            <div className="card-heading">

              <div>

                <span className="card-badge">
                  History
                </span>

                <h2>
                  Recent Interviews
                </h2>

                <p>
                  Your latest completed interviews.
                </p>

              </div>

            </div>


            {loading ? (

              <div className="performance-loading">

                <div className="loading-spinner" />

                Loading performance...

              </div>

            ) : recentAttempts.length === 0 ? (

              <div className="performance-empty">

                <div className="empty-icon">
                  <FaChartLine />
                </div>

                <h3>
                  No interview history yet
                </h3>

                <p>
                  Complete your first AI interview
                  to start tracking your performance.
                </p>

              </div>

            ) : (

              <div className="performance-table">

                {recentAttempts.map(
                  (attempt, index) => {

                    const score =
                      getScore(attempt);

                    return (

                      <div
                        className="performance-row"
                        key={
                          attempt._id ||
                          index
                        }
                      >

                        <div className="performance-row-icon">
                          <FaChartLine />
                        </div>


                        <div className="performance-row-info">

                          <h3>
                            {getInterviewTitle(
                              attempt
                            )}
                          </h3>

                          <span>

                            <FaClock />

                            {formatDate(
                              attempt.submittedAt ||
                              attempt.createdAt ||
                              attempt.updatedAt
                            )}

                          </span>

                        </div>


                        <div
                          className={`performance-score ${
                            score === null
                              ? "not-rated"
                              : score >= 80
                              ? "excellent"
                              : score >= 60
                              ? "good"
                              : score >= 40
                              ? "average"
                              : "low"
                          }`}
                        >
                          {formatScore(score)}
                        </div>


                        <div className="performance-score-bar">

                          <div className="mini-bar">

                            <div
                              style={{
                                width:
                                  score !== null
                                    ? `${score}%`
                                    : "0%",
                              }}
                            />

                          </div>

                        </div>


                        <button
                          type="button"
                          className="performance-arrow"
                          aria-label="View interview"
                        >
                          <FaChevronRight />
                        </button>

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </section>


          {/* =================================
              IMPROVEMENT
          ================================= */}

          <section className="performance-tips">

            <div className="tip-icon">
              <FaArrowUp />
            </div>

            <div>

              <h3>
                Improve your performance
              </h3>

              <p>
                Practice consistently and review
                your previous answers to identify
                areas where you can improve.
              </p>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};

export default Performance;