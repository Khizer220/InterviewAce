import "./InterviewPreview.css";

const InterviewPreview = ({
  interview,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !interview) return null;

  return (
    <div className="preview-overlay">
      <div className="preview-modal">

        {/* ================= HEADER ================= */}

        <div className="preview-header">
          <div>
            <h2>{interview.title}</h2>
            <p>{interview.description}</p>
          </div>

          <button
            className="close-preview"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* ================= SUMMARY ================= */}

        <div className="preview-info">

          <div className="info-card">
            <h4>Category</h4>
            <span>{interview.category?.name}</span>
          </div>

          <div className="info-card">
            <h4>Type</h4>
            <span>{interview.interviewType}</span>
          </div>

          <div className="info-card">
            <h4>Difficulty</h4>
            <span>{interview.difficulty}</span>
          </div>

          <div className="info-card">
            <h4>Duration</h4>
            <span>{interview.duration} Minutes</span>
          </div>

          <div className="info-card">
            <h4>Questions</h4>
            <span>{interview.questions?.length || 0}</span>
          </div>

        </div>

        {/* ================= INSTRUCTIONS ================= */}

        <div className="instruction-box">

          <h3>Instructions</h3>

          <p>
            {interview.instructions ||
              "No instructions added."}
          </p>

        </div>

        {/* ================= QUESTIONS ================= */}

        <div className="question-preview">

          <h3>
            Questions ({interview.questions?.length || 0})
          </h3>

          {interview.questions?.length ? (

            interview.questions.map((q, index) => (

              <div
                key={q._id}
                className="preview-question"
              >

                {/* Question Header */}

                <div className="question-header">

                  <div className="question-number">
                    {index + 1}
                  </div>

                  <div className="question-title">

                    <h4>{q.question}</h4>

                    <div className="question-meta">

                      {q.topic && (
                        <span className="meta-badge">
                          📚 {q.topic}
                        </span>
                      )}

                      <span className="meta-badge">
                        ⭐ {q.difficulty}
                      </span>

                      <span className="meta-badge">
                        💯 {q.marks} Marks
                      </span>

                      {q.source && (
                        <span className="meta-badge">
                          🤖 {q.source}
                        </span>
                      )}

                    </div>

                  </div>

                </div>

                {/* Expected Answer */}

                {q.expectedAnswer && (

                  <div className="ai-section">

                    <h5>💡 Expected Answer</h5>

                    <div className="answer-box">
                      {q.expectedAnswer}
                    </div>

                  </div>

                )}

                {/* Follow Up */}

                {q.followUpQuestion && (

                  <div className="ai-section">

                    <h5>❓ Follow-up Question</h5>

                    <div className="followup-box">
                      {q.followUpQuestion}
                    </div>

                  </div>

                )}

                {/* Evaluation Criteria */}

                {q.evaluationCriteria &&
                  q.evaluationCriteria.length > 0 && (

                  <div className="ai-section">

                    <h5>
                      ✅ Evaluation Criteria
                    </h5>

                    <ul className="criteria-list">

                      {q.evaluationCriteria.map(
                        (item, i) => (
                          <li key={i}>
                            {item}
                          </li>
                        )
                      )}

                    </ul>

                  </div>

                )}

              </div>

            ))

          ) : (

            <p>No Questions Added.</p>

          )}

        </div>

        {/* ================= FOOTER ================= */}

        <div className="preview-footer">

          <button
            className="close-btn"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default InterviewPreview;