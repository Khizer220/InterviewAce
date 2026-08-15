import {
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineFolder,
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlineDocumentDuplicate,
  HiOutlineTrash,
} from "react-icons/hi2";

const InterviewCard = ({
  interview,
  technologyIcon,
  onDelete,
  onToggleStatus,
  onEdit,
  onPreview,
  onDuplicate,
}) => {
  const questionCount = interview.questions?.length || 0;

  const categoryName =
    interview.category?.name || "Python Developer Interview";

  const interviewType =
    interview.interviewType || "Technical";

  const difficulty =
    interview.difficulty || "Beginner";

  const duration =
    interview.duration || 30;

  return (
    <div className="interview-card">

      {/* TOP */}
      <div className="interview-card-top">

        <div className="technology-icon">
          {technologyIcon && (
            <img
              src={technologyIcon}
              alt=""
            />
          )}
        </div>

        <div className="interview-title-area">
          <h3>{interview.title}</h3>

          <p>{categoryName}</p>
        </div>

        <span
          className={
            interview.status
              ? "status-active"
              : "status-inactive"
          }
        >
          {interview.status ? "Active" : "Inactive"}
        </span>

      </div>

      {/* TAGS */}
      <div className="interview-tags">

        <span>
          {interviewType}
        </span>

        <span>
          {difficulty}
        </span>

        <span>
          <HiOutlineClock />
          {duration} min
        </span>

      </div>

      {/* DESCRIPTION */}
      <p className="interview-description">
        {interview.description ||
          "No description available."}
      </p>

      {/* META */}
      <div className="interview-meta">

        <span>
          <HiOutlineDocumentText />
          {questionCount} Questions
        </span>

        <span>
          <HiOutlineFolder />
          {categoryName}
        </span>

      </div>

      {/* ACTIONS */}
      <div className="interview-actions">

        <button
          type="button"
          className="preview-action"
          onClick={onPreview}
        >
          <HiOutlineEye />
          Preview
        </button>

        <button
          type="button"
          className="duplicate-action"
          onClick={onDuplicate}
        >
          <HiOutlineDocumentDuplicate />
          Duplicate
        </button>

        <button
          type="button"
          className="edit-action"
          onClick={onEdit}
        >
          <HiOutlinePencil />
          Edit
        </button>

        <button
          type="button"
          className="toggle-action"
          onClick={onToggleStatus}
        >
          {interview.status
            ? "Deactivate"
            : "Activate"}
        </button>

      </div>

      {/* DELETE */}
      <button
        type="button"
        className="delete-action"
        onClick={onDelete}
      >
        <HiOutlineTrash />
        Delete
      </button>

    </div>
  );
};

export default InterviewCard;