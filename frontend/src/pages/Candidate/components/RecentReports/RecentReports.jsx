import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import ReportCard from "../ReportCard/ReportCard";

import "./RecentReports.css";

const RecentReports = ({
  attempts = [],
  loading = false,
}) => {
  const navigate = useNavigate();

  const reports = attempts
    .filter(
      (attempt) =>
        attempt.status === "Evaluated"
    )
    .sort(
      (a, b) =>
        new Date(
          b.submittedAt ||
          b.createdAt
        ) -
        new Date(
          a.submittedAt ||
          a.createdAt
        )
    );

  return (
    <section className="candidate-reports-section">

      <div className="candidate-reports-header">

        <div className="candidate-report-left-header">

          <span className="candidate-report-label">
            AI Performance
          </span>

          <h2>
            Recent Reports
          </h2>

          <p>
            Review your latest AI evaluated interview
            performance.
          </p>

        </div>

        <button
          className="candidate-report-viewall"
          onClick={() =>
            navigate("/candidate/reports")
          }
        >
          View All
          <FaArrowRight />
        </button>

      </div>

      {loading ? (

        <div className="candidate-report-empty">
          Loading Reports...
        </div>

      ) : reports.length === 0 ? (

        <div className="candidate-report-empty">
          No interview reports available.
        </div>

      ) : (

        <div className="candidate-report-list">

          {reports
            .slice(0, 3)
            .map((report) => (

              <ReportCard
                key={report._id}
                report={report}
              />

            ))}

        </div>

      )}

    </section>
  );
};

export default RecentReports;