import React from "react";
import {
  FaJava,
  FaReact,
  FaPython,
  FaNodeJs,
} from "react-icons/fa";
import {
  SiJavascript,
  SiMongodb,
} from "react-icons/si";
import {
  FiClock,
  FiFolder,
  FiFileText,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import "./InterviewCard.css";

const getIcon = (category) => {
  const name = category?.toLowerCase() || "";

  if (name.includes("java"))
    return <FaJava className="tech-icon java" />;

  if (name.includes("react"))
    return <FaReact className="tech-icon react" />;

  if (name.includes("python"))
    return <FaPython className="tech-icon python" />;

  if (name.includes("node"))
    return <FaNodeJs className="tech-icon node" />;

  if (name.includes("javascript"))
    return (
      <SiJavascript className="tech-icon javascript" />
    );

  if (name.includes("mern"))
    return <SiMongodb className="tech-icon mern" />;

  return (
    <FiFolder className="tech-icon default-icon" />
  );
};

const InterviewCard = ({
  interview,
  onEdit,
  onDelete,
  onToggleStatus,
  onPreview,
  onDuplicate,
}) => {
  return (
    <div className="premium-card">

      <div className="premium-header">

        <div className="logo-box">
          {getIcon(interview.category?.name)}
        </div>

        <div className="title-area">
          <h2>{interview.title}</h2>

          <p>
            {interview.category?.name} Developer
            Interview
          </p>
        </div>

        <span
          className={`status-badge ${
            interview.status
              ? "active"
              : "inactive"
          }`}
        >
          {interview.status
            ? "Active"
            : "Inactive"}
        </span>

      </div>

      <div className="meta-row">

        <span>{interview.interviewType}</span>

        <span>{interview.difficulty}</span>

        <span>
          <FiClock />
          {interview.duration} min
        </span>

      </div>

      <p className="card-description">
        {interview.description ||
          "No description available."}
      </p>

      <div className="card-footer-info">

        <span>
          <FiFileText />
          {interview.questions?.length || 0}
          Questions
        </span>

        <span>
          <FiFolder />
          {interview.category?.name}
        </span>

      </div>

 <div className="card-actions">

  <button
    className="preview-btn"
    onClick={() => onPreview(interview)}
  >
    Preview
  </button>

  <button
    className="duplicate-btn"
    onClick={() => onDuplicate(interview)}
  >
    Duplicate
  </button>

  <button
    className="edit-btn"
    onClick={() => onEdit(interview)}
  >
    <FiEdit2 />
    Edit
  </button>

  <button
    className="status-btn"
    onClick={() => onToggleStatus(interview)}
  >
    {interview.status
      ? "Deactivate"
      : "Activate"}
  </button>

  <button
    className="delete-btn"
    onClick={() => onDelete(interview._id)}
  >
    <FiTrash2 />
    Delete
  </button>

</div>

    </div>
  );
};

export default InterviewCard;