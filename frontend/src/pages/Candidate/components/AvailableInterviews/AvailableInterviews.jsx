import "./AvailableInterviews.css";
import InterviewCard from "../InterviewCard/InterviewCard";

const AvailableInterviews = ({
  interviews,
  loading,
  onStartInterview,
}) => {
  return (
    <section className="available-section">

      <div className="section-header">

        <div>
          <h2>Available AI Interviews</h2>

          <p>
            Practice with AI-powered interview
            templates prepared by recruiters.
          </p>
        </div>

      </div>

      {loading ? (

        <div className="empty-box">
          <h3>Loading interviews...</h3>
        </div>

      ) : interviews.length === 0 ? (

        <div className="empty-box">
          <h3>No Interviews Available</h3>

          <p>
            Please check again later.
          </p>
        </div>

      ) : (

        <div className="interview-grid">

          {interviews.map((interview) => (

            <InterviewCard
              key={interview._id}
              interview={interview}
              onStart={() =>
                onStartInterview(interview)
              }
            />

          ))}

        </div>

      )}

    </section>
  );
};

export default AvailableInterviews;