import { useEffect, useState } from "react";
import axios from "axios";
import "./QuestionScreen.css";

const API = "http://localhost:5000/api";

const QuestionScreen = ({ interview }) => {
  const questions = interview.questions || [];

  const user = JSON.parse(localStorage.getItem("user"));

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(
    interview.duration * 60
  );

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

  if (questions.length === 0) {
    return (
      <div className="question-screen">
        <div className="question-card">
          <h2>No Questions Found</h2>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;

  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [question._id]: e.target.value,
    });
  };

  const submitInterview = async () => {
    console.log("===== SUBMIT CLICKED =====");

    try {
      const formattedAnswers = Object.entries(
        answers
      ).map(([question, answer]) => ({
        question,
        answer,
      }));

      const payload = {
        candidate: user.id,
        interview: interview._id,
        answers: formattedAnswers,
      };

      console.log("================================");
      console.log("Payload:");
      console.log(payload);
      console.log("================================");

      const response = await axios.post(
        `${API}/interview-attempts`,
        payload
      );

      console.log("================================");
      console.log("Response:");
      console.log(response.data);
      console.log("================================");

      alert("Interview Submitted Successfully!");

    } catch (err) {

      console.error("FULL ERROR:", err);

      if (err.response) {
       console.log("STATUS:", err.response.status);
console.log("MESSAGE:", err.response.data.message);
console.log("FULL DATA:", JSON.stringify(err.response.data, null, 2));
      } else {
        console.log("ERROR:", err.message);
      }

      alert("Failed to submit interview.");
    }
  };

  return (
    <div className="question-screen">

      <div className="question-card">

        <h1>{interview.title}</h1>

        <p>
          Question {currentQuestion + 1} of{" "}
          {questions.length}
        </p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="timer">
          ⏱ {formattedTime} Remaining
        </div>

        <div className="question-box">

          <h2>{question.question}</h2>

          <textarea
            rows="8"
            placeholder="Type your answer here..."
            value={answers[question._id] || ""}
            onChange={handleChange}
          />

        </div>

        <div className="navigation">

          <button
            disabled={currentQuestion === 0}
            onClick={() =>
              setCurrentQuestion(currentQuestion - 1)
            }
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              className="submit-btn"
              onClick={submitInterview}
            >
              Submit Interview
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentQuestion(currentQuestion + 1)
              }
            >
              Next
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default QuestionScreen;