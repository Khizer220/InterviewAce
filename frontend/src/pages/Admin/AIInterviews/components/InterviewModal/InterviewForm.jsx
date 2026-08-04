import "./InterviewModal.css";

const InterviewForm = ({
  formData,
  setFormData,
  categories,
  generateAIQuestions,
  generatingAI,
}) => {
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="interview-form">

      {/* Interview Details */}

      <div className="form-group">
        <label>Interview Title</label>

        <input
          type="text"
          name="title"
          placeholder="React Developer Interview"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>

        <textarea
          name="description"
          rows="3"
          placeholder="Brief description..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-grid">

        <div className="form-group">
          <label>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Interview Type</label>

          <select
            name="interviewType"
            value={formData.interviewType}
            onChange={handleChange}
          >
            <option>Technical</option>
            <option>HR</option>
            <option>Aptitude</option>
            <option>Mixed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Difficulty</label>

          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label>Duration (Minutes)</label>

          <input
            type="number"
            min="5"
            name="duration"
            value={formData.duration}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                duration: Number(e.target.value),
              }))
            }
          />
        </div>

      </div>

      <div className="form-group">
        <label>Instructions</label>

        <textarea
          name="instructions"
          rows="3"
          placeholder="Instructions for candidates..."
          value={formData.instructions}
          onChange={handleChange}
        />
      </div>

      {/* ==========================
          AI QUESTION GENERATOR
      ========================== */}

      <h3 className="section-title">
        🤖 AI Question Generator
      </h3>

      <div className="form-group">
        <label>Job Role</label>

        <input
          type="text"
          name="role"
          placeholder="React Developer"
          value={formData.role}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Required Skills</label>

        <textarea
          rows="2"
          name="skills"
          placeholder="React, JavaScript, HTML, CSS, Redux..."
          value={formData.skills}
          onChange={handleChange}
        />
      </div>

      <div className="form-grid">

        <div className="form-group">
          <label>Experience</label>

          <input
            type="text"
            name="experience"
            placeholder="2 Years"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>No. of Questions</label>

          <input
            type="number"
            min="1"
            max="30"
            name="numberOfQuestions"
            value={formData.numberOfQuestions}
            onChange={handleChange}
          />
        </div>

      </div>

      <button
        type="button"
        className="generate-ai-btn"
        onClick={generateAIQuestions}
        disabled={generatingAI}
      >
        {generatingAI
          ? "Generating..."
          : "✨ Generate Questions with AI"}
      </button>

    </div>
  );
};

export default InterviewForm;