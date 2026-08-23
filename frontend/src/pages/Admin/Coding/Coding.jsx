import { useEffect, useMemo, useState } from "react";

import {
  FaCode,
  FaChartBar,
  FaCheckCircle,
  FaTrophy,
  FaSearch,
  FaRedo,
  FaEye,
  FaEdit,
  FaEllipsisH,
  FaMagic,
  FaPython,
  FaJs,
} from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import {
  getCodingProblems,
  getCodingStatistics,
  createCodingProblem,
  generateCodingProblems,
  getCodingProblem,
  updateCodingProblem,
} from "../../../services/codingService";

import { getCategories } from "../../../services/categoryService";

import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";

import "./Coding.css";

const Coding = () => {
  // ==========================================
  // REAL DATA
  // ==========================================

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [codingProblems, setCodingProblems] =
    useState([]);

  const [codingStats, setCodingStats] = useState({
    totalProblems: 0,

    difficulty: {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    },

    status: {
      published: 0,
      draft: 0,
      archived: 0,
    },

    totalSubmissions: 0,
    acceptedSubmissions: 0,
    acceptanceRate: 0,
  });

  const [codingLoading, setCodingLoading] =
    useState(true);

    const [selectedProblem, setSelectedProblem] =
  useState(null);

const [problemModalMode, setProblemModalMode] =
  useState(null);

const [problemSaving, setProblemSaving] =
  useState(false);

  // ==========================================
  // FILTERS
  // ==========================================

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("All");
  const [language, setLanguage] = useState("All");
  const [status, setStatus] = useState("All");

  // ==========================================
  // AI GENERATION
  // ==========================================

  const [aiDifficulty, setAiDifficulty] =
    useState("Intermediate");

  const [aiLanguage, setAiLanguage] =
    useState("Python");

  const [aiTopic, setAiTopic] =
    useState("");

  const [aiNumber, setAiNumber] =
    useState("5");

  const [aiInstructions, setAiInstructions] =
    useState(
      "Focus on coding interview problems suitable for the selected difficulty level."
    );

  const [aiPreview, setAiPreview] =
    useState([]);

  const [aiGenerating, setAiGenerating] =
    useState(false);

  const [aiSaving, setAiSaving] =
    useState(false);

  // ==========================================
  // FETCH DATA
  // ==========================================

  useEffect(() => {
    fetchCodingData();
  }, []);

  const fetchCodingData = async () => {
    try {
      setCodingLoading(true);
      setCategoriesLoading(true);

      const [
        categoriesResponse,
        problemsResponse,
        statisticsResponse,
      ] = await Promise.all([
        getCategories(),
        getCodingProblems(),
        getCodingStatistics(),
      ]);

     const categoryList = Array.isArray(categoriesResponse)
  ? categoriesResponse
  : categoriesResponse?.categories || [];

setCategories(categoryList);

      setCodingProblems(
        problemsResponse?.problems || []
      );

      setCodingStats(
        statisticsResponse?.statistics || {
          totalProblems: 0,

          difficulty: {
            beginner: 0,
            intermediate: 0,
            advanced: 0,
          },

          status: {
            published: 0,
            draft: 0,
            archived: 0,
          },

          totalSubmissions: 0,
          acceptedSubmissions: 0,
          acceptanceRate: 0,
        }
      );
    } catch (error) {
      console.error(
        "Failed to load coding data:",
        error
      );
    } finally {
      setCodingLoading(false);
      setCategoriesLoading(false);
    }
  };

  // ==========================================
// VIEW CODING PROBLEM
// ==========================================

const handleViewProblem = async (problemId) => {
  try {
    const response =
      await getCodingProblem(problemId);

    setSelectedProblem(response.problem);
    setProblemModalMode("view");

  } catch (error) {

    console.error(
      "Failed to fetch coding problem:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Failed to load coding problem."
    );
  }
};


// ==========================================
// EDIT CODING PROBLEM
// ==========================================

const handleEditProblem = async (problemId) => {
  try {
    const response =
      await getCodingProblem(problemId);

    setSelectedProblem(response.problem);
    setProblemModalMode("edit");

  } catch (error) {

    console.error(
      "Failed to fetch coding problem:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Failed to load coding problem."
    );
  }
};

  // ==========================================
  // FILTER PROBLEMS
  // ==========================================

  const filteredProblems = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return codingProblems.filter((problem) => {
      const matchesSearch =
        !searchValue ||
        problem.title
          ?.toLowerCase()
          .includes(searchValue) ||
        problem.description
          ?.toLowerCase()
          .includes(searchValue);

      const matchesDifficulty =
        difficulty === "All" ||
        problem.difficulty === difficulty;

      const matchesTopic =
        topic === "All" ||
        problem.category?._id === topic;

      const matchesLanguage =
        language === "All" ||
        problem.languages?.includes(language);

      const matchesStatus =
        status === "All" ||
        problem.status === status;

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesTopic &&
        matchesLanguage &&
        matchesStatus
      );
    });
  }, [
    codingProblems,
    search,
    difficulty,
    topic,
    language,
    status,
  ]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setDifficulty("All");
    setTopic("All");
    setLanguage("All");
    setStatus("All");
  };

  // ==========================================
  // DIFFICULTY CLASS
  // ==========================================

  const getDifficultyClass = (value) => {
    if (!value) return "";

    return value
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // ==========================================
  // LANGUAGE ICON
  // ==========================================

  const getLanguageIcon = (value) => {
    if (value === "Python") {
      return <FaPython />;
    }

    if (value === "JavaScript") {
      return <FaJs />;
    }

    if (value === "C++") {
      return (
        <span className="language-text">
          C++
        </span>
      );
    }

    if (value === "Java") {
      return (
        <span className="language-text">
          J
        </span>
      );
    }

    if (value === "C") {
      return (
        <span className="language-text">
          C
        </span>
      );
    }

    return (
      <span className="language-text">
        {value?.charAt(0) || "?"}
      </span>
    );
  };

  // ==========================================
  // GENERATE WITH AI
  // ==========================================

  const handleGenerate = async () => {
    if (!aiTopic) {
      alert("Please select a subject.");
      return;
    }

    try {
      setAiGenerating(true);

      setAiPreview([]);

     const response =
  await generateCodingProblems({
    difficulty: aiDifficulty,
    language: aiLanguage,
    category: aiTopic,
    numberOfProblems: Number(aiNumber),
    instructions: aiInstructions,
  });

      if (response?.success) {
        setAiPreview(
          response.problems || []
        );
      } else {
        alert(
          response?.message ||
            "Failed to generate problems."
        );
      }
    } catch (error) {
      console.error(
        "AI generation failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to generate coding problems."
      );
    } finally {
      setAiGenerating(false);
    }
  };

  // ==========================================
  // SAVE GENERATED PROBLEMS
  // ==========================================

  const handleSaveGeneratedProblems = async () => {
    if (aiPreview.length === 0) {
      alert("There are no generated problems to save.");
      return;
    }

    try {
      setAiSaving(true);

      const problemsToSave = aiPreview.map(
        (problem) => ({
          title: problem.title,
          description: problem.description,

         category: aiTopic,

          difficulty:
            problem.difficulty ||
            aiDifficulty,

          languages:
            problem.languages?.length
              ? problem.languages
              : [aiLanguage],

          inputFormat:
            problem.inputFormat || "",

          outputFormat:
            problem.outputFormat || "",

          constraints:
            problem.constraints || [],

          examples:
            problem.examples || [],

          starterCode:
            problem.starterCode || "",

          testCases:
            problem.testCases || [],

          hints:
            problem.hints || [],

          timeComplexity:
            problem.timeComplexity || "",

          spaceComplexity:
            problem.spaceComplexity || "",

          generatedByAI: true,

          aiInstructions:
            aiInstructions || "",

          status: "Draft",

          totalSubmissions: 0,

          acceptedSubmissions: 0,

          acceptanceRate: 0,
        })
      );

      await Promise.all(
        problemsToSave.map((problem) =>
          createCodingProblem(problem)
        )
      );

      alert(
        `${problemsToSave.length} coding problem${
          problemsToSave.length > 1
            ? "s"
            : ""
        } saved successfully.`
      );

      // Clear preview
      setAiPreview([]);

      // Reload actual MongoDB data
      await fetchCodingData();

    } catch (error) {
      console.error(
        "Failed to save generated problems:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save generated coding problems."
      );
    } finally {
      setAiSaving(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <AdminLayout>

      <div className="coding-page">

        {/* HEADER */}

        <div className="coding-header">

          <div>

            <h1>
              Coding Problems
            </h1>

            <p>
              Create, manage and track
              AI-generated coding problems
            </p>

          </div>

          <button
            type="button"
            className="coding-generate-header-btn"
            onClick={handleGenerate}
          >
            <FaMagic />
            Generate with AI
          </button>

        </div>

        {/* STATISTICS */}

        <div className="coding-stats">

          <div className="coding-stat-card">

            <div className="coding-stat-icon purple">
              <FaCode />
            </div>

            <div>
              <span>Total Problems</span>

              <strong>
                {codingLoading
                  ? "..."
                  : codingStats.totalProblems}
              </strong>

              <small>
                Coding problem bank
              </small>
            </div>

          </div>

          <div className="coding-stat-card">

            <div className="coding-stat-icon blue">
              <FaChartBar />
            </div>

            <div>
              <span>Beginner</span>

              <strong>
                {codingLoading
                  ? "..."
                  : codingStats.difficulty.beginner}
              </strong>

              <small>
                Beginner problems
              </small>
            </div>

          </div>

          <div className="coding-stat-card">

            <div className="coding-stat-icon orange">
              <FaChartBar />
            </div>

            <div>
              <span>Intermediate</span>

              <strong>
                {codingLoading
                  ? "..."
                  : codingStats.difficulty.intermediate}
              </strong>

              <small>
                Intermediate problems
              </small>
            </div>

          </div>

          <div className="coding-stat-card">

            <div className="coding-stat-icon red">
              <FaChartBar />
            </div>

            <div>
              <span>Advanced</span>

              <strong>
                {codingLoading
                  ? "..."
                  : codingStats.difficulty.advanced}
              </strong>

              <small>
                Advanced problems
              </small>
            </div>

          </div>

          <div className="coding-stat-card">

            <div className="coding-stat-icon green">
              <FaCheckCircle />
            </div>

            <div>
              <span>Total Submissions</span>

              <strong>
                {codingLoading
                  ? "..."
                  : codingStats.totalSubmissions.toLocaleString()}
              </strong>

              <small>
                Across all problems
              </small>
            </div>

          </div>

          <div className="coding-stat-card">

            <div className="coding-stat-icon cyan">
              <FaTrophy />
            </div>

            <div>
              <span>Acceptance Rate</span>

              <strong>
                {codingLoading
                  ? "..."
                  : `${codingStats.acceptanceRate}%`}
              </strong>

              <small>
                Overall acceptance
              </small>
            </div>

          </div>

        </div>

        {/* MAIN */}

        <div className="coding-main-grid">

          {/* PROBLEMS */}

          <section className="coding-problems-section">

            <div className="coding-filter-bar">

              <div className="coding-search">

                <FaSearch />

                <input
                  type="text"
                  placeholder="Search problems by title or description..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
              >
                <option value="All">
                  Difficulty
                </option>

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

              <select
                value={topic}
                onChange={(e) =>
                  setTopic(e.target.value)
                }
              >

                <option value="All">
                  All Subjects
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

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
              >
                <option value="All">
                  Language
                </option>

                <option value="Python">
                  Python
                </option>

                <option value="JavaScript">
                  JavaScript
                </option>

                <option value="Java">
                  Java
                </option>

                <option value="C++">
                  C++
                </option>

                <option value="C">
                  C
                </option>
              </select>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="All">
                  Status
                </option>

                <option value="Published">
                  Published
                </option>

                <option value="Draft">
                  Draft
                </option>

                <option value="Archived">
                  Archived
                </option>
              </select>

              <button
                type="button"
                className="coding-clear-btn"
                onClick={clearFilters}
              >
                <FaRedo />
                Clear Filters
              </button>

            </div>

            <div className="coding-table-wrapper">

              <div className="coding-table-head">

                <span>Problem</span>
                <span>Difficulty</span>
                <span>Subject</span>
                <span>Languages</span>
                <span>Status</span>
                <span>Submissions</span>
                <span>Acceptance</span>
                <span>Actions</span>

              </div>

              <div className="coding-table-body">

                {codingLoading ? (

                  <div className="coding-empty">

                    <FaCode />

                    <h3>
                      Loading coding problems...
                    </h3>

                    <p>
                      Fetching data from the server.
                    </p>

                  </div>

                ) : filteredProblems.length === 0 ? (

                  <div className="coding-empty">

                    <FaCode />

                    <h3>
                      No coding problems yet
                    </h3>

                    <p>
                      Generate your first coding
                      problems with AI.
                    </p>

                  </div>

                ) : (

                  filteredProblems.map(
                    (problem) => (

                      <div
                        className="coding-table-row"
                        key={problem._id}
                      >

                        <div className="coding-problem-info">

                          <div className="coding-problem-icon">
                            <FaCode />
                          </div>

                          <div>

                            <h3>
                              {problem.title}
                            </h3>

                            <p>
                              {problem.description}
                            </p>

                          </div>

                        </div>

                        <div>

                          <span
                            className={`coding-difficulty ${getDifficultyClass(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>

                        </div>

                        <div className="coding-topic">

                          {problem.category?.name ||
                            "Uncategorized"}

                        </div>

                        <div className="coding-languages">

                          {(problem.languages || [])
                            .slice(0, 3)
                            .map((item) => (

                              <span
                                className="coding-language"
                                key={item}
                              >
                                {getLanguageIcon(item)}
                              </span>

                            ))}

                        </div>

                        <div>

                          <span
                            className={`coding-status ${problem.status?.toLowerCase()}`}
                          >

                            <span />

                            {problem.status}

                          </span>

                        </div>

                        <div className="coding-number">

                          {(
                            problem.totalSubmissions ||
                            0
                          ).toLocaleString()}

                        </div>

                        <div className="coding-acceptance">

                          {problem.acceptanceRate || 0}%

                        </div>

                       <div className="coding-actions">

  <button
    type="button"
    title="View Problem"
    onClick={() =>
      handleViewProblem(problem._id)
    }
  >
    <FaEye />
  </button>

  <button
    type="button"
    title="Edit Problem"
    onClick={() =>
      handleEditProblem(problem._id)
    }
  >
    <FaEdit />
  </button>

  <button
    type="button"
    title="More Actions"
  >
    <FaEllipsisH />
  </button>

</div>

                      </div>

                    )
                  )

                )}

              </div>

              {!codingLoading &&
                codingProblems.length > 0 && (

                  <div className="coding-pagination">

                    <span>
                      Showing{" "}
                      {filteredProblems.length}{" "}
                      of{" "}
                      {codingProblems.length}{" "}
                      problems
                    </span>

                    <div>

                      <button type="button">
                        ‹
                      </button>

                      <button
                        type="button"
                        className="active"
                      >
                        1
                      </button>

                      <button type="button">
                        ›
                      </button>

                    </div>

                  </div>

                )}

            </div>

          </section>

          {/* AI COLUMN */}

          <aside className="coding-ai-column">

            {/* GENERATOR */}

            <div className="coding-ai-card">

              <div className="coding-ai-card-header">

                <FaMagic />

                <div>

                  <h2>
                    Generate Problems with AI
                  </h2>

                  <p>
                    Describe what you want and AI
                    will generate coding problems.
                  </p>

                </div>

              </div>

              <div className="coding-form-group">

                <label>
                  Difficulty
                </label>

                <select
                  value={aiDifficulty}
                  onChange={(e) =>
                    setAiDifficulty(
                      e.target.value
                    )
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

              <div className="coding-form-group">

                <label>
                  Technology / Language
                </label>

                <select
                  value={aiLanguage}
                  onChange={(e) =>
                    setAiLanguage(
                      e.target.value
                    )
                  }
                >

                  <option value="Python">
                    Python
                  </option>

                  <option value="JavaScript">
                    JavaScript
                  </option>

                  <option value="Java">
                    Java
                  </option>

                  <option value="C++">
                    C++
                  </option>

                  <option value="C">
                    C
                  </option>

                </select>

              </div>

              <div className="coding-form-group">

                <label>
                  Subject
                </label>

                <select
                  value={aiTopic}
                  onChange={(e) =>
                    setAiTopic(
                      e.target.value
                    )
                  }
                  disabled={categoriesLoading}
                >

                  <option value="">
                    {categoriesLoading
                      ? "Loading Subjects..."
                      : "Select Subject"}
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

              <div className="coding-form-group">

                <label>
                  Number of Problems
                </label>

                <select
                  value={aiNumber}
                  onChange={(e) =>
                    setAiNumber(
                      e.target.value
                    )
                  }
                >

                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>

                </select>

              </div>

              <div className="coding-form-group">

                <label>
                  Additional Instructions{" "}
                  <span>(Optional)</span>
                </label>

                <textarea
                  value={aiInstructions}
                  onChange={(e) =>
                    setAiInstructions(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Tell AI what kind of problems you want..."
                />

              </div>

              <button
                type="button"
                className="coding-ai-generate-btn"
                onClick={handleGenerate}
                disabled={aiGenerating}
              >

                <FaMagic />

                {aiGenerating
                  ? "Generating..."
                  : "Generate Problems"}

              </button>

            </div>

            {/* AI PREVIEW */}

            <div className="coding-ai-card coding-preview-card">

              <div className="coding-preview-header">

                <div>

                  <FaMagic />

                  <h2>
                    AI Generated Preview
                  </h2>

                </div>

                <span>
                  {aiPreview.length}{" "}
                  {aiPreview.length === 1
                    ? "Problem"
                    : "Problems"}
                </span>

              </div>

              {aiGenerating ? (

                <div className="coding-empty">

                  <FaMagic />

                  <h3>
                    Generating problems...
                  </h3>

                  <p>
                    Gemini is creating coding
                    problems based on your
                    instructions.
                  </p>

                </div>

              ) : aiPreview.length === 0 ? (

                <div className="coding-empty">

                  <FaMagic />

                  <h3>
                    No problems generated yet
                  </h3>

                  <p>
                    Select a subject and generation
                    settings, then generate problems.
                  </p>

                </div>

              ) : (

                <div className="coding-ai-preview-list">

                  {aiPreview.map(
                    (problem, index) => (

                      <div
                        className="coding-ai-preview-item"
                        key={`${problem.title}-${index}`}
                      >

                        <div className="coding-ai-preview-number">
                          {index + 1}
                        </div>

                        <div>

                          <h3>
                            {problem.title}
                          </h3>

                          <p>
                            {problem.description}
                          </p>

                          <span>
                            {problem.difficulty ||
                              aiDifficulty}{" "}
                            •{" "}
                            {problem.languages?.[0] ||
                              aiLanguage}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

              {aiPreview.length > 0 && (

                <button
                  type="button"
                  className="coding-ai-save-btn"
                  onClick={
                    handleSaveGeneratedProblems
                  }
                  disabled={aiSaving}
                >

                  {aiSaving
                    ? "Saving Problems..."
                    : "Save Generated Problems"}

                </button>

              )}

              <p className="coding-ai-warning">

                AI can make mistakes. Please review
                problems before saving.

              </p>

            </div>

          </aside>

        </div>

                </div>

        {/* VIEW / EDIT PROBLEM MODAL */}

        {selectedProblem && problemModalMode && (

          <div
            className="coding-modal-overlay"
            onClick={() => {
              setSelectedProblem(null);
              setProblemModalMode(null);
            }}
          >

            <div
              className="coding-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="coding-modal-header">

                <div>

                  <span>
                    Coding Problem
                  </span>

                  <h2>
                    {problemModalMode === "view"
                      ? "View Problem"
                      : "Edit Problem"}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProblem(null);
                    setProblemModalMode(null);
                  }}
                >
                  ×
                </button>

              </div>


             <div className="coding-modal-body">

  {problemModalMode === "view" ? (

    /* =====================================================
       VIEW MODE
       ===================================================== */

    <>

      {/* TITLE */}

      <div className="coding-view-title-section">

        <span className="coding-view-label">
          Problem Title
        </span>

        <h1>
          {selectedProblem.title}
        </h1>

      </div>


      {/* BASIC INFORMATION */}

      <div className="coding-view-info-grid">

        <div className="coding-view-info-card">

          <span>
            Difficulty
          </span>

          <strong>
            {selectedProblem.difficulty}
          </strong>

        </div>


        <div className="coding-view-info-card">

          <span>
            Language
          </span>

          <strong>
            {selectedProblem.languages?.join(", ") ||
              "Not specified"}
          </strong>

        </div>


        <div className="coding-view-info-card">

          <span>
            Status
          </span>

          <strong>
            {selectedProblem.status}
          </strong>

        </div>


        <div className="coding-view-info-card">

          <span>
            Generated By
          </span>

          <strong>
            {selectedProblem.generatedByAI
              ? "AI"
              : "Admin"}
          </strong>

        </div>

      </div>


      {/* DESCRIPTION */}

      <div className="coding-view-section">

        <h3>
          Description
        </h3>

        <div className="coding-view-content">

          {selectedProblem.description}

        </div>

      </div>


      {/* INPUT FORMAT */}

      <div className="coding-view-section">

        <h3>
          Input Format
        </h3>

        <div className="coding-view-content">

          {selectedProblem.inputFormat ||
            "No input format provided."}

        </div>

      </div>


      {/* OUTPUT FORMAT */}

      <div className="coding-view-section">

        <h3>
          Output Format
        </h3>

        <div className="coding-view-content">

          {selectedProblem.outputFormat ||
            "No output format provided."}

        </div>

      </div>


      {/* CONSTRAINTS */}

      <div className="coding-view-section">

        <h3>
          Constraints
        </h3>

        <div className="coding-view-content">

          {selectedProblem.constraints?.length ? (

            <ul className="coding-view-list">

              {selectedProblem.constraints.map(
                (constraint, index) => (

                  <li key={index}>
                    {constraint}
                  </li>

                )
              )}

            </ul>

          ) : (

            "No constraints provided."

          )}

        </div>

      </div>


      {/* EXAMPLES */}

      {selectedProblem.examples?.length > 0 && (

        <div className="coding-view-section">

          <h3>
            Examples
          </h3>

          <div className="coding-view-examples">

            {selectedProblem.examples.map(
              (example, index) => (

                <div
                  className="coding-view-example"
                  key={index}
                >

                  <div>

                    <span>
                      Input
                    </span>

                    <pre>
                      {example.input}
                    </pre>

                  </div>


                  <div>

                    <span>
                      Output
                    </span>

                    <pre>
                      {example.output}
                    </pre>

                  </div>


                  {example.explanation && (

                    <div>

                      <span>
                        Explanation
                      </span>

                      <p>
                        {example.explanation}
                      </p>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* STARTER CODE */}

      <div className="coding-view-section">

        <h3>
          Starter Code
        </h3>

        <pre className="coding-view-code">

          {typeof selectedProblem.starterCode ===
          "string"
            ? selectedProblem.starterCode
            : JSON.stringify(
                selectedProblem.starterCode,
                null,
                2
              )}

        </pre>

      </div>


      {/* HINTS */}

      {selectedProblem.hints?.length > 0 && (

        <div className="coding-view-section">

          <h3>
            Hints
          </h3>

          <div className="coding-view-content">

            <ul className="coding-view-list">

              {selectedProblem.hints.map(
                (hint, index) => (

                  <li key={index}>
                    {hint}
                  </li>

                )
              )}

            </ul>

          </div>

        </div>

      )}


      {/* COMPLEXITY */}

      <div className="coding-view-info-grid">

        <div className="coding-view-info-card">

          <span>
            Time Complexity
          </span>

          <strong>
            {selectedProblem.timeComplexity ||
              "Not specified"}
          </strong>

        </div>


        <div className="coding-view-info-card">

          <span>
            Space Complexity
          </span>

          <strong>
            {selectedProblem.spaceComplexity ||
              "Not specified"}
          </strong>

        </div>

      </div>

    </>

  ) : (

    /* =====================================================
       EDIT MODE
       ===================================================== */

    <>

      <div className="coding-modal-field">

        <label>
          Title
        </label>

        <input
          type="text"
          value={selectedProblem.title || ""}
          onChange={(e) =>
            setSelectedProblem({
              ...selectedProblem,
              title: e.target.value,
            })
          }
        />

      </div>


      <div className="coding-modal-field">

        <label>
          Description
        </label>

        <textarea
          rows={7}
          value={
            selectedProblem.description || ""
          }
          onChange={(e) =>
            setSelectedProblem({
              ...selectedProblem,
              description: e.target.value,
            })
          }
        />

      </div>


      <div className="coding-modal-two-column">

        <div className="coding-modal-field">

          <label>
            Difficulty
          </label>

          <select
            value={
              selectedProblem.difficulty || ""
            }
            onChange={(e) =>
              setSelectedProblem({
                ...selectedProblem,
                difficulty: e.target.value,
              })
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


        <div className="coding-modal-field">

          <label>
            Language
          </label>

          <input
            type="text"
            value={
              selectedProblem.languages?.join(", ") ||
              ""
            }
            disabled
          />

        </div>

      </div>


      <div className="coding-modal-field">

        <label>
          Input Format
        </label>

        <textarea
          rows={4}
          value={
            selectedProblem.inputFormat || ""
          }
          onChange={(e) =>
            setSelectedProblem({
              ...selectedProblem,
              inputFormat: e.target.value,
            })
          }
        />

      </div>


      <div className="coding-modal-field">

        <label>
          Output Format
        </label>

        <textarea
          rows={4}
          value={
            selectedProblem.outputFormat || ""
          }
          onChange={(e) =>
            setSelectedProblem({
              ...selectedProblem,
              outputFormat: e.target.value,
            })
          }
        />

      </div>


      <div className="coding-modal-field">

        <label>
          Constraints
        </label>

        <textarea
          rows={6}
          value={
            (selectedProblem.constraints || [])
              .join("\n")
          }
          onChange={(e) =>
            setSelectedProblem({
              ...selectedProblem,
              constraints:
                e.target.value
                  .split("\n")
                  .filter(Boolean),
            })
          }
        />

      </div>


      <div className="coding-modal-field">

        <label>
          Starter Code
        </label>

        <textarea
          rows={10}
          value={
            typeof selectedProblem.starterCode ===
            "string"
              ? selectedProblem.starterCode
              : ""
          }
          onChange={(e) =>
            setSelectedProblem({
              ...selectedProblem,
              starterCode: e.target.value,
            })
          }
        />

      </div>


      <div className="coding-modal-field">

        <label>
          Hints
        </label>

        <textarea
          rows={6}
          value={
            (selectedProblem.hints || [])
              .join("\n")
          }
          onChange={(e) =>
            setSelectedProblem({
              ...selectedProblem,
              hints:
                e.target.value
                  .split("\n")
                  .filter(Boolean),
            })
          }
        />

      </div>


      <div className="coding-modal-two-column">

        <div className="coding-modal-field">

          <label>
            Time Complexity
          </label>

          <input
            type="text"
            value={
              selectedProblem.timeComplexity ||
              ""
            }
            onChange={(e) =>
              setSelectedProblem({
                ...selectedProblem,
                timeComplexity:
                  e.target.value,
              })
            }
          />

        </div>


        <div className="coding-modal-field">

          <label>
            Space Complexity
          </label>

          <input
            type="text"
            value={
              selectedProblem.spaceComplexity ||
              ""
            }
            onChange={(e) =>
              setSelectedProblem({
                ...selectedProblem,
                spaceComplexity:
                  e.target.value,
              })
            }
          />

        </div>

      </div>

    </>

  )}

</div>


              {/* EDIT FOOTER */}

              {problemModalMode === "edit" && (

                <div className="coding-modal-footer">

                  <button
                    type="button"
                    className="coding-modal-cancel"
                    onClick={() => {
                      setSelectedProblem(null);
                      setProblemModalMode(null);
                    }}
                  >
                    Cancel
                  </button>


                  <button
                    type="button"
                    className="coding-modal-save"
                    disabled={problemSaving}
                    onClick={async () => {

                      try {

                        setProblemSaving(true);

                        const response =
                          await updateCodingProblem(
                            selectedProblem._id,
                            {
                              title:
                                selectedProblem.title,

                              description:
                                selectedProblem.description,

                              difficulty:
                                selectedProblem.difficulty,

                              inputFormat:
                                selectedProblem.inputFormat,

                              outputFormat:
                                selectedProblem.outputFormat,

                              constraints:
                                selectedProblem.constraints,

                              starterCode:
                                selectedProblem.starterCode,

                              hints:
                                selectedProblem.hints,

                              timeComplexity:
                                selectedProblem.timeComplexity,

                              spaceComplexity:
                                selectedProblem.spaceComplexity,
                            }
                          );

                        setCodingProblems(
                          (current) =>
                            current.map(
                              (item) =>
                                item._id ===
                                response.problem._id
                                  ? response.problem
                                  : item
                            )
                        );

                        alert(
                          "Coding problem updated successfully."
                        );

                        setSelectedProblem(null);
                        setProblemModalMode(null);

                      } catch (error) {

                        console.error(
                          "Failed to update coding problem:",
                          error
                        );

                        alert(
                          error.response?.data?.message ||
                            "Failed to update coding problem."
                        );

                      } finally {

                        setProblemSaving(false);

                      }

                    }}
                  >
                    {problemSaving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              )}

            </div>

          </div>

        )}

    

    </AdminLayout>

  );
};

export default Coding;