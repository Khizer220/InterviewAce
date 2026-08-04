import { useState, useEffect } from "react";
import styles from "./CategoryModal.module.css";

const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    difficulty: "Beginner",
    duration: 30,
    totalQuestions: 10,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
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
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h2>
            {initialData ? "Edit Category" : "Add Category"}
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={handleChange}
          />

          <input
            type="number"
            name="totalQuestions"
            placeholder="Total Questions"
            value={formData.totalQuestions}
            onChange={handleChange}
          />

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
              Save
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CategoryModal;