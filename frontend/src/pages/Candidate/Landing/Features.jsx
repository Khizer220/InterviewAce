import "./Features.css";
import {
  FaRobot,
  FaCode,
  FaFileAlt,
  FaChartLine,
} from "react-icons/fa";

const features = [
  {
    icon: <FaRobot />,
    title: "AI Mock Interviews",
    description:
      "Practice HR and technical interviews with instant AI-powered feedback.",
  },
  {
    icon: <FaCode />,
    title: "Coding Assessments",
    description:
      "Solve coding challenges in a real coding environment with performance tracking.",
  },
  {
    icon: <FaFileAlt />,
    title: "Resume Analyzer",
    description:
      "Analyze your resume, improve ATS score and receive personalized suggestions.",
  },
  {
    icon: <FaChartLine />,
    title: "Performance Analytics",
    description:
      "Track interview scores, coding progress and skill improvements visually.",
  },
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="section-header">
        <span>OUR FEATURES</span>
        <h2>Everything You Need to Ace Interviews</h2>
        <p>
          InterviewAce combines AI, coding practice and analytics into one
          modern interview preparation platform.
        </p>
      </div>

      <div className="feature-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;