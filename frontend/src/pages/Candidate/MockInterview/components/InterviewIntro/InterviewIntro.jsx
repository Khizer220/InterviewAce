import "./InterviewIntro.css";

const InterviewIntro = ({ interview, onStart }) => {
  if (!interview) return null;

  const questionCount = interview.questions?.length || 0;

  return (
    <div className="intro-page">
      <div className="intro-card">

        {/* Header */}
        <div className="intro-header">
          <span className="intro-badge">
            <span className="badge-star">✦</span>
            AI Mock Interview
          </span>

          <h1>{interview.title}</h1>

          <p>
            {interview.description ||
              "Get ready for your AI-powered mock interview."}
          </p>
        </div>

        {/* Interview Information */}
        <div className="intro-stats">

          <div className="intro-stat">
            <div className="stat-icon">⌘</div>
            <div className="stat-info">
              <span>Category</span>
              <strong>
                {interview.category?.name || "General"}
              </strong>
            </div>
          </div>

          <div className="intro-stat">
            <div className="stat-icon">⌁</div>
            <div className="stat-info">
              <span>Interview Type</span>
              <strong>
                {interview.interviewType || "Technical"}
              </strong>
            </div>
          </div>

          <div className="intro-stat">
            <div className="stat-icon">▥</div>
            <div className="stat-info">
              <span>Difficulty</span>
              <strong>
                {interview.difficulty || "Beginner"}
              </strong>
            </div>
          </div>

          <div className="intro-stat">
            <div className="stat-icon">◷</div>
            <div className="stat-info">
              <span>Duration</span>
              <strong>
                {interview.duration || 0} Minutes
              </strong>
            </div>
          </div>

          <div className="intro-stat">
            <div className="stat-icon">☷</div>
            <div className="stat-info">
              <span>Questions</span>
              <strong>{questionCount}</strong>
            </div>
          </div>

        </div>

        {/* Instructions */}
        <section className="instruction-box">

          <div className="instruction-header">

            <div className="instruction-main-icon">
              ✦
            </div>

            <div>
              <h2>Before You Begin</h2>
              <p>
                Please read the following instructions carefully.
              </p>
            </div>

          </div>

          <div className="instruction-divider"></div>

          <div className="instruction-grid">

            <div className="instruction-item">
              <div className="instruction-number">01</div>

              <div>
                <h3>Read every question carefully</h3>
                <p>
                  Take a moment to understand each question
                  before answering.
                </p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-number">02</div>

              <div>
                <h3>Complete within the time limit</h3>
                <p>
                  Make sure you complete the interview before
                  the timer ends.
                </p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-number">03</div>

              <div>
                <h3>Do not refresh the page</h3>
                <p>
                  Refreshing or leaving the page may interrupt
                  your interview.
                </p>
              </div>
            </div>

            <div className="instruction-item">
              <div className="instruction-number">04</div>

              <div>
                <h3>Your answers are AI evaluated</h3>
                <p>
                  Your responses will be analyzed and evaluated
                  by AI.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* Timer Notice */}
        <div className="intro-notice">
          <div className="notice-icon">i</div>

          <div className="notice-content">
            <p>
              Once you start the interview, the timer will begin
              automatically.
            </p>

            <strong>
              Make sure you are ready before proceeding.
            </strong>
          </div>
        </div>

        {/* Start */}
        <button
          type="button"
          className="start-interview-btn"
          onClick={onStart}
        >
          <span>Start Interview</span>
          <span className="start-arrow">→</span>
        </button>

      </div>
    </div>
  );
};

export default InterviewIntro;