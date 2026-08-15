import {
  FaArrowRight,
  FaCalendarAlt,
  FaRobot,
} from "react-icons/fa";

import "./ReportCard.css";

const ReportCard = ({ report }) => {
  const percentage = report.percentage || 0;

  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (percentage / 100) * circumference;

  const date = new Date(
    report.submittedAt
  ).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="candidate-report-row">

      <div className="candidate-report-left">

        <div className="candidate-mini-ring">

          <svg width="78" height="78">

            <circle
              cx="39"
              cy="39"
              r={radius}
              className="candidate-ring-bg"
            />

            <circle
              cx="39"
              cy="39"
              r={radius}
              className="candidate-ring-progress"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />

          </svg>

          <div className="candidate-ring-value">

            {percentage}%

          </div>

        </div>

        <div className="candidate-report-info">

          <h3>
            {report.interview?.title ||
              "Interview"}
          </h3>

          <span className="candidate-ai-chip">

            <FaRobot />

            AI Evaluated

          </span>

          <p>

            <FaCalendarAlt />

            {date}

          </p>

        </div>

      </div>

      <div className="candidate-report-right">

        <div className="candidate-score-box">

          <span>Score</span>

          <strong>

            {report.score}/100

          </strong>

        </div>

        <button className="candidate-report-btn">

          View Report

          <FaArrowRight />

        </button>

      </div>

    </div>
  );
};

export default ReportCard;