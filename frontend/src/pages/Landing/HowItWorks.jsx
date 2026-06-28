import "./HowItWorks.css";
import {
  FaUserPlus,
  FaClipboardList,
  FaLaptopCode,
  FaChartLine,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus />,
    title: "Create Account",
    description: "Sign up and complete your profile in minutes.",
  },
  {
    icon: <FaClipboardList />,
    title: "Choose Interview",
    description: "Select HR, Technical or Coding Assessment.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Take Interview",
    description: "Answer questions and solve coding challenges.",
  },
  {
    icon: <FaChartLine />,
    title: "Get AI Feedback",
    description: "Receive scores, analytics and improvement tips.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-section" id="how">
      <div className="section-header">
        <span>HOW IT WORKS</span>
        <h2>Simple. Smart. Effective.</h2>
      </div>

      <div className="timeline">
        {steps.map((step, index) => (
          <div className="step-card" key={index}>
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>

            {index !== steps.length - 1 && (
              <div className="line"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;