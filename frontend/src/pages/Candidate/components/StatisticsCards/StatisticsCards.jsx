import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaClipboardList,
  FaChartLine,
  FaFolderOpen,
  FaBookmark,
} from "react-icons/fa";

import "./StatisticsCards.css";

const API = "http://localhost:5000/api";

const StatisticsCards = ({ interviews = [] }) => {
  const [stats, setStats] = useState({
    attempts: 0,
    average: 0,
    reports: 0,
    bookmarks: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${API}/interview-attempts/candidate/${user.id}`
      );

      const attempts = res.data.attempts || [];

      const average =
        attempts.length > 0
          ? Math.round(
              attempts.reduce(
                (sum, item) => sum + item.percentage,
                0
              ) / attempts.length
            )
          : 0;

      const reports = attempts.filter(
        (item) => item.status === "Evaluated"
      ).length;

      setStats({
        attempts: attempts.length,
        average,
        reports,
        bookmarks: 0,
      });

    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    {
      title: "Interviews Taken",
      value: stats.attempts,
      subtitle: "Completed Interviews",
      icon: <FaClipboardList />,
      color: "#7C5CFC",
      background: "#F3EEFF",
    },
    {
      title: "Average Score",
      value: `${stats.average}%`,
      subtitle: "AI Evaluation",
      icon: <FaChartLine />,
      color: "#22C55E",
      background: "#ECFDF5",
    },
    {
      title: "Reports",
      value: stats.reports,
      subtitle: "Generated Reports",
      icon: <FaFolderOpen />,
      color: "#3B82F6",
      background: "#EFF6FF",
    },
    {
      title: "Bookmarks",
      value: stats.bookmarks,
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
              background: card.background,
              color: card.color,
            }}
          >
            {card.icon}
          </div>

          <div className="candidate-stat-content">
            <span className="candidate-stat-title">
              {card.title}
            </span>

            <h2>{card.value}</h2>

            <p>{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;