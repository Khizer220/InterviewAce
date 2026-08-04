import { useMemo, useState } from "react";
import "./InterviewModal.css";

const QuestionSelector = ({
  questions,
  selectedQuestions,
  setSelectedQuestions,
}) => {
  const [search, setSearch] = useState("");

  const filteredQuestions = useMemo(() => {
    return (questions || []).filter((q) =>
      (q.question || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [questions, search]);

  const toggleQuestion = (question) => {
    const id = question._id || question.question;

    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(
        selectedQuestions.filter((q) => q !== id)
      );
    } else {
      setSelectedQuestions([
        ...selectedQuestions,
        id,
      ]);
    }
  };

  return (
    <div className="question-selector">

      <div className="question-header">
        <h3>Question Bank</h3>

        <span>
          {selectedQuestions.length} Selected
        </span>
      </div>

      <input
        className="question-search"
        placeholder="Search questions..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="question-list">

        {filteredQuestions.length === 0 ? (
          <div className="no-question">
            No Questions Found
          </div>
        ) : (
          filteredQuestions.map((question, index) => {
            const id =
              question._id || question.question;

            return (
              <label
                key={id || index}
                className="question-item"
              >
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(
                    id
                  )}
                  onChange={() =>
                    toggleQuestion(question)
                  }
                />

                <div>

                  <strong>
                    {question.question}
                  </strong>

                  <p>

                    {question.topic ||
                      question.difficulty ||
                      "General"}

                    {" • "}

                    {question.marks || 5} Marks

                  </p>

                  {question.expectedAnswer && (
                    <small
                      style={{
                        color: "#64748b",
                        display: "block",
                        marginTop: 8,
                      }}
                    >
                      <strong>
                        Expected:
                      </strong>{" "}
                      {question.expectedAnswer}
                    </small>
                  )}

                </div>

              </label>
            );
          })
        )}

      </div>

    </div>
  );
};

export default QuestionSelector;