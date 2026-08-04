import "./InterviewModal.css";

const ModalHeader = ({ isEdit, onClose }) => {
  return (
    <div className="modal-header">
      <div className="modal-header-content">
        <div className="modal-icon">
          🤖
        </div>

        <div className="modal-title">
          <h2>
            {isEdit
              ? "Edit Interview Template"
              : "Create Interview Template"}
          </h2>

          <p>
            {isEdit
              ? "Update the interview template details for candidates."
              : "Create a new AI-powered interview template for candidates."}
          </p>
        </div>
      </div>

      <button
        className="close-btn"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};

export default ModalHeader;