import { useEffect, useMemo, useState } from "react";

import {
  FaQuestionCircle,
  FaCheckCircle,
  FaCode,
  FaListUl,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaMagic,
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
  generateMCQQuestions,
  saveAIMCQQuestions,
} from "../../../services/questionService";

import { getCategories } from "../../../services/categoryService";
import { getCodingProblems } from "../../../services/codingService";

import { toast } from "react-hot-toast";

import styles from "./Questions.module.css";

const EMPTY_MCQ_OPTIONS = ["", "", "", ""];
const PAGE_SIZE = 5;

const SECTIONS = [
  { key: "qa", title: "Q&A Questions", description: "Manage interview Q&A questions organized by categories.", showAI: false },
  { key: "coding", title: "Coding Questions", description: "Reserved for coding-problem categories.", showAI: false },
  { key: "mcq", title: "MCQ Questions", description: "Manage multiple choice questions organized by categories.", showAI: true },
];

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
const [codingProblems, setCodingProblems] = useState([]);

  const [expandedCategories, setExpandedCategories] = useState({});
  const [showAllCategories, setShowAllCategories] = useState({});

  const [loading, setLoading] = useState(true);

  // Per-section search / sort / page
  const [sectionState, setSectionState] = useState({
    qa: { search: "", sort: "name", page: 1 },
    coding: { search: "", sort: "name", page: 1 },
    mcq: { search: "", sort: "name", page: 1 },
  });

  const updateSection = (key, partial) => {
    setSectionState((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...partial },
    }));
  };

  // View / Edit modals
  const [viewQuestion, setViewQuestion] = useState(null);
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
    options: [...EMPTY_MCQ_OPTIONS],
    correctAnswer: 0,
  });

  // AI MCQ generation modal
  const [mcqAICategory, setMcqAICategory] = useState(null);
  const [showMCQAIModal, setShowMCQAIModal] = useState(false);
  const [mcqGenForm, setMcqGenForm] = useState({
    numberOfQuestions: 5,
    difficulty: "Beginner",
    topic: "",
  });
  const [generatingMCQ, setGeneratingMCQ] = useState(false);
  const [mcqPreview, setMcqPreview] = useState(null);
  const [savingMCQBatch, setSavingMCQBatch] = useState(false);


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

 const loadData = async () => {
  try {
    setLoading(true);

    const [questionData, categoryData, codingData] =
      await Promise.all([
        getQuestions(),
        getCategories(),
        getCodingProblems(),
      ]);

    setQuestions(questionData?.questions || []);
    setCategories(categoryData?.categories || []);

    setCodingProblems(
      codingData?.problems ||
      codingData?.codingProblems ||
      codingData?.data ||
      []
    );

  } catch (error) {
    console.error("Load Questions Error:", error);
    toast.error("Failed to load questions");
  } finally {
    setLoading(false);
  }
};


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalQuestions = questions.length;

  const activeQuestions = questions.filter((q) => q.status === true).length;

  const codingQuestionsCount = questions.filter(
    (q) => q.category?.type === "Coding"
  ).length;

  const mcqQuestionsCount = questions.filter(
    (q) => q.category?.type === "MCQ"
  ).length;


  // =====================================================
  // CATEGORY DATA — grouped by type, with questions attached
  // =====================================================

  const allCategoryData = useMemo(() => {
    return categories.map((category) => {
      const categoryQuestions = questions.filter(
        (q) => q.category?._id === category._id || q.category === category._id
      );
      return { ...category, questions: categoryQuestions };
    });
  }, [categories, questions]);

 const categoriesBySection = useMemo(() => {

  // ==============================
  // Q&A CATEGORIES
  // ==============================

  const qaCategories = allCategoryData.filter(
    (c) => (c.type || "Q&A") === "Q&A"
  );


  // ==============================
  // CODING PROBLEM CATEGORIES
  // ==============================

  const codingMap = {};

  codingProblems.forEach((problem) => {

    const categoryId =
      problem.category?._id ||
      problem.category;

    const categoryName =
      problem.category?.name ||
      "Uncategorized";

    if (!codingMap[categoryId]) {

      codingMap[categoryId] = {
        _id: categoryId,
        name: categoryName,
        description:
          problem.category?.description ||
          "Coding interview problems",
        type: "Coding",
        questions: [],
      };

    }

    codingMap[categoryId].questions.push(problem);

  });

  const codingCategories = Object.values(codingMap);


  // ==============================
  // MCQ CATEGORIES
  // ==============================

  const mcqCategories = allCategoryData.filter(
    (c) => c.type === "MCQ"
  );


  return {
    qa: qaCategories,
    coding: codingCategories,
    mcq: mcqCategories,
  };

}, [allCategoryData, codingProblems]);


  // =====================================================
  // HELPERS: difficulty distribution, last updated, filtering
  // =====================================================

  const getDifficultyDistribution = (categoryQuestions) => {
    const counts = { Beginner: 0, Intermediate: 0, Advanced: 0 };
    categoryQuestions.forEach((q) => {
      if (counts[q.difficulty] !== undefined) counts[q.difficulty] += 1;
    });
    return counts;
  };

  const getLastUpdatedLabel = (categoryQuestions) => {
    if (categoryQuestions.length === 0) return "-";

    const latest = categoryQuestions.reduce((latestDate, q) => {
      const d = new Date(q.updatedAt || q.createdAt);
      return d > latestDate ? d : latestDate;
    }, new Date(0));

    const days = Math.floor((Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const applySectionFilters = (list, state) => {
    const q = state.search.trim().toLowerCase();

    let filtered = !q
      ? list
      : list.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q) ||
            c.questions.some((qq) => qq.question?.toLowerCase().includes(q))
        );

    filtered = [...filtered].sort((a, b) => {
      if (state.sort === "most") return b.questions.length - a.questions.length;
      return (a.name || "").localeCompare(b.name || "");
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const page = Math.min(state.page, totalPages);
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return { paged, totalPages, page, total: filtered.length };
  };


  // =====================================================
  // EXPAND CATEGORY
  // =====================================================

 const toggleCategory = (section, categoryId) => {
  const key = `${section}:${categoryId}`;

  setExpandedCategories((prev) => ({
    ...prev,
    [key]: !prev[key],
  }));
};

const toggleViewAll = (section, categoryId) => {
  const key = `${section}:${categoryId}`;

  setShowAllCategories((prev) => ({
    ...prev,
    [key]: !prev[key],
  }));

  setExpandedCategories((prev) => ({
    ...prev,
    [key]: true,
  }));
};


  // =====================================================
  // DELETE QUESTION
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this question?");
    if (!confirmed) return;

    try {
      await deleteQuestion(id);
      toast.success("Question deleted successfully");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    }
  };


  // =====================================================
  // EDIT
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditOptionChange = (index, value) => {
    setEditQuestion((prev) => {
      const options = [...(prev.options || EMPTY_MCQ_OPTIONS)];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const isEditingMCQ = Array.isArray(editQuestion?.options) && editQuestion.options.length > 0;

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    if (!editQuestion) return;

    if (isEditingMCQ) {
      const filledOptions = editQuestion.options.filter((opt) => opt?.trim());
      if (filledOptions.length !== 4) {
        toast.error("All 4 options are required for an MCQ question.");
        return;
      }
    }

    try {
      setSaving(true);

      const payload = isEditingMCQ
        ? {
            question: editQuestion.question,
            difficulty: editQuestion.difficulty,
            marks: Number(editQuestion.marks),
            options: editQuestion.options,
            correctAnswer: Number(editQuestion.correctAnswer),
            topic: editQuestion.topic || "",
            status: editQuestion.status === true || editQuestion.status === "true",
          }
        : {
            question: editQuestion.question,
            difficulty: editQuestion.difficulty,
            marks: Number(editQuestion.marks),
            expectedAnswer: editQuestion.expectedAnswer || "",
            topic: editQuestion.topic || "",
            followUpQuestion: editQuestion.followUpQuestion || "",
            status: editQuestion.status === true || editQuestion.status === "true",
          };

      await updateQuestion(editQuestion._id, payload);
      toast.success("Question updated successfully");
      setEditQuestion(null);
      await loadData();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update question");
    } finally {
      setSaving(false);
    }
  };


  // =====================================================
  // ADD QUESTION
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
      options: [...EMPTY_MCQ_OPTIONS],
      correctAnswer: 0,
    });
    setShowAddModal(true);
  };

  const closeAddQuestionModal = () => setShowAddModal(false);

  const handleNewQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewOptionChange = (index, value) => {
    setNewQuestion((prev) => {
      const options = [...prev.options];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const selectedNewCategory = categories.find((c) => c._id === newQuestion.category);
  const isNewMCQ = selectedNewCategory?.type === "MCQ";

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
    if (isNewMCQ) {
      const filledOptions = newQuestion.options.filter((opt) => opt?.trim());
      if (filledOptions.length !== 4) {
        toast.error("All 4 options are required for an MCQ question.");
        return;
      }
    }

    try {
      setSaving(true);

      const payload = isNewMCQ
        ? {
            category: newQuestion.category,
            question: newQuestion.question,
            difficulty: newQuestion.difficulty,
            marks: Number(newQuestion.marks),
            topic: newQuestion.topic,
            options: newQuestion.options,
            correctAnswer: Number(newQuestion.correctAnswer),
            source: "Manual",
            status: true,
          }
        : {
            category: newQuestion.category,
            question: newQuestion.question,
            difficulty: newQuestion.difficulty,
            marks: Number(newQuestion.marks),
            topic: newQuestion.topic,
            expectedAnswer: newQuestion.expectedAnswer,
            followUpQuestion: newQuestion.followUpQuestion,
            source: "Manual",
            status: true,
          };

      await createQuestion(payload);
      toast.success("Question added successfully");
      closeAddQuestionModal();
      await loadData();

    } catch (error) {
      console.error("Create Question Error:", error);
      toast.error(error.response?.data?.message || "Failed to create question");
    } finally {
      setSaving(false);
    }
  };


  // =====================================================
  // AI MCQ GENERATION
  // =====================================================

  const openMCQAIModal = (category) => {
    setMcqAICategory(category);
    setMcqGenForm({ numberOfQuestions: 5, difficulty: "Beginner", topic: "" });
    setMcqPreview(null);
    setShowMCQAIModal(true);
  };

  const closeMCQAIModal = () => {
    setShowMCQAIModal(false);
    setMcqAICategory(null);
    setMcqPreview(null);
  };

  const handleMCQGenFormChange = (e) => {
    const { name, value } = e.target;
    setMcqGenForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateMCQ = async () => {
    if (!mcqAICategory) return;

    try {
      setGeneratingMCQ(true);

      const result = await generateMCQQuestions({
        category: mcqAICategory.name,
        numberOfQuestions: Number(mcqGenForm.numberOfQuestions) || 5,
        difficulty: mcqGenForm.difficulty,
        topic: mcqGenForm.topic,
      });

      if (!result.questions || result.questions.length === 0) {
        toast.error("The AI didn't return any usable questions. Try again.");
        return;
      }

      setMcqPreview(result.questions);

    } catch (error) {
      console.error("Generate MCQ Error:", error);
      toast.error(error.response?.data?.message || "Failed to generate MCQ questions.");
    } finally {
      setGeneratingMCQ(false);
    }
  };

  const handleSaveMCQPreview = async () => {
    if (!mcqAICategory || !mcqPreview || mcqPreview.length === 0) return;

    try {
      setSavingMCQBatch(true);

      const result = await saveAIMCQQuestions(mcqAICategory._id, mcqPreview);
      toast.success(result.message || "MCQ questions saved successfully.");

      closeMCQAIModal();
      await loadData();

    } catch (error) {
      console.error("Save MCQ Error:", error);
      toast.error(error.response?.data?.message || "Failed to save MCQ questions.");
    } finally {
      setSavingMCQBatch(false);
    }
  };


  // =====================================================
  // RENDER: one category row + its expand panel
  // =====================================================

  const renderCategoryRow = (category, showAIButton) => {

   const categoryKey = `qa:${category._id}`;

const isExpanded =
  expandedCategories[categoryKey] || false;

const showAll =
  showAllCategories[categoryKey] || false;
    const visibleQuestions = showAll ? category.questions : category.questions.slice(0, 3);
    const dist = getDifficultyDistribution(category.questions);

    return (

      <div className={styles.iqCatRowGroup} key={category._id}>

        <div className={styles.iqCatRow}>

          <div className={styles.iqCatCell}>
            <div className={styles.iqCategoryIcon}>
              <img src={getCategoryLogo(category.name)} alt={category.name} />
            </div>
            <div>
              <div className={styles.iqCategoryTitleRow}>
                <h2>{category.name}</h2>
                <span>{category.questions.length} Questions</span>
              </div>
              <p>{category.description || "Interview questions and assessment topics"}</p>
            </div>
          </div>

          <div className={styles.iqDistCell}>
            <span className={styles.iqDistDot}><i className={styles.dotGreen} />{dist.Beginner}</span>
            <span className={styles.iqDistDot}><i className={styles.dotYellow} />{dist.Intermediate}</span>
            <span className={styles.iqDistDot}><i className={styles.dotRed} />{dist.Advanced}</span>
          </div>

          <div className={styles.iqCountCell}>{category.questions.length}</div>

          <div className={styles.iqUpdatedCell}>{getLastUpdatedLabel(category.questions)}</div>

          <div className={styles.iqCategoryControls}>

            {showAIButton && (
              <button className={styles.iqAIButton} onClick={() => openMCQAIModal(category)}>
                <FaMagic />
                Generate with AI
              </button>
            )}

            <button className={styles.iqAddButton} onClick={() => openAddQuestionModal(category)}>
              <FaPlus />
              Add Question
            </button>

            <button className={styles.iqExpandButton} onClick={() => toggleCategory("qa", category._id)}>
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>

          </div>

        </div>

        {isExpanded && (

          <div className={styles.iqCategoryContent}>

            {category.questions.length === 0 ? (

              <div className={styles.iqNoQuestions}>
                No questions available in this category.
              </div>

            ) : (

              <>

                <div className={styles.iqTableWrapper}>
                  <table className={styles.iqTable}>
                    <thead>
                      <tr>
                        <th>QUESTION</th>
                        <th>DIFFICULTY</th>
                        <th>MARKS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleQuestions.map((question) => (
                        <tr key={question._id}>
                          <td>
                            <div className={styles.iqQuestionText}>{question.question}</div>
                          </td>
                          <td>
                            <span
                              className={`${styles.iqDifficulty} ${
                                question.difficulty === "Beginner"
                                  ? styles.beginner
                                  : question.difficulty === "Advanced"
                                  ? styles.advanced
                                  : styles.intermediate
                              }`}
                            >
                              {question.difficulty}
                            </span>
                          </td>
                          <td><span className={styles.iqMarks}>{question.marks || 5}</span></td>
                          <td>
                            <div className={styles.iqActions}>
                              <button className={styles.iqViewButton} title="View Question" onClick={() => setViewQuestion(question)}>
                                <FaEye />
                              </button>
                              <button className={styles.iqEditButton} title="Edit Question" onClick={() => setEditQuestion({ ...question })}>
                                <FaEdit />
                              </button>
                              <button className={styles.iqDeleteButton} title="Delete Question" onClick={() => handleDelete(question._id)}>
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {category.questions.length > 3 && (
                  <button className={styles.iqViewAll} onClick={() => toggleViewAll("qa", category._id)}>
                    {showAll ? "Show less" : `View all ${category.questions.length} questions`}
                    <span>{showAll ? "↑" : "→"}</span>
                  </button>
                )}

              </>

            )}

          </div>

        )}

      </div>

    );

  };

  const renderCodingCategoryRow = (category) => {
const categoryKey = `coding:${category._id}`;

const isExpanded =
  expandedCategories[categoryKey] || false;

const showAll =
  showAllCategories[categoryKey] || false;

  const visibleProblems = showAll
    ? category.questions
    : category.questions.slice(0, 3);

  const dist = getDifficultyDistribution(
    category.questions
  );

  return (
    <div
      className={styles.iqCatRowGroup}
      key={category._id}
    >

      <div className={styles.iqCatRow}>

        {/* CATEGORY */}

        <div className={styles.iqCatCell}>

          <div className={styles.iqCategoryIcon}>
            <img
              src={getCategoryLogo(category.name)}
              alt={category.name}
            />
          </div>

          <div>

            <div className={styles.iqCategoryTitleRow}>

              <h2>{category.name}</h2>

              <span>
                {category.questions.length}{" "}
                {category.questions.length === 1
                  ? "Problem"
                  : "Problems"}
              </span>

            </div>

            <p>
              {category.description ||
                "Coding interview problems"}
            </p>

          </div>

        </div>


        {/* DIFFICULTY */}

        <div className={styles.iqDistCell}>

          <span className={styles.iqDistDot}>
            <i className={styles.dotGreen} />
            {dist.Beginner}
          </span>

          <span className={styles.iqDistDot}>
            <i className={styles.dotYellow} />
            {dist.Intermediate}
          </span>

          <span className={styles.iqDistDot}>
            <i className={styles.dotRed} />
            {dist.Advanced}
          </span>

        </div>


        {/* COUNT */}

        <div className={styles.iqCountCell}>
          {category.questions.length}
        </div>


        {/* UPDATED */}

        <div className={styles.iqUpdatedCell}>
          {getLastUpdatedLabel(category.questions)}
        </div>


        {/* ACTIONS */}

        <div className={styles.iqCategoryControls}>

          <button
            className={styles.iqExpandButton}
           onClick={() =>
  toggleCategory("coding", category._id)
}
          >
            {isExpanded
              ? <FaChevronUp />
              : <FaChevronDown />}
          </button>

        </div>

      </div>


      {/* EXPANDED CODING PROBLEMS */}

      {isExpanded && (

        <div className={styles.iqCategoryContent}>

          <div className={styles.iqTableWrapper}>

            <table className={styles.iqTable}>

              <thead>
                <tr>
                  <th>PROBLEM</th>
                  <th>DIFFICULTY</th>
                  <th>LANGUAGE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {visibleProblems.map((problem) => (

                  <tr key={problem._id}>

                    <td>

                      <div className={styles.iqQuestionText}>
                        {problem.title}
                      </div>

                      <small>
                        {problem.description}
                      </small>

                    </td>

                    <td>

                      <span
                        className={`${styles.iqDifficulty} ${
                          problem.difficulty === "Beginner"
                            ? styles.beginner
                            : problem.difficulty === "Advanced"
                            ? styles.advanced
                            : styles.intermediate
                        }`}
                      >
                        {problem.difficulty}
                      </span>

                    </td>

                    <td>
                      {problem.languages?.join(", ") || "-"}
                    </td>

                    <td>
                      {problem.status || "Draft"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {category.questions.length > 3 && (

            <button
              className={styles.iqViewAll}
              onClick={() =>
  toggleViewAll("coding", category._id)
}
            >
              {showAll
                ? "Show less"
                : `View all ${category.questions.length} problems`}

              <span>
                {showAll ? "↑" : "→"}
              </span>

            </button>

          )}

        </div>

      )}

    </div>
  );
};


  // =====================================================
  // RENDER: a whole section (search + sort + table + pagination)
  // =====================================================

  const renderSection = ({ key, title, description, showAI }) => {

    const state = sectionState[key];
    const list = categoriesBySection[key];
    const { paged, totalPages, page, total } = applySectionFilters(list, state);

    return (

      <div className={styles.iqSectionBlock} key={key}>

        <div className={styles.iqSectionCard}>

          <div className={styles.iqSectionHead}>
            <div className={styles.iqSectionTitleWrap}>
              <div className={styles.iqSectionIcon}>
                {key === "mcq" ? <FaListUl /> : <FaCode />}
              </div>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </div>

            <div className={styles.iqSectionControls}>
              <div className={styles.iqSectionSearch}>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={state.search}
                  onChange={(e) => updateSection(key, { search: e.target.value, page: 1 })}
                />
              </div>

              <select
                className={styles.iqSortSelect}
                value={state.sort}
                onChange={(e) => updateSection(key, { sort: e.target.value })}
              >
                <option value="name">Sort by: A - Z</option>
                <option value="most">Sort by: Most Questions</option>
              </select>
            </div>
          </div>

          {total === 0 ? (

            <div className={styles.iqEmpty}>
              {key === "coding"
                ? 'No coding-problem categories yet. Create a category with type "Coding" to get started.'
                : key === "mcq"
                ? 'No MCQ categories yet. Create a category with type "MCQ" to get started.'
                : "No categories or questions found."}
            </div>

          ) : (

            <>

              <div className={styles.iqCatTableHeader}>
                <span>Category</span>
                <span>Difficulty Distribution</span>
                <span>Questions</span>
                <span>Last Updated</span>
                <span>Actions</span>
              </div>

              <div className={styles.iqCategoryList}>
                {paged.map((category) =>
  key === "coding"
    ? renderCodingCategoryRow(category)
    : renderCategoryRow(category, showAI)
)}
              </div>

              <div className={styles.iqPagination}>
                <span>Showing {list.length} categories</span>

                {totalPages > 1 && (
                  <div className={styles.iqPageControls}>
                    <button
                      disabled={page <= 1}
                      onClick={() => updateSection(key, { page: page - 1 })}
                    >
                      <FaChevronLeft />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={p === page ? styles.iqPageActive : ""}
                        onClick={() => updateSection(key, { page: p })}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      disabled={page >= totalPages}
                      onClick={() => updateSection(key, { page: page + 1 })}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>

            </>

          )}

        </div>

      </div>

    );

  };


  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (

    <AdminLayout>

      <div className={styles.iqPage}>

        <div className={styles.iqHeader}>
          <div>
            <h1>Question Bank</h1>
            <p>Manage all coding and MCQ questions organized by categories.</p>
          </div>
          <button className={styles.iqPrimaryButton} onClick={() => openAddQuestionModal()}>
            <FaPlus />
            Add Question
          </button>
        </div>

        <div className={styles.iqStatsGrid}>

          <div className={styles.iqStatCard}>
            <div className={`${styles.iqStatIcon} ${styles.purple}`}><FaQuestionCircle /></div>
            <div><strong>{totalQuestions}</strong><span>Total Questions</span></div>
          </div>

          <div className={styles.iqStatCard}>
            <div className={`${styles.iqStatIcon} ${styles.green}`}><FaCheckCircle /></div>
            <div><strong>{activeQuestions}</strong><span>Active Questions</span></div>
          </div>

          <div className={styles.iqStatCard}>
            <div className={`${styles.iqStatIcon} ${styles.orange}`}><FaCode /></div>
            <div><strong>{codingQuestionsCount}</strong><span>Coding Questions</span></div>
          </div>

          <div className={styles.iqStatCard}>
            <div className={`${styles.iqStatIcon} ${styles.red}`}><FaListUl /></div>
            <div><strong>{mcqQuestionsCount}</strong><span>MCQ Questions</span></div>
          </div>

        </div>

        {loading ? (
          <div className={styles.iqLoading}>Loading questions...</div>
        ) : (
          SECTIONS.map((section) => renderSection(section))
        )}


        {/* VIEW QUESTION MODAL */}

        {viewQuestion && (
          <div className={styles.iqModalOverlay} onClick={() => setViewQuestion(null)}>
            <div className={styles.iqModal} onClick={(e) => e.stopPropagation()}>

              <div className={styles.iqModalHeader}>
                <div>
                  <h2>Question Details</h2>
                  <p>View interview question information</p>
                </div>
                <button className={styles.iqCloseButton} onClick={() => setViewQuestion(null)}>
                  <FaTimes />
                </button>
              </div>

              <div className={styles.iqViewContent}>

                <div className={styles.iqViewQuestion}>{viewQuestion.question}</div>

                <div className={styles.iqDetailGrid}>
                  <div><label>Category</label><strong>{viewQuestion.category?.name || "Unknown"}</strong></div>
                  <div><label>Difficulty</label><strong>{viewQuestion.difficulty}</strong></div>
                  <div><label>Marks</label><strong>{viewQuestion.marks || 5}</strong></div>
                  <div><label>Source</label><strong>{viewQuestion.source || "Manual"}</strong></div>
                </div>

                {Array.isArray(viewQuestion.options) && viewQuestion.options.length > 0 ? (
                  <div className={styles.iqDetailBlock}>
                    <label>Answer Options</label>
                    <div className={styles.iqOptionsView}>
                      {viewQuestion.options.map((opt, i) => (
                        <div key={i} className={`${styles.iqOptionViewRow} ${i === viewQuestion.correctAnswer ? styles.correctOption : ""}`}>
                          {opt}
                          {i === viewQuestion.correctAnswer && <span className={styles.correctBadge}>Correct</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {viewQuestion.topic && (
                      <div className={styles.iqDetailBlock}><label>Topic</label><p>{viewQuestion.topic}</p></div>
                    )}
                    {viewQuestion.expectedAnswer && (
                      <div className={styles.iqDetailBlock}><label>Expected Answer</label><p>{viewQuestion.expectedAnswer}</p></div>
                    )}
                    {viewQuestion.followUpQuestion && (
                      <div className={styles.iqDetailBlock}><label>Follow-up Question</label><p>{viewQuestion.followUpQuestion}</p></div>
                    )}
                  </>
                )}

              </div>

              <div className={styles.iqModalFooter}>
                <button className={styles.iqCancelButton} onClick={() => setViewQuestion(null)}>Close</button>
              </div>

            </div>
          </div>
        )}


        {/* EDIT QUESTION MODAL */}

        {editQuestion && (
          <div className={styles.iqModalOverlay} onClick={() => setEditQuestion(null)}>
            <div className={styles.iqModal} onClick={(e) => e.stopPropagation()}>

              <div className={styles.iqModalHeader}>
                <div><h2>Edit Question</h2><p>Update question information</p></div>
                <button className={styles.iqCloseButton} onClick={() => setEditQuestion(null)}><FaTimes /></button>
              </div>

              <form onSubmit={handleUpdateQuestion}>
                <div className={styles.iqForm}>

                  <div className={styles.iqFormGroup}>
                    <label>Question</label>
                    <textarea name="question" value={editQuestion.question || ""} onChange={handleEditChange} required />
                  </div>

                  <div className={styles.iqFormRow}>
                    <div className={styles.iqFormGroup}>
                      <label>Difficulty</label>
                      <select name="difficulty" value={editQuestion.difficulty || "Beginner"} onChange={handleEditChange}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className={styles.iqFormGroup}>
                      <label>Marks</label>
                      <input type="number" name="marks" min="1" value={editQuestion.marks || 5} onChange={handleEditChange} />
                    </div>
                  </div>

                  {isEditingMCQ ? (
                    <>
                      <div className={styles.iqFormGroup}>
                        <label>Topic</label>
                        <input type="text" name="topic" value={editQuestion.topic || ""} onChange={handleEditChange} placeholder="Enter topic" />
                      </div>
                      <div className={styles.iqFormGroup}>
                        <label>Answer Options (select the correct one)</label>
                        {editQuestion.options.map((opt, i) => (
                          <div className={styles.iqOptionRow} key={i}>
                            <input
                              type="radio"
                              name="editCorrectAnswer"
                              checked={Number(editQuestion.correctAnswer) === i}
                              onChange={() => setEditQuestion((prev) => ({ ...prev, correctAnswer: i }))}
                            />
                            <input type="text" value={opt} onChange={(e) => handleEditOptionChange(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.iqFormGroup}>
                        <label>Topic</label>
                        <input type="text" name="topic" value={editQuestion.topic || ""} onChange={handleEditChange} placeholder="Enter topic" />
                      </div>
                      <div className={styles.iqFormGroup}>
                        <label>Expected Answer</label>
                        <textarea name="expectedAnswer" value={editQuestion.expectedAnswer || ""} onChange={handleEditChange} placeholder="Enter expected answer" />
                      </div>
                      <div className={styles.iqFormGroup}>
                        <label>Follow-up Question</label>
                        <input type="text" name="followUpQuestion" value={editQuestion.followUpQuestion || ""} onChange={handleEditChange} placeholder="Enter follow-up question" />
                      </div>
                    </>
                  )}

                  <div className={styles.iqFormGroup}>
                    <label>Status</label>
                    <select name="status" value={editQuestion.status ? "true" : "false"} onChange={handleEditChange}>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                </div>

                <div className={styles.iqModalFooter}>
                  <button type="button" className={styles.iqCancelButton} onClick={() => setEditQuestion(null)}>Cancel</button>
                  <button type="submit" className={styles.iqSaveButton} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}


        {/* ADD QUESTION MODAL */}

        {showAddModal && (
          <div className={styles.iqModalOverlay} onClick={closeAddQuestionModal}>
            <div className={styles.iqModal} onClick={(e) => e.stopPropagation()}>

              <div className={styles.iqModalHeader}>
                <div><h2>Add Question</h2><p>Create a new interview question</p></div>
                <button type="button" className={styles.iqCloseButton} onClick={closeAddQuestionModal}><FaTimes /></button>
              </div>

              <form onSubmit={handleCreateQuestion}>
                <div className={styles.iqForm}>

                  <div className={styles.iqFormGroup}>
                    <label>Category</label>
                    <select name="category" value={newQuestion.category} onChange={handleNewQuestionChange} required>
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name} ({category.type || "Q&A"})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.iqFormGroup}>
                    <label>Question</label>
                    <textarea name="question" value={newQuestion.question} onChange={handleNewQuestionChange} placeholder="Enter interview question..." required />
                  </div>

                  <div className={styles.iqFormRow}>
                    <div className={styles.iqFormGroup}>
                      <label>Difficulty</label>
                      <select name="difficulty" value={newQuestion.difficulty} onChange={handleNewQuestionChange}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className={styles.iqFormGroup}>
                      <label>Marks</label>
                      <input type="number" name="marks" min="1" value={newQuestion.marks} onChange={handleNewQuestionChange} />
                    </div>
                  </div>

                  <div className={styles.iqFormGroup}>
                    <label>Topic</label>
                    <input type="text" name="topic" value={newQuestion.topic} onChange={handleNewQuestionChange} placeholder="e.g. CSS Specificity" />
                  </div>

                  {isNewMCQ ? (
                    <div className={styles.iqFormGroup}>
                      <label>Answer Options (select the correct one)</label>
                      {newQuestion.options.map((opt, i) => (
                        <div className={styles.iqOptionRow} key={i}>
                          <input
                            type="radio"
                            name="newCorrectAnswer"
                            checked={Number(newQuestion.correctAnswer) === i}
                            onChange={() => setNewQuestion((prev) => ({ ...prev, correctAnswer: i }))}
                          />
                          <input type="text" value={opt} onChange={(e) => handleNewOptionChange(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className={styles.iqFormGroup}>
                        <label>Expected Answer</label>
                        <textarea name="expectedAnswer" value={newQuestion.expectedAnswer} onChange={handleNewQuestionChange} placeholder="Enter the expected answer..." />
                      </div>
                      <div className={styles.iqFormGroup}>
                        <label>Follow-up Question</label>
                        <input type="text" name="followUpQuestion" value={newQuestion.followUpQuestion} onChange={handleNewQuestionChange} placeholder="Optional follow-up question" />
                      </div>
                    </>
                  )}

                </div>

                <div className={styles.iqModalFooter}>
                  <button type="button" className={styles.iqCancelButton} onClick={closeAddQuestionModal}>Cancel</button>
                  <button type="submit" className={styles.iqSaveButton} disabled={saving}>
                    {saving ? "Adding..." : "Add Question"}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}


        {/* GENERATE MCQ WITH AI MODAL */}

        {showMCQAIModal && (
          <div className={styles.iqModalOverlay} onClick={closeMCQAIModal}>
            <div className={styles.iqModal} onClick={(e) => e.stopPropagation()}>

              <div className={styles.iqModalHeader}>
                <div><h2>Generate MCQ with AI</h2><p>{mcqAICategory?.name} — powered by Gemini</p></div>
                <button type="button" className={styles.iqCloseButton} onClick={closeMCQAIModal}><FaTimes /></button>
              </div>

              <div className={styles.iqForm}>

                {!mcqPreview ? (
                  <>
                    <div className={styles.iqFormRow}>
                      <div className={styles.iqFormGroup}>
                        <label>Number of Questions</label>
                        <input type="number" name="numberOfQuestions" min="1" max="20" value={mcqGenForm.numberOfQuestions} onChange={handleMCQGenFormChange} />
                      </div>
                      <div className={styles.iqFormGroup}>
                        <label>Difficulty</label>
                        <select name="difficulty" value={mcqGenForm.difficulty} onChange={handleMCQGenFormChange}>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.iqFormGroup}>
                      <label>Additional Focus (optional)</label>
                      <input type="text" name="topic" value={mcqGenForm.topic} onChange={handleMCQGenFormChange} placeholder="e.g. focus on array methods" />
                    </div>
                  </>
                ) : (
                  <div className={styles.iqMCQPreviewList}>
                    {mcqPreview.map((q, qi) => (
                      <div className={styles.iqMCQPreviewCard} key={qi}>
                        <p className={styles.iqMCQPreviewQuestion}>{qi + 1}. {q.question}</p>
                        <div className={styles.iqOptionsView}>
                          {q.options.map((opt, oi) => (
                            <div key={oi} className={`${styles.iqOptionViewRow} ${oi === q.correctAnswer ? styles.correctOption : ""}`}>
                              {opt}
                              {oi === q.correctAnswer && <span className={styles.correctBadge}>Correct</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              <div className={styles.iqModalFooter}>
                {!mcqPreview ? (
                  <>
                    <button type="button" className={styles.iqCancelButton} onClick={closeMCQAIModal}>Cancel</button>
                    <button type="button" className={styles.iqSaveButton} onClick={handleGenerateMCQ} disabled={generatingMCQ}>
                      {generatingMCQ ? "Generating..." : "Generate Questions"}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className={styles.iqCancelButton} onClick={() => setMcqPreview(null)}>Back</button>
                    <button type="button" className={styles.iqSaveButton} onClick={handleSaveMCQPreview} disabled={savingMCQBatch}>
                      {savingMCQBatch ? "Saving..." : `Save All (${mcqPreview.length})`}
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

    </AdminLayout>

  );

};

export default Questions;
