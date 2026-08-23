import { useNavigate } from "react-router-dom";

import styles from "./TopPerformingQuestions.module.css";

const TopPerformingQuestions = ({ questions = [] }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Top Performing Questions</h2>
          <p className={styles.caption}>
            Avg Score reflects the overall interview score where each question appeared — not individual
            per-question grading.
          </p>
        </div>
        <button type="button" onClick={() => navigate("/admin/questions")}>
          View All
        </button>
      </div>

      {questions.length === 0 ? (
        <p className={styles.empty}>No questions have been attempted yet.</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Question</span>
            <span>Category</span>
            <span>Attempts</span>
            <span>Avg Score</span>
          </div>

          {questions.map((q, index) => (
            <div className={styles.row} key={index}>
              <span className={styles.questionText}>{q.question}</span>
              <span className={styles.categoryText}>{q.category}</span>
              <span className={styles.attemptsText}>{q.attempts}</span>
              <span className={styles.scoreCell}>
                <span className={styles.scoreTrack}>
                  <span
                    className={styles.scoreFill}
                    style={{ width: `${q.avgScore ?? 0}%` }}
                  />
                </span>
                {q.avgScore === null ? "—" : `${q.avgScore}%`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopPerformingQuestions;
