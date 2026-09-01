import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./QuestionScreen.css";

const API = "http://localhost:5000/api";

const QuestionScreen = ({ interview }) => {
  const navigate = useNavigate();

  const questions = interview.questions || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(
    interview.duration * 60
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================
  // TIMER
  // =========================================

  useEffect(() => {
    if (timeLeft <= 0) {
      submitInterview();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // =========================================
  // NO QUESTIONS
  // =========================================

  if (questions.length === 0) {
    return (
      <div className="question-screen">
        <div className="question-card empty-question-card">
          <div className="empty-icon">?</div>

          <h2>No Questions Found</h2>

          <p>
            This interview does not contain any questions.
          </p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  // =========================================
  // PROGRESS
  // =========================================

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  // =========================================
  // TIMER
  // =========================================

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;

  // =========================================
  // ANSWER CHANGE
  // =========================================

  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [question._id]: e.target.value,
    });
  };

  // =========================================
  // SUBMIT INTERVIEW
  // =========================================

  const submitInterview = async () => {
    if (isSubmitting) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    console.log("===== SUBMIT CLICKED =====");

    try {
      const formattedAnswers = Object.entries(
        answers
      ).map(([question, answer]) => ({
        question,
        answer,
      }));

      const payload = {
        interview: interview._id,
        answers: formattedAnswers,
      };

      console.log("================================");
      console.log("Payload:");
      console.log(payload);
      console.log("================================");

      const response = await axios.post(
        `${API}/interview-attempts`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("================================");
      console.log("Response:");
      console.log(response.data);
      console.log("================================");

      alert("Interview Submitted Successfully!");

      navigate("/candidate/performance");

    } catch (err) {
      console.error("FULL ERROR:", err);

      console.log(
        "STATUS:",
        err.response?.status
      );

      console.log(
        "MESSAGE:",
        err.response?.data?.message
      );

      if (err.response?.status === 401) {
        alert(
          "Your session has expired. Please login again."
        );

        localStorage.removeItem("token");
        navigate("/login");

        return;
      }

      alert(
        err.response?.data?.message ||
        "Failed to submit interview."
      );

      setIsSubmitting(false);
    }
  };

  // =========================================
  // NEXT
  // =========================================

  const handleNext = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    } else {
      submitInterview();
    }
  };

  // =========================================
  // PREVIOUS
  // =========================================

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  // =========================================
  // CURRENT ANSWER
  // =========================================

  const currentAnswer =
    answers[question._id] || "";

  return (
    <div className="question-screen">

      <div className="question-card">

        {/* HEADER */}

        <div className="question-header">

          <div>

            <h1>
              {interview.title}
            </h1>

            <p>
              Question{" "}
              <strong>
                {currentQuestion + 1}
              </strong>{" "}
              of {questions.length}
            </p>

          </div>

          <div className="question-timer">

            <span className="timer-icon">
              ◷
            </span>

            <span>
              {formattedTime}
            </span>

            <small>
              Remaining
            </small>

          </div>

        </div>

        {/* PROGRESS */}

        <div className="progress-wrapper">

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* QUESTION SECTION */}

        <section className="question-section">

          <div className="section-label">

            <span className="section-icon question-icon">
              ?
            </span>

            <div>

              <span className="section-title">
                Question
              </span>

              <span className="section-subtitle">
                Read the question carefully
              </span>

            </div>

          </div>

          <div className="question-content">

            <h2>
              {question.question}
            </h2>

          </div>

          {question.topic && (
            <div className="question-topic">
              Topic: {question.topic}
            </div>
          )}

        </section>

        {/* ANSWER SECTION */}

        <section className="answer-section">

          <div className="section-label">

            <span className="section-icon answer-icon">
              ✎
            </span>

            <div>

              <span className="section-title">
                Your Answer
              </span>

              <span className="section-subtitle">
                Write your answer below
              </span>

            </div>

          </div>

          <div className="answer-input-wrapper">

            <textarea
              value={currentAnswer}
              onChange={handleChange}
              placeholder="Type your answer here..."
              maxLength={2000}
              disabled={isSubmitting}
            />

            <div className="answer-footer">

              <span>
                Your answer will be evaluated by AI.
              </span>

              <span>
                {currentAnswer.length} / 2000
              </span>

            </div>

          </div>

        </section>

        {/* NAVIGATION */}

        <div className="navigation">

          <button
            type="button"
            className="previous-btn"
            disabled={
              currentQuestion === 0 ||
              isSubmitting
            }
            onClick={handlePrevious}
          >
            <span>←</span>
            Previous
          </button>

          <div className="navigation-info">
            {currentQuestion + 1} /{" "}
            {questions.length}
          </div>

          {currentQuestion ===
          questions.length - 1 ? (

            <button
              type="button"
              className="submit-btn"
              onClick={submitInterview}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Interview"}

              {!isSubmitting && (
                <span>✓</span>
              )}
            </button>

          ) : (

            <button
              type="button"
              className="next-btn"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next Question
              <span>→</span>
            </button>

          )}

        </div>

      </div>

    </div>
  );
};

export default QuestionScreen;