import robotImage from "../../../assets/robot.png";

import "./LoginLeft.css";

const LoginLeft = () => {
  return (
    <div className="login-left">

      <div className="left-glow glow-1"></div>
      <div className="left-glow glow-2"></div>

      {/* Logo */}
      <div className="login-brand">

        <div className="brand-icon">
          ✦
        </div>

        <h1>
          Interview<span>Ace</span>
        </h1>

      </div>

      {/* Hero Content */}
      <div className="hero-content">

        <span className="hero-tag">
          AI Powered Platform
        </span>

        <h2>
          Ace Every <br />
          Interview with AI <br />
          Confidence
        </h2>

        <p>
          Practice smarter, receive AI-powered feedback,
          and improve your interview skills step by step.
        </p>

      </div>

      {/* Robot */}
      <div className="hero-robot">

        <img
          src={robotImage}
          alt="InterviewAce AI Assistant"
        />

      </div>

    </div>
  );
};

export default LoginLeft;