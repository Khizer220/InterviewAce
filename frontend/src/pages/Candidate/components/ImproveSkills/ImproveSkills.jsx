import { FaChevronRight, FaLightbulb } from "react-icons/fa";

import "./ImproveSkills.css";

const ImproveSkills = ({
  attempts = [],
}) => {

  const recentEvaluated = attempts
    .filter(
      (attempt) =>
        attempt.status === "Evaluated" &&
        Array.isArray(
          attempt.improvements
        )
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
    )
    .slice(0, 3);

  const seen = new Set();
  const suggestions = [];

  recentEvaluated.forEach(
    (attempt) => {

      attempt.improvements.forEach(
        (improvement) => {

          if (
            typeof improvement !==
            "string"
          ) {
            return;
          }

          const text =
            improvement.trim();

          if (!text) {
            return;
          }

          const key =
            text.toLowerCase();

          if (!seen.has(key)) {
            seen.add(key);
            suggestions.push(text);
          }

        }
      );

    }
  );

  return (
    <section className="improve-card">

      <span className="improve-badge">
        Enhance Yourself
      </span>

      <h2>
        Improve Your Skills
      </h2>

      <p className="improve-subtitle">
        Personalized suggestions generated
        from your recent AI-evaluated
        interviews.
      </p>

      <div className="improve-list">

        {suggestions.length === 0 ? (

          <p
            style={{
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            Complete an AI-evaluated interview
            to get personalized suggestions
            here.
          </p>

        ) : (

          suggestions
            .slice(0, 4)
            .map((tip, index) => (

              <div
                className="improve-item"
                key={index}
              >

                <div className="improve-left">

                  <div className="improve-icon">
                    <FaLightbulb />
                  </div>

                  <span>
                    {tip}
                  </span>

                </div>

                <FaChevronRight
                  className="improve-arrow"
                />

              </div>

            ))

        )}

      </div>

    </section>
  );
};

export default ImproveSkills;