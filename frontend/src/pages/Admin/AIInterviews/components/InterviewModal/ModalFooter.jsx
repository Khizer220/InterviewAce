import "./InterviewModal.css";

const ModalFooter = ({
  isEdit,
  saving,
  onClose,
  onSave,
}) => {
  return (
    <div className="modal-footer">
      <button
        className="cancel-btn"
        onClick={onClose}
        disabled={saving}
      >
        Cancel
      </button>

      <button
        className="save-btn"
        onClick={onSave}
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : isEdit
          ? "Update Interview"
          : "Create Interview"}
      </button>
    </div>
  );
};

export default ModalFooter;