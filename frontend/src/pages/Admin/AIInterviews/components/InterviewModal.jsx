import { useEffect, useState } from "react";
import axios from "axios";
import {
  HiOutlineXMark,
} from "react-icons/hi2";

import "./InterviewModal.css";

const API = "http://localhost:5000/api";

const InterviewModal = ({
  interview,
  categories = [],
  onClose,
  onSuccess,
}) => {
  const isEdit = Boolean(interview);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    interviewType: "Technical",
    difficulty: "Beginner",
    duration: 30,
  });

  const [saving, setSaving] = useState(false);

  // Load existing interview when editing
  useEffect(() => {
    if (interview) {
      setFormData({
        title: interview.title || "",
        description: interview.description || "",
        category:
          interview.category?._id ||
          interview.category ||
          "",
        interviewType:
          interview.interviewType || "Technical",
        difficulty:
          interview.difficulty || "Beginner",
        duration:
          interview.duration || 30,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        interviewType: "Technical",
        difficulty: "Beginner",
        duration: 30,
      });
    }
  }, [interview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Interview title is required.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        interviewType: formData.interviewType,
        difficulty: formData.difficulty,
        duration: Number(formData.duration),

        // Preserve existing questions when editing
        questions:
          interview?.questions?.map((q) =>
            typeof q === "object" ? q._id : q
          ) || [],
      };

      if (isEdit) {
        await axios.put(
          `${API}/interview-templates/${interview._id}`,
          payload
        );
      } else {
        await axios.post(
          `${API}/interview-templates`,
          payload
        );
      }

      alert(
        isEdit
          ? "Interview updated successfully."
          : "Interview created successfully."
      );

      onSuccess();
    } catch (error) {
      console.error(
        "Failed to save interview:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save interview."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="interview-modal-overlay">
      <div className="interview-modal">

        {/* HEADER */}

        <div className="interview-modal-header">

          <div>
            <h2>
              {isEdit
                ? "Edit Interview"
                : "Create Interview"}
            </h2>

            <p>
              {isEdit
                ? "Update the interview template details."
                : "Create a new interview template."}
            </p>
          </div>

          <button
            type="button"
            className="interview-modal-close"
            onClick={onClose}
          >
            <HiOutlineXMark />
          </button>

        </div>

        {/* FORM */}

        <form
          className="interview-modal-form"
          onSubmit={handleSubmit}
        >

          {/* TITLE */}

          <div className="interview-form-group">
            <label>Interview Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Java Full Stack Interview"
            />
          </div>

          {/* DESCRIPTION */}

          <div className="interview-form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter interview description..."
              rows="3"
            />
          </div>

          {/* CATEGORY + TYPE */}

          <div className="interview-form-grid">

            <div className="interview-form-group">
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="interview-form-group">
              <label>Interview Type</label>

              <select
                name="interviewType"
                value={formData.interviewType}
                onChange={handleChange}
              >
                <option value="Technical">
                  Technical
                </option>

                <option value="HR">
                  HR
                </option>
              </select>
            </div>

          </div>

          {/* DIFFICULTY + DURATION */}

          <div className="interview-form-grid">

            <div className="interview-form-group">
              <label>Difficulty</label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
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

            <div className="interview-form-group">
              <label>Duration</label>

              <div className="duration-input">
                <input
                  type="number"
                  name="duration"
                  min="5"
                  value={formData.duration}
                  onChange={handleChange}
                />

                <span>minutes</span>
              </div>
            </div>

          </div>

          {/* EXISTING QUESTIONS */}

          {isEdit && (
            <div className="interview-existing-questions">

              <div>
                <h3>Questions</h3>

                <p>
                  This interview currently contains{" "}
                  <strong>
                    {interview.questions?.length || 0}
                  </strong>{" "}
                  questions.
                </p>
              </div>

            </div>
          )}

          {/* FOOTER */}

          <div className="interview-modal-footer">

            <button
              type="button"
              className="interview-cancel-btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="interview-save-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create Interview"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default InterviewModal;