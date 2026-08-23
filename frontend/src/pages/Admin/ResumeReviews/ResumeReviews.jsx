import { useEffect, useState } from "react";
import {
  FaFolderOpen,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaFilePdf,
  FaFileWord,
  FaEye,
  FaDownload,
  FaSearch,
} from "react-icons/fa";

import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";
import { getResumes } from "../../../services/adminService";

import "./ResumeReviews.css";

const API_ORIGIN = "http://localhost:5000";

const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const ResumeReviews = () => {
  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getResumes();
        setStats(result.stats);
        setResumes(result.resumes || []);
      } catch (err) {
        console.error("Get Resumes Error:", err);
        setError(err?.response?.data?.message || "Failed to load resumes.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const visibleResumes = resumes.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.candidate?.fullName?.toLowerCase().includes(q) ||
      r.candidate?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="resume-reviews-page">
        <div className="rr-header">
          <span className="rr-badge">Candidate Resumes</span>
          <h1>Resume Reviews</h1>
          <p>
            Review candidate resumes.{" "}
            <em>
              Role matching and AI analysis aren't built yet — this is upload/browse only for now.
            </em>
          </p>
        </div>

        {loading ? (
          <div className="rr-state">Loading resumes...</div>
        ) : error ? (
          <div className="rr-state error">{error}</div>
        ) : (
          <>
            <div className="rr-stats">
              <div className="rr-stat-card">
                <div className="rr-stat-icon purple"><FaFolderOpen /></div>
                <div>
                  <strong>{stats.total}</strong>
                  <span>Total Resumes</span>
                </div>
              </div>

              <div className="rr-stat-card">
                <div className="rr-stat-icon green"><FaCheckCircle /></div>
                <div>
                  <strong>{stats.analyzed}</strong>
                  <span>Analyzed</span>
                </div>
              </div>

              <div className="rr-stat-card">
                <div className="rr-stat-icon orange"><FaClock /></div>
                <div>
                  <strong>{stats.pending}</strong>
                  <span>Pending Analysis</span>
                </div>
              </div>

              <div className="rr-stat-card">
                <div className="rr-stat-icon red"><FaExclamationCircle /></div>
                <div>
                  <strong>{stats.failed}</strong>
                  <span>Analysis Failed</span>
                </div>
              </div>
            </div>

            <div className="rr-content">
              <div className="rr-toolbar">
                <div className="rr-search">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search candidates by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {visibleResumes.length === 0 ? (
                <div className="rr-state">
                  {resumes.length === 0
                    ? "No resumes have been uploaded yet."
                    : "No resumes match your search."}
                </div>
              ) : (
                <div className="rr-list">
                  {visibleResumes.map((r) => (
                    <div className="rr-row" key={r._id}>
                      <div className="rr-file-icon">
                        {r.fileType === "pdf" ? <FaFilePdf /> : <FaFileWord />}
                      </div>

                      <div className="rr-candidate-info">
                        <h4>{r.candidate?.fullName || "Unknown candidate"}</h4>
                        <p>{r.candidate?.email}</p>
                      </div>

                      <div className="rr-file-info">
                        <span>{r.originalFileName}</span>
                        <span className="rr-file-meta">
                          {formatBytes(r.fileSizeBytes)} · {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <span className={`rr-status ${r.analysisStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                        {r.analysisStatus}
                      </span>

                      <div className="rr-actions">
                        <a
                          href={`${API_ORIGIN}${r.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rr-action-btn"
                        >
                          <FaEye />
                          View
                        </a>
                        <a
                          href={`${API_ORIGIN}${r.fileUrl}`}
                          download={r.originalFileName}
                          className="rr-action-btn"
                        >
                          <FaDownload />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ResumeReviews;
