import { useEffect, useRef, useState } from "react";

import {
  FaFileUpload,
  FaFilePdf,
  FaFileWord,
  FaEye,
  FaTrash,
  FaSyncAlt,
} from "react-icons/fa";

import { getMyResume, uploadResume, deleteMyResume } from "../../../services/resumeService";

import "./Resume.css";

const API_ORIGIN = "http://localhost:5000";

const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const loadResume = async () => {
    try {
      setLoading(true);
      const result = await getMyResume();
      setResume(result.resume);
    } catch (err) {
      console.error("Get My Resume Error:", err);
      setError("Couldn't load your resume. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  const handleFile = async (file) => {
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const result = await uploadResume(file);
      setResume(result.resume);
    } catch (err) {
      console.error("Upload Resume Error:", err);
      setError(err?.response?.data?.message || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete your resume? You'll need to upload a new one to apply with it again.");
    if (!confirmed) return;

    try {
      await deleteMyResume();
      setResume(null);
    } catch (err) {
      console.error("Delete Resume Error:", err);
      alert(err?.response?.data?.message || "Failed to delete resume.");
    }
  };

  return (
    <div className="resume-page">
      <div className="resume-header">
        <span className="resume-badge">Resume</span>
        <h1>Your Resume</h1>
        <p>Upload your resume so it can be reviewed alongside your interview performance.</p>
      </div>

      {loading ? (
        <div className="resume-state">Loading...</div>
      ) : (
        <>
          {error && <div className="resume-error">{error}</div>}

          <div
            className={`resume-dropzone ${dragActive ? "active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaFileUpload className="resume-dropzone-icon" />
            <h3>{uploading ? "Uploading..." : "Upload your resume"}</h3>
            <p>PDF or DOCX, up to 5MB. Click to browse or drag and drop.</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleInputChange}
              hidden
            />
          </div>

          {resume && (
            <div className="resume-current-card">
              <div className="resume-current-icon">
                {resume.fileType === "pdf" ? <FaFilePdf /> : <FaFileWord />}
              </div>

              <div className="resume-current-info">
                <h4>{resume.originalFileName}</h4>
                <p>
                  Uploaded {new Date(resume.createdAt).toLocaleDateString()} · {formatBytes(resume.fileSizeBytes)}
                </p>
                <span className={`resume-status ${resume.analysisStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                  {resume.analysisStatus}
                </span>
              </div>

              <div className="resume-current-actions">
                <a
                  href={`${API_ORIGIN}${resume.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-action-btn"
                >
                  <FaEye />
                  View
                </a>

                <button
                  type="button"
                  className="resume-action-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaSyncAlt />
                  Replace
                </button>

                <button type="button" className="resume-action-btn danger" onClick={handleDelete}>
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Resume;
