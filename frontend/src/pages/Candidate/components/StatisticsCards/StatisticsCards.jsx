import {
  FaClipboardList,
  FaChartLine,
  FaFolderOpen,
  FaBookmark,
} from "react-icons/fa";

import "./StatisticsCards.css";

const StatisticsCards = ({ attempts = [] }) => {
  const completedAttempts = attempts.filter(
    (attempt) =>
      attempt.status === "Completed" ||
      attempt.status === "Evaluated"
  );

  const evaluatedAttempts = attempts.filter(
    (attempt) =>
      attempt.status === "Evaluated"
  );

  const scores = evaluatedAttempts
    .map((attempt) =>
      Number(attempt.percentage)
    )
    .filter(
      (score) =>
        !Number.isNaN(score)
    );

  const average =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (sum, score) =>
              sum + score,
            0
          ) / scores.length
        )
      : 0;

  const cards = [
    {
      title: "Interviews Taken",
      value: completedAttempts.length,
      subtitle: "Completed Interviews",
      icon: <FaClipboardList />,
      color: "#7C5CFC",
      background: "#F3EEFF",
    },
    {
      title: "Average Score",
      value: `${average}%`,
      subtitle: "AI Evaluation",
      icon: <FaChartLine />,
      color: "#22C55E",
      background: "#ECFDF5",
    },
    {
      title: "Reports",
      value: evaluatedAttempts.length,
      subtitle: "Generated Reports",
      icon: <FaFolderOpen />,
      color: "#3B82F6",
      background: "#EFF6FF",
    },
    {
      title: "Bookmarks",
      value: 0,
      subtitle: "Saved Interviews",
      icon: <FaBookmark />,
      color: "#F59E0B",
      background: "#FFF7ED",
    },
  ];

  return (
    <div className="candidate-stats-grid">
      {cards.map((card) => (
        <div
          key={card.title}
          className="candidate-stat-card"
        >
          <div
            className="candidate-stat-icon"
            style={{
              background:
                card.background,
              color: card.color,
            }}
          >
            {card.icon}
          </div>

          <div className="candidate-stat-content">

            <span className="candidate-stat-title">
              {card.title}
            </span>

            <h2>
              {card.value}
            </h2>

            <p>
              {card.subtitle}
            </p>

          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;