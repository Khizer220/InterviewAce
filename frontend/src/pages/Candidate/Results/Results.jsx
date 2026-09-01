import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  FaClipboardCheck,
  FaChartLine,
  FaStar,
  FaTrophy,
  FaCheckCircle,
  FaLightbulb,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaArrowUp,
  FaClock,
  FaQuestionCircle,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar/Sidebar";

import "./Results.css";

const API = "http://localhost:5000/api";

const Results = () => {
  const [attempts, setAttempts] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const [expandedQuestion, setExpandedQuestion] = useState(0);

  const getToken = () => localStorage.getItem("token");

  // =========================================
  // FETCH ALL MY ATTEMPTS
  // =========================================

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        setAttempts([]);
        return;
      }

      const response = await axios.get(
        `${API}/interview-attempts/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data?.attempts || [];

      setAttempts(data);

      // Automatically select newest attempt
      if (data.length > 0) {
        fetchAttemptDetails(data[0]._id);
      }
    } catch (error) {
      console.error(
        "Fetch Results Error:",
        error?.response?.data || error
      );

      setAttempts([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH SELECTED ATTEMPT DETAILS
  // =========================================

  const fetchAttemptDetails = async (attemptId) => {
    try {
      setDetailLoading(true);

      const token = getToken();

      if (!token) {
        return;
      }

      const response = await axios.get(
        `${API}/interview-attempts/${attemptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedAttempt(
        response.data?.attempt || null
      );

      setExpandedQuestion(0);
    } catch (error) {
      console.error(
        "Fetch Attempt Details Error:",
        error?.response?.data || error
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // =========================================
  // SELECT INTERVIEW
  // =========================================

  const handleSelectAttempt = (attempt) => {
    fetchAttemptDetails(attempt._id);
  };

  // =========================================
  // EVALUATED ATTEMPTS
  // =========================================

  const evaluatedAttempts = useMemo(
    () =>
      attempts.filter(
        (attempt) =>
          attempt.status === "Evaluated"
      ),
    [attempts]
  );

  // =========================================
  // STATISTICS
  // =========================================

  const scores = evaluatedAttempts
    .map((attempt) =>
      Number(
        attempt.percentage ??
        attempt.score ??
        0
      )
    )
    .filter((score) => !Number.isNaN(score));

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (sum, score) => sum + score,
            0
          ) / scores.length
        )
      : 0;

  const highestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  const totalEvaluated =
    evaluatedAttempts.length;

  // =========================================
  // HELPERS
  // =========================================

  const getInterviewTitle = (attempt) => {
    return (
      attempt?.interview?.title ||
      attempt?.interview?.name ||
      "Interview"
    );
  };

  const getDate = (attempt) => {
    const date =
      attempt?.submittedAt ||
      attempt?.createdAt ||
      attempt?.startedAt;

    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getQuestionCount = (attempt) => {
    if (
      Array.isArray(attempt?.answers)
    ) {
      return attempt.answers.length;
    }

    if (
      Array.isArray(
        attempt?.interview?.questions
      )
    ) {
      return attempt.interview.questions.length;
    }

    return 0;
  };

  const getDuration = (attempt) => {
    return (
      attempt?.interview?.duration ||
      0
    );
  };

  const getScore = (attempt) => {
    const value =
      attempt?.percentage ??
      attempt?.score ??
      0;

    return Number(value) || 0;
  };

  const getInitial = (title) => {
    if (!title) return "I";

    const words = title
      .trim()
      .split(/\s+/);

    if (words.length > 1) {
      return (
        words[0][0] +
        words[1][0]
      ).toUpperCase();
    }

    return title
      .substring(0, 2)
      .toUpperCase();
  };

  const getScoreClass = (score) => {
    if (score >= 80) return "score-good";
    if (score >= 60) return "score-average";
    return "score-low";
  };

  // =========================================
  // QUESTIONS
  // =========================================

  const answers =
    selectedAttempt?.answers || [];

  const getQuestionText = (answer) => {
    if (
      typeof answer?.question ===
      "object"
    ) {
      return (
        answer.question.question ||
        answer.question.text ||
        answer.question.title ||
        "Question"
      );
    }

    return "Question";
  };

  const getAnswerText = (answer) => {
    if (
      typeof answer?.answer ===
      "string"
    ) {
      return answer.answer;
    }

    return "No answer submitted.";
  };

  // =========================================
  // EMPTY STATE
  // =========================================

  if (!loading && attempts.length === 0) {
    return (
      <div className="results-layout">
        <Sidebar />

        <main className="results-main">
          <div className="results-empty-page">
            <div className="results-empty-icon">
              <FaClipboardCheck />
            </div>

            <h1>Interview Results</h1>

            <p>
              Complete an interview to see
              your AI evaluation, answers,
              strengths and feedback here.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="results-layout">

      <Sidebar />

      <main className="results-main">

        {/* =====================================
            HEADER
        ===================================== */}

        <header className="results-page-header">

          <div>
            <span className="results-page-tag">
              Results
            </span>

            <h1>
              Interview Results
            </h1>

            <p>
              Review your AI-evaluated
              interviews, answers, and
              personalized feedback.
            </p>
          </div>

          <button
            className="results-header-button"
            type="button"
            onClick={fetchAttempts}
            title="Refresh results"
          >
            <FaClipboardCheck />
          </button>

        </header>


        {/* =====================================
            SUMMARY CARDS
        ===================================== */}

        <section className="results-stat-grid">

          <div className="results-stat-card">

            <div className="results-stat-icon purple">
              <FaClipboardCheck />
            </div>

            <div>
              <span>
                Interviews Taken
              </span>

              <strong>
                {attempts.length}
              </strong>

              <small>
                All Completed
              </small>
            </div>

          </div>


          <div className="results-stat-card">

            <div className="results-stat-icon green">
              <FaChartLine />
            </div>

            <div>
              <span>
                Average Score
              </span>

              <strong>
                {averageScore}%
              </strong>

              <small>
                AI Evaluated
              </small>
            </div>

          </div>


          <div className="results-stat-card">

            <div className="results-stat-icon blue">
              <FaStar />
            </div>

            <div>
              <span>
                Highest Score
              </span>

              <strong>
                {highestScore}%
              </strong>

              <small>
                Best Performance
              </small>
            </div>

          </div>


          <div className="results-stat-card">

            <div className="results-stat-icon orange">
              <FaTrophy />
            </div>

            <div>
              <span>
                Total Evaluated
              </span>

              <strong>
                {totalEvaluated}
              </strong>

              <small>
                AI Evaluated
              </small>
            </div>

          </div>

        </section>


        {/* =====================================
            MAIN RESULTS AREA
        ===================================== */}

        <section className="results-content">

          {/* ===================================
              LEFT INTERVIEW LIST
          =================================== */}

          <aside className="results-interview-list">

            <div className="results-list-header">

              <h2>
                Your Interviews
              </h2>

              <span>
                {attempts.length}
              </span>

            </div>


            {loading ? (

              <div className="results-loading">
                Loading interviews...
              </div>

            ) : (

              <div className="results-list-items">

                {attempts.map((attempt) => {

                  const title =
                    getInterviewTitle(
                      attempt
                    );

                  const score =
                    getScore(attempt);

                  const isSelected =
                    selectedAttempt?._id ===
                    attempt._id;

                  return (
                    <button
                      key={attempt._id}
                      type="button"
                      className={`result-interview-item ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectAttempt(
                          attempt
                        )
                      }
                    >

                      <div className="result-interview-avatar">
                        {getInitial(title)}
                      </div>


                      <div className="result-interview-info">

                        <strong>
                          {title}
                        </strong>

                        <span>
                          {getDate(attempt)}
                          {" • "}
                          {getQuestionCount(
                            attempt
                          )}{" "}
                          Questions
                          {" • "}
                          {getDuration(
                            attempt
                          )}{" "}
                          min
                        </span>

                        <small
                          className={
                            attempt.status ===
                            "Evaluated"
                              ? "evaluated"
                              : "completed"
                          }
                        >
                          {attempt.status ||
                            "Completed"}
                        </small>

                      </div>


                      <div className="result-interview-score">

                        <strong
                          className={getScoreClass(
                            score
                          )}
                        >
                          {score}%
                        </strong>

                        <FaChevronRight />

                      </div>

                    </button>
                  );
                })}

              </div>
            )}

          </aside>


          {/* ===================================
              RIGHT DETAIL
          =================================== */}

          <section className="results-detail">

            {detailLoading ? (

              <div className="results-detail-loading">
                Loading result...
              </div>

            ) : selectedAttempt ? (

              <>

                {/* ===============================
                    DETAIL HEADER
                =============================== */}

                <div className="result-detail-header">

                  <div className="result-detail-title">

                    <div className="result-detail-avatar">
                      {getInitial(
                        getInterviewTitle(
                          selectedAttempt
                        )
                      )}
                    </div>

                    <div>

                      <h2>
                        {getInterviewTitle(
                          selectedAttempt
                        )}
                      </h2>

                      <p>
                        {getDate(
                          selectedAttempt
                        )}
                        {" • "}
                        {getQuestionCount(
                          selectedAttempt
                        )}{" "}
                        Questions
                        {" • "}
                        {getDuration(
                          selectedAttempt
                        )}{" "}
                        min
                      </p>

                    </div>

                  </div>


                  <div className="result-overall-score">

                    <div>
                      <span>
                        Overall Score
                      </span>

                      <strong>
                        {getScore(
                          selectedAttempt
                        )}%
                      </strong>
                    </div>

                    <div
                      className="score-ring"
                      style={{
                        "--score":
                          getScore(
                            selectedAttempt
                          ) * 3.6,
                      }}
                    >
                      <div>
                        {getScore(
                          selectedAttempt
                        )}%
                      </div>
                    </div>

                  </div>

                </div>


                {/* ===============================
                    EVALUATION STATUS
                =============================== */}

                <div className="evaluation-status">

                  <FaCheckCircle />

                  <strong>
                    {selectedAttempt.status ===
                    "Evaluated"
                      ? "AI Evaluation Completed"
                      : "Interview Completed"}
                  </strong>

                </div>


                {/* ===============================
                    FEEDBACK CARDS
                =============================== */}

                <div className="feedback-grid">

                  <div className="feedback-card ai-feedback">

                    <div className="feedback-title">
                      <FaStar />

                      <strong>
                        AI Feedback
                      </strong>
                    </div>

                    <p>
                      {selectedAttempt.aiFeedback ||
                        "No AI feedback is available for this interview yet."}
                    </p>

                  </div>


                  <div className="feedback-card strengths-card">

                    <div className="feedback-title">
                      <FaCheckCircle />

                      <strong>
                        Strengths
                      </strong>
                    </div>

                    {Array.isArray(
                      selectedAttempt.strengths
                    ) &&
                    selectedAttempt.strengths
                      .length > 0 ? (

                      <ul>
                        {selectedAttempt.strengths.map(
                          (strength, index) => (
                            <li key={index}>
                              {strength}
                            </li>
                          )
                        )}
                      </ul>

                    ) : (

                      <p className="no-feedback">
                        No strengths recorded.
                      </p>

                    )}

                  </div>


                  <div className="feedback-card improvement-card">

                    <div className="feedback-title">
                      <FaLightbulb />

                      <strong>
                        Areas to Improve
                      </strong>
                    </div>

                    {Array.isArray(
                      selectedAttempt.improvements
                    ) &&
                    selectedAttempt.improvements
                      .length > 0 ? (

                      <ul>
                        {selectedAttempt.improvements.map(
                          (improvement, index) => (
                            <li key={index}>
                              {improvement}
                            </li>
                          )
                        )}
                      </ul>

                    ) : (

                      <p className="no-feedback">
                        No improvement areas
                        recorded.
                      </p>

                    )}

                  </div>

                </div>


                {/* ===============================
                    ANSWERS
                =============================== */}

                <div className="answers-section">

                  <div className="answers-header">

                    <div>
                      <h2>
                        Answers & Feedback
                      </h2>

                      <p>
                        Review the answers you
                        submitted during the
                        interview.
                      </p>
                    </div>

                    <span>
                      {answers.length} Questions
                    </span>

                  </div>


                  {answers.length === 0 ? (

                    <div className="no-answers">
                      No answers were recorded
                      for this interview.
                    </div>

                  ) : (

                    <div className="question-accordion">

                      {answers.map(
                        (answer, index) => {

                          const isOpen =
                            expandedQuestion ===
                            index;

                          return (
                            <div
                              key={
                                answer._id ||
                                index
                              }
                              className={`answer-item ${
                                isOpen
                                  ? "open"
                                  : ""
                              }`}
                            >

                              <button
                                type="button"
                                className="answer-question-header"
                                onClick={() =>
                                  setExpandedQuestion(
                                    isOpen
                                      ? -1
                                      : index
                                  )
                                }
                              >

                                <div>
                                  <span>
                                    {index + 1}.
                                  </span>

                                  <strong>
                                    {getQuestionText(
                                      answer
                                    )}
                                  </strong>
                                </div>


                                <div className="answer-header-right">

                                  <span className="answered-badge">
                                    Answered
                                  </span>

                                  {isOpen ? (
                                    <FaChevronUp />
                                  ) : (
                                    <FaChevronDown />
                                  )}

                                </div>

                              </button>


                              {isOpen && (

                                <div className="answer-content">

                                  <div className="your-answer-box">

                                    <span>
                                      Your Answer
                                    </span>

                                    <p>
                                      {getAnswerText(
                                        answer
                                      )}
                                    </p>

                                  </div>


                                  <div className="answer-evaluation-note">

                                    <FaCheckCircle />

                                    <span>
                                      This answer was
                                      included in the
                                      AI evaluation.
                                    </span>

                                  </div>

                                </div>

                              )}

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                </div>


                {/* ===============================
                    KEEP IMPROVING
                =============================== */}

                <div className="keep-improving">

                  <div className="keep-improving-icon">
                    <FaArrowUp />
                  </div>

                  <div>
                    <strong>
                      Keep Improving!
                    </strong>

                    <p>
                      Review your feedback and
                      practice the areas identified
                      by the AI evaluator.
                    </p>
                  </div>

                </div>

              </>

            ) : (

              <div className="results-no-selection">
                <FaQuestionCircle />

                <h2>
                  Select an interview
                </h2>

                <p>
                  Select an interview from the
                  list to view its complete
                  evaluation.
                </p>
              </div>

            )}

          </section>

        </section>

      </main>

    </div>
  );
};

export default Results;