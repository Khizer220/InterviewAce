import "./DashboardHeader.css";

const DashboardHeader = ({ user }) => {
  return (
    <div className="candidate-dashboard-header">

      <div className="header-left">

        <span className="welcome-badge">
          👋 Welcome Back
        </span>

        <h1>
          {user?.fullName || "Candidate"}
        </h1>

        <p>
          Continue your interview preparation and
          improve your chances of landing your dream job.
        </p>

      </div>

      <div className="header-right">

        <button className="resume-btn">
          Resume Review
        </button>

        <button className="start-btn">
          Start Practice
        </button>

      </div>

    </div>
  );
};

export default DashboardHeader;