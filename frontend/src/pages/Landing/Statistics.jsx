import "./Statistics.css";
import {
  FaBriefcase,
  FaCode,
  FaRobot,
  FaFileAlt,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaBriefcase />,
    value: "10+",
    label: "Interview Categories",
  },
  {
    icon: <FaCode />,
    value: "500+",
    label: "Coding Problems",
  },
  {
    icon: <FaRobot />,
    value: "AI",
    label: "Feedback Engine",
  },
  {
    icon: <FaFileAlt />,
    value: "ATS",
    label: "Resume Analysis",
  },
];

const Statistics = () => {
  return (
    <section className="statistics">
      <div className="section-header">
        <span>PLATFORM HIGHLIGHTS</span>
        <h2>Everything in One Place</h2>
      </div>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon">{item.icon}</div>

            <h3>{item.value}</h3>

            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;