import { useEffect, useMemo, useState } from "react";

import {
  FaQuestionCircle,
  FaCheckCircle,
  FaBookOpen,
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";

import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../../services/questionService";

import { getCategories } from "../../../services/categoryService";

import { toast } from "react-hot-toast";

import styles from "./Questions.module.css";


const Questions = () => {

const getCategoryLogo = (categoryName) => {
  const name = categoryName?.toLowerCase().trim() || "";

  const logos = {
    css: "/icons/css.png",
    html: "/icons/html.png",
    java: "/icons/java.png",

    javascript: "/icons/javascript.png",

    nodejs: "/icons/nodejs.png",
    "node.js": "/icons/nodejs.png",

    python: "/icons/python.png",

    react: "/icons/react.png",
    "react js": "/icons/react.png",
    reactjs: "/icons/react.png",

    php: "/icons/php.png",
    mysql: "/icons/mysql.png",

    dbms: "/icons/dbms.png",

    "data structure": "/icons/datastructure.png",
    "data structures": "/icons/datastructure.png",
    dsa: "/icons/datastructure.png",
  };

  return logos[name] || "/icons/react.png";
};

  // =====================================================
  // STATE
  // =====================================================

  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [expandedCategories, setExpandedCategories] =
    useState({});

  const [showAllCategories, setShowAllCategories] =
    useState({});

  const [loading, setLoading] = useState(true);

  // View modal
  const [viewQuestion, setViewQuestion] = useState(null);

  // Edit modal
  const [editQuestion, setEditQuestion] = useState(null);

  const [saving, setSaving] = useState(false);

  // Add Question modal
const [showAddModal, setShowAddModal] = useState(false);

const [newQuestion, setNewQuestion] = useState({
  category: "",
  question: "",
  difficulty: "Beginner",
  marks: 5,
  topic: "",
  expectedAnswer: "",
  followUpQuestion: "",
});


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {

    try {

      setLoading(true);

      const [questionData, categoryData] =
        await Promise.all([
          getQuestions(),
          getCategories(),
        ]);

      setQuestions(questionData?.questions || []);

      setCategories(categoryData?.categories || []);

    } catch (error) {

      console.error(error);

      toast.error("Failed to load questions");

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalQuestions = questions.length;

  const activeQuestions = questions.filter(
    (question) => question.status === true
  ).length;

  const beginnerQuestions = questions.filter(
    (question) => question.difficulty === "Beginner"
  ).length;

  const advancedQuestions = questions.filter(
    (question) => question.difficulty === "Advanced"
  ).length;


  // =====================================================
  // CATEGORY DATA
  // =====================================================

  const categoryData = useMemo(() => {

    return categories
      .map((category) => {

        const categoryQuestions =
          questions.filter(
            (question) =>
              question.category?._id === category._id ||
              question.category === category._id
          );

        return {
          ...category,
          questions: categoryQuestions,
        };

      })
      .filter((category) => {

        const value = search.toLowerCase().trim();

        if (!value) return true;

        return (
          category.name
            ?.toLowerCase()
            .includes(value) ||

          category.description
            ?.toLowerCase()
            .includes(value) ||

          category.questions.some((question) =>
            question.question
              ?.toLowerCase()
              .includes(value)
          )
        );

      });

  }, [categories, questions, search]);


  // =====================================================
  // EXPAND CATEGORY
  // =====================================================

  const toggleCategory = (categoryId) => {

    setExpandedCategories((previous) => ({
      ...previous,
      [categoryId]:
        !previous[categoryId],
    }));

  };


  // =====================================================
  // VIEW ALL
  // =====================================================

  const toggleViewAll = (categoryId) => {

    setShowAllCategories((previous) => ({
      ...previous,
      [categoryId]:
        !previous[categoryId],
    }));

    // Automatically open category
    setExpandedCategories((previous) => ({
      ...previous,
      [categoryId]: true,
    }));

  };


  // =====================================================
  // DELETE QUESTION
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) return;

    try {

      await deleteQuestion(id);

      toast.success(
        "Question deleted successfully"
      );

      await loadData();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to delete question"
      );

    }

  };


  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditChange = (e) => {

    const { name, value } = e.target;

    setEditQuestion((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =====================================================
  // SAVE EDIT
  // =====================================================

  const handleUpdateQuestion = async (e) => {

    e.preventDefault();

    if (!editQuestion) return;

    try {

      setSaving(true);

      await updateQuestion(
        editQuestion._id,
        {
          question:
            editQuestion.question,

          difficulty:
            editQuestion.difficulty,

          marks:
            Number(editQuestion.marks),

          expectedAnswer:
            editQuestion.expectedAnswer || "",

          topic:
            editQuestion.topic || "",

          followUpQuestion:
            editQuestion.followUpQuestion || "",

          status:
            editQuestion.status === true ||
            editQuestion.status === "true",
        }
      );

      toast.success(
        "Question updated successfully"
      );

      setEditQuestion(null);

      await loadData();

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to update question"
      );

    } finally {

      setSaving(false);

    }

  };

  // =====================================================
// OPEN ADD QUESTION MODAL
// =====================================================

const openAddQuestionModal = (category = null) => {
  setNewQuestion({
    category: category?._id || "",
    question: "",
    difficulty: "Beginner",
    marks: 5,
    topic: "",
    expectedAnswer: "",
    followUpQuestion: "",
  });

  setShowAddModal(true);
};


// =====================================================
// CLOSE ADD QUESTION MODAL
// =====================================================

const closeAddQuestionModal = () => {
  setShowAddModal(false);
};


// =====================================================
// HANDLE ADD QUESTION CHANGE
// =====================================================

const handleNewQuestionChange = (e) => {
  const { name, value } = e.target;

  setNewQuestion((previous) => ({
    ...previous,
    [name]: value,
  }));
};


// =====================================================
// CREATE QUESTION
// =====================================================

const handleCreateQuestion = async (e) => {
  e.preventDefault();

  if (!newQuestion.category) {
    toast.error("Please select a category");
    return;
  }

  if (!newQuestion.question.trim()) {
    toast.error("Please enter a question");
    return;
  }

  try {
    setSaving(true);

    await createQuestion({
      category: newQuestion.category,
      question: newQuestion.question,
      difficulty: newQuestion.difficulty,
      marks: Number(newQuestion.marks),
      topic: newQuestion.topic,
      expectedAnswer: newQuestion.expectedAnswer,
      followUpQuestion: newQuestion.followUpQuestion,
      source: "Manual",
      status: true,
    });

    toast.success("Question added successfully");

    closeAddQuestionModal();

    await loadData();

  } catch (error) {

    console.error("Create Question Error:", error);

    toast.error(
      error.response?.data?.message ||
      "Failed to create question"
    );

  } finally {
    setSaving(false);
  }
};


  // =====================================================
  // CATEGORY ICON
  // =====================================================

  


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <AdminLayout>

      <div className={styles.iqPage}>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className={styles.iqHeader}>

          <div>

            <h1>
              Interview Questions
            </h1>

            <p>
              Manage interview questions organized by categories.
            </p>

          </div>

          <button
  className={styles.iqPrimaryButton}
  onClick={() => openAddQuestionModal()}
>
  <FaPlus />
  Add Question
</button>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className={styles.iqStatsGrid}>

          <div className={styles.iqStatCard}>

            <div
              className={`${styles.iqStatIcon} ${styles.purple}`}
            >
              <FaQuestionCircle />
            </div>

            <div>

              <strong>
                {totalQuestions}
              </strong>

              <span>
                Total Questions
              </span>

            </div>

          </div>


          <div className={styles.iqStatCard}>

            <div
              className={`${styles.iqStatIcon} ${styles.green}`}
            >
              <FaCheckCircle />
            </div>

            <div>

              <strong>
                {activeQuestions}
              </strong>

              <span>
                Active Questions
              </span>

            </div>

          </div>


          <div className={styles.iqStatCard}>

            <div
              className={`${styles.iqStatIcon} ${styles.orange}`}
            >
              <FaBookOpen />
            </div>

            <div>

              <strong>
                {beginnerQuestions}
              </strong>

              <span>
                Beginner
              </span>

            </div>

          </div>


          <div className={styles.iqStatCard}>

            <div
              className={`${styles.iqStatIcon} ${styles.red}`}
            >
              <FaGraduationCap />
            </div>

            <div>

              <strong>
                {advancedQuestions}
              </strong>

              <span>
                Advanced
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className={styles.iqSearchBox}>

          <input
            type="text"
            placeholder="Search questions, topics..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* =================================================
            CATEGORIES
        ================================================= */}

        <div className={styles.iqCategoryList}>

          {loading ? (

            <div className={styles.iqLoading}>
              Loading questions...
            </div>

          ) : categoryData.length === 0 ? (

            <div className={styles.iqEmpty}>
              No categories or questions found.
            </div>

          ) : (

            categoryData.map((category) => {

              const isExpanded =
                expandedCategories[
                  category._id
                ] || false;

              const showAll =
                showAllCategories[
                  category._id
                ] || false;

              const visibleQuestions =
                showAll
                  ? category.questions
                  : category.questions.slice(0, 3);


              return (

                <section
                  className={`${styles.iqCategoryCard} ${
                    isExpanded
                      ? styles.iqCategoryExpanded
                      : ""
                  }`}
                  key={category._id}
                >

                  {/* ========================================
                      CATEGORY HEADER
                  ======================================== */}

                  <div
                    className={
                      styles.iqCategoryHeader
                    }
                  >

                    <div
                      className={
                        styles.iqCategoryInfo
                      }
                    >

                     <div
  className={
    styles.iqCategoryIcon
  }
>
  <img
    src={getCategoryLogo(category.name)}
    alt={category.name}
  />
</div>


                      <div>

                        <div
                          className={
                            styles.iqCategoryTitleRow
                          }
                        >

                          <h2>
                            {category.name}
                          </h2>

                          <span>
                            {
                              category.questions
                                .length
                            } Questions
                          </span>

                        </div>


                        <p>
                          {category.description ||
                            "Interview questions and assessment topics"}
                        </p>

                      </div>

                    </div>


                    <div
                      className={
                        styles.iqCategoryControls
                      }
                    >

                   <button
  className={styles.iqAddButton}
  onClick={() => openAddQuestionModal(category)}
>
  <FaPlus />
  Add Question
</button>


                      <button
                        className={
                          styles.iqExpandButton
                        }
                        onClick={() =>
                          toggleCategory(
                            category._id
                          )
                        }
                      >

                        {isExpanded ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* ========================================
                      QUESTIONS
                  ======================================== */}

                  {isExpanded && (

                    <div
                      className={
                        styles.iqCategoryContent
                      }
                    >

                      {category.questions.length === 0 ? (

                        <div
                          className={
                            styles.iqNoQuestions
                          }
                        >
                          No questions available in this category.
                        </div>

                      ) : (

                        <>

                          <div
                            className={
                              styles.iqTableWrapper
                            }
                          >

                            <table
                              className={
                                styles.iqTable
                              }
                            >

                              <thead>

                                <tr>

                                  <th>
                                    QUESTION
                                  </th>

                                  <th>
                                    DIFFICULTY
                                  </th>

                                  <th>
                                    MARKS
                                  </th>

                                  <th>
                                    ACTIONS
                                  </th>

                                </tr>

                              </thead>


                              <tbody>

                                {visibleQuestions.map(
                                  (question) => (

                                    <tr
                                      key={
                                        question._id
                                      }
                                    >

                                      <td>

                                        <div
                                          className={
                                            styles.iqQuestionText
                                          }
                                        >
                                          {
                                            question.question
                                          }
                                        </div>

                                      </td>


                                      <td>

                                        <span
                                          className={`${styles.iqDifficulty} ${
                                            question.difficulty ===
                                            "Beginner"
                                              ? styles.beginner
                                              : question.difficulty ===
                                                "Advanced"
                                              ? styles.advanced
                                              : styles.intermediate
                                          }`}
                                        >
                                          {
                                            question.difficulty
                                          }
                                        </span>

                                      </td>


                                      <td>

                                        <span
                                          className={
                                            styles.iqMarks
                                          }
                                        >
                                          {
                                            question.marks ||
                                            5
                                          }
                                        </span>

                                      </td>


                                      <td>

                                        <div
                                          className={
                                            styles.iqActions
                                          }
                                        >

                                          {/* VIEW */}

                                          <button
                                            className={
                                              styles.iqViewButton
                                            }
                                            title="View Question"
                                            onClick={() =>
                                              setViewQuestion(
                                                question
                                              )
                                            }
                                          >
                                            <FaEye />
                                          </button>


                                          {/* EDIT */}

                                          <button
                                            className={
                                              styles.iqEditButton
                                            }
                                            title="Edit Question"
                                            onClick={() =>
                                              setEditQuestion({
                                                ...question,
                                              })
                                            }
                                          >
                                            <FaEdit />
                                          </button>


                                          {/* DELETE */}

                                          <button
                                            className={
                                              styles.iqDeleteButton
                                            }
                                            title="Delete Question"
                                            onClick={() =>
                                              handleDelete(
                                                question._id
                                              )
                                            }
                                          >
                                            <FaTrash />
                                          </button>

                                        </div>

                                      </td>

                                    </tr>

                                  )
                                )}

                              </tbody>

                            </table>

                          </div>


                          {/* VIEW ALL */}

                          {category.questions.length > 3 && (

                            <button
                              className={
                                styles.iqViewAll
                              }
                              onClick={() =>
                                toggleViewAll(
                                  category._id
                                )
                              }
                            >

                              {showAll
                                ? "Show less"
                                : `View all ${category.questions.length} questions`}

                              <span>
                                {showAll
                                  ? "↑"
                                  : "→"}
                              </span>

                            </button>

                          )}

                        </>

                      )}

                    </div>

                  )}

                </section>

              );

            })

          )}

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        {!loading &&
          categoryData.length > 0 && (

            <div
              className={
                styles.iqFooter
              }
            >
              Showing{" "}
              {categoryData.length}{" "}
              categories
            </div>

          )}


        {/* =================================================
            VIEW QUESTION MODAL
        ================================================= */}

        {viewQuestion && (

          <div
            className={
              styles.iqModalOverlay
            }
            onClick={() =>
              setViewQuestion(null)
            }
          >

            <div
              className={
                styles.iqModal
              }
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div
                className={
                  styles.iqModalHeader
                }
              >

                <div>

                  <h2>
                    Question Details
                  </h2>

                  <p>
                    View interview question information
                  </p>

                </div>

                <button
                  className={
                    styles.iqCloseButton
                  }
                  onClick={() =>
                    setViewQuestion(null)
                  }
                >
                  <FaTimes />
                </button>

              </div>


              <div
                className={
                  styles.iqViewContent
                }
              >

                <div
                  className={
                    styles.iqViewQuestion
                  }
                >
                  {viewQuestion.question}
                </div>


                <div
                  className={
                    styles.iqDetailGrid
                  }
                >

                  <div>
                    <label>
                      Category
                    </label>

                    <strong>
                      {viewQuestion.category?.name ||
                        "Unknown"}
                    </strong>
                  </div>


                  <div>
                    <label>
                      Difficulty
                    </label>

                    <strong>
                      {viewQuestion.difficulty}
                    </strong>
                  </div>


                  <div>
                    <label>
                      Marks
                    </label>

                    <strong>
                      {viewQuestion.marks || 5}
                    </strong>
                  </div>


                  <div>
                    <label>
                      Source
                    </label>

                    <strong>
                      {viewQuestion.source || "Manual"}
                    </strong>
                  </div>

                </div>


                {viewQuestion.topic && (

                  <div
                    className={
                      styles.iqDetailBlock
                    }
                  >

                    <label>
                      Topic
                    </label>

                    <p>
                      {viewQuestion.topic}
                    </p>

                  </div>

                )}


                {viewQuestion.expectedAnswer && (

                  <div
                    className={
                      styles.iqDetailBlock
                    }
                  >

                    <label>
                      Expected Answer
                    </label>

                    <p>
                      {viewQuestion.expectedAnswer}
                    </p>

                  </div>

                )}


                {viewQuestion.followUpQuestion && (

                  <div
                    className={
                      styles.iqDetailBlock
                    }
                  >

                    <label>
                      Follow-up Question
                    </label>

                    <p>
                      {viewQuestion.followUpQuestion}
                    </p>

                  </div>

                )}

              </div>


              <div
                className={
                  styles.iqModalFooter
                }
              >

                <button
                  className={
                    styles.iqCancelButton
                  }
                  onClick={() =>
                    setViewQuestion(null)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            EDIT QUESTION MODAL
        ================================================= */}

        {editQuestion && (

          <div
            className={
              styles.iqModalOverlay
            }
            onClick={() =>
              setEditQuestion(null)
            }
          >

            <div
              className={
                styles.iqModal
              }
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div
                className={
                  styles.iqModalHeader
                }
              >

                <div>

                  <h2>
                    Edit Question
                  </h2>

                  <p>
                    Update question information
                  </p>

                </div>

                <button
                  className={
                    styles.iqCloseButton
                  }
                  onClick={() =>
                    setEditQuestion(null)
                  }
                >
                  <FaTimes />
                </button>

              </div>


              <form
                onSubmit={
                  handleUpdateQuestion
                }
              >

                <div
                  className={
                    styles.iqForm
                  }
                >

                  {/* QUESTION */}

                  <div
                    className={
                      styles.iqFormGroup
                    }
                  >

                    <label>
                      Question
                    </label>

                    <textarea
                      name="question"
                      value={
                        editQuestion.question ||
                        ""
                      }
                      onChange={
                        handleEditChange
                      }
                      required
                    />

                  </div>


                  {/* DIFFICULTY */}

                  <div
                    className={
                      styles.iqFormRow
                    }
                  >

                    <div
                      className={
                        styles.iqFormGroup
                      }
                    >

                      <label>
                        Difficulty
                      </label>

                      <select
                        name="difficulty"
                        value={
                          editQuestion.difficulty ||
                          "Beginner"
                        }
                        onChange={
                          handleEditChange
                        }
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


                    {/* MARKS */}

                    <div
                      className={
                        styles.iqFormGroup
                      }
                    >

                      <label>
                        Marks
                      </label>

                      <input
                        type="number"
                        name="marks"
                        min="1"
                        value={
                          editQuestion.marks ||
                          5
                        }
                        onChange={
                          handleEditChange
                        }
                      />

                    </div>

                  </div>


                  {/* TOPIC */}

                  <div
                    className={
                      styles.iqFormGroup
                    }
                  >

                    <label>
                      Topic
                    </label>

                    <input
                      type="text"
                      name="topic"
                      value={
                        editQuestion.topic ||
                        ""
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="Enter topic"
                    />

                  </div>


                  {/* EXPECTED ANSWER */}

                  <div
                    className={
                      styles.iqFormGroup
                    }
                  >

                    <label>
                      Expected Answer
                    </label>

                    <textarea
                      name="expectedAnswer"
                      value={
                        editQuestion.expectedAnswer ||
                        ""
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="Enter expected answer"
                    />

                  </div>


                  {/* FOLLOW UP */}

                  <div
                    className={
                      styles.iqFormGroup
                    }
                  >

                    <label>
                      Follow-up Question
                    </label>

                    <input
                      type="text"
                      name="followUpQuestion"
                      value={
                        editQuestion.followUpQuestion ||
                        ""
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="Enter follow-up question"
                    />

                  </div>


                  {/* STATUS */}

                  <div
                    className={
                      styles.iqFormGroup
                    }
                  >

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={
                        editQuestion.status
                          ? "true"
                          : "false"
                      }
                      onChange={
                        handleEditChange
                      }
                    >

                      <option value="true">
                        Active
                      </option>

                      <option value="false">
                        Inactive
                      </option>

                    </select>

                  </div>

                </div>


                <div
                  className={
                    styles.iqModalFooter
                  }
                >

                  <button
                    type="button"
                    className={
                      styles.iqCancelButton
                    }
                    onClick={() =>
                      setEditQuestion(null)
                    }
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className={
                      styles.iqSaveButton
                    }
                    disabled={saving}
                  >

                    {saving
                      ? "Saving..."
                      : "Save Changes"}

                  </button>

                </div>

              </form>

            </div>

          </div>

               )}


        {/* =================================================
            ADD QUESTION MODAL
        ================================================= */}

        {showAddModal && (

          <div
            className={styles.iqModalOverlay}
            onClick={closeAddQuestionModal}
          >

            <div
              className={styles.iqModal}
              onClick={(e) => e.stopPropagation()}
            >

              <div className={styles.iqModalHeader}>

                <div>

                  <h2>
                    Add Question
                  </h2>

                  <p>
                    Create a new interview question
                  </p>

                </div>

                <button
                  type="button"
                  className={styles.iqCloseButton}
                  onClick={closeAddQuestionModal}
                >
                  <FaTimes />
                </button>

              </div>


              <form onSubmit={handleCreateQuestion}>

                <div className={styles.iqForm}>

                  {/* CATEGORY */}

                  <div className={styles.iqFormGroup}>

                    <label>
                      Category
                    </label>

                    <select
                      name="category"
                      value={newQuestion.category}
                      onChange={handleNewQuestionChange}
                      required
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


                  {/* QUESTION */}

                  <div className={styles.iqFormGroup}>

                    <label>
                      Question
                    </label>

                    <textarea
                      name="question"
                      value={newQuestion.question}
                      onChange={handleNewQuestionChange}
                      placeholder="Enter interview question..."
                      required
                    />

                  </div>


                  {/* DIFFICULTY + MARKS */}

                  <div className={styles.iqFormRow}>

                    <div className={styles.iqFormGroup}>

                      <label>
                        Difficulty
                      </label>

                      <select
                        name="difficulty"
                        value={newQuestion.difficulty}
                        onChange={handleNewQuestionChange}
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


                    <div className={styles.iqFormGroup}>

                      <label>
                        Marks
                      </label>

                      <input
                        type="number"
                        name="marks"
                        min="1"
                        value={newQuestion.marks}
                        onChange={handleNewQuestionChange}
                      />

                    </div>

                  </div>


                  {/* TOPIC */}

                  <div className={styles.iqFormGroup}>

                    <label>
                      Topic
                    </label>

                    <input
                      type="text"
                      name="topic"
                      value={newQuestion.topic}
                      onChange={handleNewQuestionChange}
                      placeholder="e.g. CSS Specificity"
                    />

                  </div>


                  {/* EXPECTED ANSWER */}

                  <div className={styles.iqFormGroup}>

                    <label>
                      Expected Answer
                    </label>

                    <textarea
                      name="expectedAnswer"
                      value={newQuestion.expectedAnswer}
                      onChange={handleNewQuestionChange}
                      placeholder="Enter the expected answer..."
                    />

                  </div>


                  {/* FOLLOW UP */}

                  <div className={styles.iqFormGroup}>

                    <label>
                      Follow-up Question
                    </label>

                    <input
                      type="text"
                      name="followUpQuestion"
                      value={newQuestion.followUpQuestion}
                      onChange={handleNewQuestionChange}
                      placeholder="Optional follow-up question"
                    />

                  </div>

                </div>


                <div className={styles.iqModalFooter}>

                  <button
                    type="button"
                    className={styles.iqCancelButton}
                    onClick={closeAddQuestionModal}
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className={styles.iqSaveButton}
                    disabled={saving}
                  >

                    {saving
                      ? "Adding..."
                      : "Add Question"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


      </div>

    </AdminLayout>

  );

};

export default Questions;