import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPublishedProblems,
} from "../../../../services/codingPracticeService";
import "./CodingList.css";

const DIFFICULTY_COLORS = {
  Beginner: "cp-diff-beginner",
  Intermediate: "cp-diff-intermediate",
  Advanced: "cp-diff-advanced",
};

const CodingList = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};

        if (search.trim()) {
          params.search = search.trim();
        }

        if (difficulty) {
          params.difficulty = difficulty;
        }

        const result = await getPublishedProblems(params);

        setProblems(result.problems || []);
      } catch (err) {
        console.error(err);
        setError("Couldn't load coding problems.");
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(load, 250);

    return () => clearTimeout(timeout);
  }, [search, difficulty]);

  const handleViewDetails = (e, problemId) => {
    e.stopPropagation();

    navigate(`/candidate/coding/${problemId}?view=details`);
  };

  const handleSolve = (e, problemId) => {
    e.stopPropagation();

    navigate(`/candidate/coding/${problemId}`);
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="cp-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="cp-header">

        <div>
          <span className="cp-eyebrow">
            INTERVIEWACE
          </span>

          <h1>
            Coding Practice
          </h1>

          <p>
            Practice real coding problems and improve your
            problem-solving skills.
          </p>
        </div>

      </div>


      {/* =====================================================
          SEARCH / FILTER
          ===================================================== */}

      <div className="cp-toolbar">

        <div className="cp-search-wrapper">

          <svg
            className="cp-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="text"
            placeholder="Search coding problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">
            All Difficulties
          </option>

          <option value="Beginner">
            Beginner
          </option>

          <option value="Intermediate">
            Intermediate
          </option>

          <option value="Advanced">
            Advanced
          </option>
        </select>

      </div>


      {/* =====================================================
          CONTENT
          ===================================================== */}

      {loading ? (

        <div className="cp-state">

          <div className="cp-loader" />

          <span>
            Loading coding problems...
          </span>

        </div>

      ) : error ? (

        <div className="cp-state cp-error">

          {error}

        </div>

      ) : problems.length === 0 ? (

        <div className="cp-state">

          <div className="cp-empty-icon">
            ?
          </div>

          <strong>
            No published problems yet
          </strong>

          <span>
            Try changing your search or difficulty filter.
          </span>

        </div>

      ) : (

        <div className="cp-list">

          {problems.map((p) => (

            <article
              className="cp-card"
              key={p._id}
              onClick={() =>
                navigate(`/candidate/coding/${p._id}`)
              }
            >

              {/* CARD TOP */}

              <div className="cp-card-top">

                <div className="cp-card-title">

                  <div className="cp-problem-icon">
                    {"</>"}
                  </div>

                  <div>

                    <h2>
                      {p.title}
                    </h2>

                    <span className="cp-category">
                      {p.category?.name ||
                        "Uncategorized"}
                    </span>

                  </div>

                </div>


                <span
                  className={`cp-diff ${
                    DIFFICULTY_COLORS[p.difficulty] || ""
                  }`}
                >
                  {p.difficulty}
                </span>

              </div>


              


              {/* META */}

              <div className="cp-meta">

                <div className="cp-meta-item">

                  <span className="cp-meta-label">
                    Language
                  </span>

                  <strong>
                    {p.languages?.length
                      ? p.languages.join(", ")
                      : "Not specified"}
                  </strong>

                </div>


                <div className="cp-meta-item">

                  <span className="cp-meta-label">
                    Acceptance
                  </span>

                  <strong>
                    {p.acceptanceRate ?? 0}%
                  </strong>

                </div>


                <div className="cp-meta-item">

                  <span className="cp-meta-label">
                    Submissions
                  </span>

                  <strong>
                    {p.totalSubmissions ?? 0}
                  </strong>

                </div>


                <div className="cp-meta-item">

                  <span className="cp-meta-label">
                    Added
                  </span>

                  <strong>
                    {formatDate(p.createdAt)}
                  </strong>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="cp-card-footer">

                <button
                  type="button"
                  className="cp-details-btn"
                  onClick={(e) =>
                    handleViewDetails(e, p._id)
                  }
                >
                  View Details
                </button>


                <button
                  type="button"
                  className="cp-solve-btn"
                  onClick={(e) =>
                    handleSolve(e, p._id)
                  }
                >
                  Solve Now

                  <span>
                    →
                  </span>

                </button>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  );
};

export default CodingList;