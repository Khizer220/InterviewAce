import {
  FaRobot,
  FaFileAlt,
  FaCode,
  FaChartLine,
} from "react-icons/fa";

import styles from "./AIInsights.module.css";

const AIInsights = () => {
  const insights = [
    {
      title: "AI Feedback",
      value: 256,
      icon: <FaRobot />,
      color: "#6C4CF1",
    },
    {
      title: "Resume Reviews",
      value: 132,
      icon: <FaFileAlt />,
      color: "#10B981",
    },
    {
      title: "Coding Challenges",
      value: 81,
      icon: <FaCode />,
      color: "#F59E0B",
    },
    {
      title: "Success Rate",
      value: "82%",
      icon: <FaChartLine />,
      color: "#3B82F6",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🤖 AI Insights</h2>
        <span>Today's Overview</span>
      </div>

      <div className={styles.grid}>
        {insights.map((item, index) => (
          <div
            key={index}
            className={styles.card}
          >
            <div
              className={styles.icon}
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <div>
              <h3>{item.value}</h3>
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;