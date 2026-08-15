import { useState, useEffect } from "react";
import styles from "./CategoryModal.module.css";

const CategoryModal = ({
  category = null,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    difficulty: "Beginner",
    duration: 30,
    totalQuestions: 10,
  });

  const isEdit = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        icon: category.icon || "",
        difficulty: category.difficulty || "Beginner",
        duration: category.duration || 30,
        totalQuestions: category.totalQuestions || 10,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        icon: "",
        difficulty: "Beginner",
        duration: 30,
        totalQuestions: 10,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...formData,
      duration: Number(formData.duration),
      totalQuestions: Number(formData.totalQuestions),
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* ================= HEADER ================= */}

        <div className={styles.header}>
          <div>
            <h2>
              {isEdit ? "Edit Category" : "Add Category"}
            </h2>

            <p>
              {isEdit
                ? "Update category information."
                : "Create a new interview category."}
            </p>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className={styles.field}>
            <label>
              Category Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="e.g. React Development"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div className={styles.field}>
            <label>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe this interview category..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          {/* ICON */}

          <div className={styles.field}>
            <label>
              Icon
            </label>

            <input
              type="text"
              name="icon"
              placeholder="e.g. react, javascript, python"
              value={formData.icon}
              onChange={handleChange}
            />
          </div>

          {/* ROW */}

          <div className={styles.row}>

            {/* DIFFICULTY */}

            <div className={styles.field}>
              <label>
                Difficulty
              </label>

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

            {/* DURATION */}

            <div className={styles.field}>
              <label>
                Duration (Minutes)
              </label>

              <input
                type="number"
                name="duration"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* QUESTIONS */}

          <div className={styles.field}>
            <label>
              Total Questions
            </label>

            <input
              type="number"
              name="totalQuestions"
              min="1"
              value={formData.totalQuestions}
              onChange={handleChange}
              required
            />
          </div>

          {/* ================= ACTIONS ================= */}

          <div className={styles.actions}>

            <button
              type="button"
              className={styles.cancel}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.save}
            >
              {isEdit
                ? "Update Category"
                : "Save Category"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default CategoryModal;