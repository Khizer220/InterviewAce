import { useEffect, useState } from "react";
import { getCategories } from "../../../../services/categoryService";
import styles from "./QuestionModal.module.css";

const QuestionModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) => {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    difficulty: "Beginner",
    marks: 5,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;

    setFormData({
      ...formData,
      options: updatedOptions,
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
            {initialData ? "Edit Question" : "Add Question"}
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <textarea
            name="question"
            placeholder="Enter Question"
            value={formData.question}
            onChange={handleChange}
            required
          />

          {formData.options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) =>
                handleOptionChange(index, e.target.value)
              }
              required
            />
          ))}

          <select
            name="correctAnswer"
            value={formData.correctAnswer}
            onChange={handleChange}
          >
            <option value={0}>Option 1</option>
            <option value={1}>Option 2</option>
            <option value={2}>Option 3</option>
            <option value={3}>Option 4</option>
          </select>

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
            name="marks"
            value={formData.marks}
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
              Save Question
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default QuestionModal;