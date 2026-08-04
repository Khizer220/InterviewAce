import "./InterviewIntro.css";

const InterviewIntro = ({
  interview,
  onStart,
}) => {
  if (!interview) return null;

  return (
    <div className="intro-page">

      <div className="intro-card">

        <div className="intro-top">

          <span className="intro-badge">
            AI Mock Interview
          </span>

          <h1>{interview.title}</h1>

          <p>{interview.description}</p>

        </div>

        <div className="intro-stats">

          <div className="intro-stat">
            <h4>Category</h4>
            <span>
              {interview.category?.name}
            </span>
          </div>

          <div className="intro-stat">
            <h4>Difficulty</h4>
            <span>
              {interview.difficulty}
            </span>
          </div>

          <div className="intro-stat">
            <h4>Duration</h4>
            <span>
              {interview.duration} Minutes
            </span>
          </div>

          <div className="intro-stat">
            <h4>Questions</h4>
            <span>
              {interview.questions?.length || 0}
            </span>
          </div>

        </div>

        <div className="instruction-box">

          <h2>Instructions</h2>

          <ul>

            <li>
              Read every question carefully.
            </li>

            <li>
              Complete the interview before the timer ends.
            </li>

            <li>
              Do not refresh the page.
            </li>

            <li>
              Your answers will be evaluated by AI.
            </li>

          </ul>

        </div>

        <button
          className="start-interview-btn"
          onClick={onStart}
        >
          Start Interview
        </button>

      </div>
    </div>
  );
};

export default InterviewIntro;