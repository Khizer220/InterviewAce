import {
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaFolderOpen,
  FaQuestionCircle,
} from "react-icons/fa";
import "./StatisticsCards.css";

const StatisticsCards = ({ stats }) => {
  const cards = [
    {
      title: "Templates",
      value: stats.total,
      icon: <FaClipboardList />,
      color: "#6366f1",
    },
    {
      title: "Active",
      value: stats.active,
      icon: <FaCheckCircle />,
      color: "#10b981",
    },
    {
      title: "Inactive",
      value: stats.inactive,
      icon: <FaTimesCircle />,
      color: "#ef4444",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: <FaFolderOpen />,
      color: "#3b82f6",
    },
    {
      title: "Questions",
      value: stats.questions,
      icon: <FaQuestionCircle />,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stats-card" key={card.title}>
          <div
            className="stats-icon"
            style={{ background: card.color }}
          >
            {card.icon}
          </div>

          <div className="stats-content">
            <h4>{card.title}</h4>
            <h2>{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;