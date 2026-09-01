import { useEffect, useRef, useState } from "react";

import {
  FaFileUpload,
  FaFilePdf,
  FaFileWord,
  FaEye,
  FaTrash,
  FaSyncAlt,
  FaShieldAlt,
  FaFolderOpen,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";

import { renderAsync } from "docx-preview";

import {
  getMyResume,
  uploadResume,
  deleteMyResume,
} from "../../../services/resumeService";

import Sidebar from "../components/Sidebar/Sidebar";

import "./Resume.css";

const API_ORIGIN = "http://localhost:5000";

const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(1)} MB`;
};

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  // =========================================
  // LOAD RESUME
  // =========================================

  const loadResume = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMyResume();

      setResume(result.resume);
    } catch (err) {
      console.error("Get My Resume Error:", err);

      setError(
        "Couldn't load your resume. Please refresh."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  // =========================================
  // HANDLE FILE
  // =========================================

  const handleFile = async (file) => {
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const result = await uploadResume(file);

      setResume(result.resume);
    } catch (err) {
      console.error("Upload Resume Error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to upload resume."
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================================
  // FILE INPUT
  // =========================================

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];

    handleFile(file);

    e.target.value = "";
  };

  // =========================================
  // DRAG & DROP
  // =========================================

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    handleFile(file);
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete your resume? You'll need to upload a new one to apply with it again."
    );

    if (!confirmed) return;

    try {
      await deleteMyResume();

      setResume(null);
      setError(null);
    } catch (err) {
      console.error("Delete Resume Error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to delete resume."
      );
    }
  };

  // =========================================
  // FILE PICKER
  // =========================================

  const openFilePicker = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  // =========================================
  // STATUS
  // =========================================

  const getStatusClass = () => {
    if (!resume?.analysisStatus) {
      return "";
    }

    return resume.analysisStatus
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // =========================================
  // OPEN RESUME PREVIEW
  // =========================================

  const handleView = async () => {
    if (!resume) return;

    setShowPreview(true);
    setPreviewError("");

    // PDF is supported directly by the browser
    if (resume.fileType === "pdf") {
      return;
    }

    // DOCX preview
    try {
      setPreviewLoading(true);

      const response = await fetch(
        `${API_ORIGIN}${resume.fileUrl}`
      );

      if (!response.ok) {
        throw new Error("Unable to load resume");
      }

      const blob = await response.blob();

      if (previewRef.current) {
        previewRef.current.innerHTML = "";

        await renderAsync(
          blob,
          previewRef.current,
          null,
          {
            className: "docx-preview",
            inWrapper: true,
            breakPages: true,
            renderHeaders: true,
            renderFooters: true,
            renderFootnotes: true,
            useBase64URL: true,
          }
        );
      }
    } catch (err) {
      console.error("Resume Preview Error:", err);

      setPreviewError(
        "Unable to preview this resume."
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  // =========================================
  // CLOSE PREVIEW
  // =========================================

  const closePreview = () => {
    setShowPreview(false);
    setPreviewLoading(false);
    setPreviewError("");

    if (previewRef.current) {
      previewRef.current.innerHTML = "";
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="candidate-resume-layout">
        <Sidebar />

        <main className="resume-page">
          <div className="resume-container">
            <div className="resume-loading">
              <div className="resume-loading-spinner"></div>
              <p>Loading your resume...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="candidate-resume-layout">

      {/* EXISTING CANDIDATE SIDEBAR */}
      <Sidebar />

      {/* RESUME CONTENT */}
      <main className="resume-page">

        <div className="resume-container">

          {/* HEADER */}

          <div className="resume-header">

            <div className="resume-header-icon">
              <FaFileUpload />
            </div>

            <div>
              <span className="resume-badge">
                Resume
              </span>

              <h1>Your Resume</h1>

              <p>
                Upload your resume so it can be reviewed
                alongside your interview performance.
              </p>
            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="resume-error">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}


          {/* UPLOAD */}

          <section
            className={`resume-upload-area ${
              dragActive ? "drag-active" : ""
            } ${uploading ? "uploading" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >

            <div className="resume-upload-icon">
              <FaFileUpload />
            </div>

            <h2>
              {uploading
                ? "Uploading your resume..."
                : resume
                  ? "Replace your resume"
                  : "Upload your resume"}
            </h2>

            <p className="resume-upload-description">
              PDF or DOCX, up to 5MB
            </p>

            <button
              type="button"
              className="choose-file-btn"
              onClick={openFilePicker}
              disabled={uploading}
            >
              <FaFolderOpen />

              {uploading
                ? "Uploading..."
                : resume
                  ? "Choose New File"
                  : "Choose File"}
            </button>

            <p className="resume-drag-text">
              or drag and drop your file here
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleInputChange}
              hidden
            />

          </section>


          {/* CURRENT RESUME */}

          {resume && (
            <section className="resume-current-wrapper">

              <div className="resume-current-heading">

                <div>
                  <h2>Current Resume</h2>

                  <p>
                    Your uploaded resume
                  </p>
                </div>

                <span
                  className={`resume-status ${getStatusClass()}`}
                >
                  {resume.analysisStatus}
                </span>

              </div>


              <div className="resume-file-card">

                <div
                  className={`resume-file-icon ${
                    resume.fileType === "pdf"
                      ? "pdf"
                      : "word"
                  }`}
                >
                  {resume.fileType === "pdf" ? (
                    <FaFilePdf />
                  ) : (
                    <FaFileWord />
                  )}
                </div>


                <div className="resume-file-info">

                  <h3>
                    {resume.originalFileName}
                  </h3>

                  <p>
                    Uploaded{" "}
                    {new Date(
                      resume.createdAt
                    ).toLocaleDateString()}{" "}
                    ·{" "}
                    {formatBytes(
                      resume.fileSizeBytes
                    )}
                  </p>

                </div>


                <div className="resume-file-actions">

                  {/* VIEW - NOW OPENS PREVIEW */}
                  <button
                    type="button"
                    className="resume-action-btn view"
                    onClick={handleView}
                  >
                    <FaEye />
                    <span>View</span>
                  </button>


                  <button
                    type="button"
                    className="resume-action-btn"
                    onClick={openFilePicker}
                    disabled={uploading}
                  >
                    <FaSyncAlt />
                    <span>Replace</span>
                  </button>


                  <button
                    type="button"
                    className="resume-action-btn delete"
                    onClick={handleDelete}
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>

                </div>

              </div>

            </section>
          )}


          {/* SECURITY */}

          <div className="resume-security">

            <div className="resume-security-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h3>Your resume is secure</h3>

              <p>
                Your resume is securely stored and will
                only be used for evaluation purposes.
              </p>
            </div>

          </div>

        </div>

      </main>


      {/* =========================================
          RESUME PREVIEW
          This does NOT change the Resume page UI.
      ========================================= */}

      {showPreview && resume && (
        <div
          className="resume-preview-overlay"
          onMouseDown={(e) => {
            if (
              e.target.classList.contains(
                "resume-preview-overlay"
              )
            ) {
              closePreview();
            }
          }}
        >

          <div className="resume-preview-modal">

            <div className="resume-preview-header">

              <div>
                <h2>
                  {resume.originalFileName}
                </h2>

                <span>
                  Resume Preview
                </span>
              </div>

              <button
                type="button"
                className="resume-preview-close"
                onClick={closePreview}
              >
                <FaTimes />
              </button>

            </div>


            <div className="resume-preview-body">

              {/* PDF */}
              {resume.fileType === "pdf" && (
                <iframe
                  src={`${API_ORIGIN}${resume.fileUrl}`}
                  title="Resume Preview"
                  className="resume-pdf-frame"
                />
              )}


              {/* DOCX */}
              {resume.fileType !== "pdf" && (
                <>
                  {previewLoading && (
                    <div className="resume-preview-loading">
                      <div className="resume-loading-spinner"></div>
                      <p>
                        Loading resume preview...
                      </p>
                    </div>
                  )}

                  {previewError && (
                    <div className="resume-preview-error">
                      {previewError}
                    </div>
                  )}

                  <div
                    ref={previewRef}
                    className="resume-docx-container"
                  />
                </>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Resume;