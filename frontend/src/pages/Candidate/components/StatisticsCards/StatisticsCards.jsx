import {
  FaClipboardList,
  FaCheckCircle,
  FaChartLine,
  FaAward,
} from "react-icons/fa";

import "./StatisticsCards.css";

const StatisticsCards = ({ interviews }) => {
  const cards = [
    {
      title: "Available Interviews",
      value: interviews.length,
      icon: <FaClipboardList />,
      color: "#6366F1",
    },
    {
      title: "Completed",
      value: 0,
      icon: <FaCheckCircle />,
      color: "#10B981",
    },
    {
      title: "Average Score",
      value: "0%",
      icon: <FaChartLine />,
      color: "#F59E0B",
    },
    {
      title: "Certificates",
      value: 0,
      icon: <FaAward />,
      color: "#EC4899",
    },
  ];

  return (
    <div className="candidate-stats-grid">
      {cards.map((card) => (
        <div
          className="candidate-stats-card"
          key={card.title}
        >
          <div
            className="candidate-stats-icon"
            style={{ background: card.color }}
          >
            {card.icon}
          </div>

          <div className="candidate-stats-content">
            <h4>{card.title}</h4>
            <h2>{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;