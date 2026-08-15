import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import "./AIInterviews.css";

import StatisticsCards from "./components/StatisticsCards";
import FilterBar from "./components/FilterBar";
import InterviewCard from "./InterviewCard";
import InterviewModal from "./components/InterviewModal/InterviewModal";
import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";
import InterviewPreview from "./components/InterviewPreview/InterviewPreview";

const API = "http://localhost:5000/api";

/*
  Same technology images used by Candidate Mock Interviews.
  These files are inside /public/icons/
*/
const getTechnologyIcon = (interview) => {
  const title = (interview?.title || "").toLowerCase().trim();

  // Data Structures
  if (
    title.includes("data structure") ||
    title.includes("data structures") ||
    title.includes("dsa")
  ) {
    return "/icons/datastructure.png";
  }

  // DBMS / Database
  if (
    title.includes("dbms") ||
    title.includes("database")
  ) {
    return "/icons/dbms.png";
  }

  // MySQL
  if (title.includes("mysql")) {
    return "/icons/mysql.png";
  }

  // JavaScript
  if (title.includes("javascript")) {
    return "/icons/javascript.png";
  }

  // Node.js
  if (
    title.includes("node") ||
    title.includes("nodejs")
  ) {
    return "/icons/nodejs.png";
  }

  // Python
  if (title.includes("python")) {
    return "/icons/python.png";
  }

  // React
  if (title.includes("react")) {
    return "/icons/react.png";
  }

  // HTML
  if (title.includes("html")) {
    return "/icons/html.png";
  }

  // CSS
  if (title.includes("css")) {
    return "/icons/css.png";
  }

  // PHP
  if (title.includes("php")) {
    return "/icons/php.png";
  }

  // Java
  if (title.includes("java")) {
    return "/icons/java.png";
  }

  // Default
  return "/icons/react.png";
};

const AIInterviews = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");

  const [showModal, setShowModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [showPreview, setShowPreview] = useState(false);
  const [previewInterview, setPreviewInterview] = useState(null);

  // =========================
  // FETCH TEMPLATES
  // =========================

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(
        `${API}/interview-templates`
      );

      setTemplates(res.data.templates || []);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API}/categories`
      );

      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await Promise.all([
        fetchTemplates(),
        fetchCategories(),
      ]);

      setLoading(false);
    };

    load();
  }, []);

  // =========================
  // CREATE
  // =========================

  const handleCreate = () => {
    setSelectedInterview(null);
    setShowModal(true);
  };

  // =========================
  // EDIT
  // =========================

const handleEdit = (interview) => {
  setSelectedInterview(interview);
  setShowModal(true);
};

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setShowModal(false);
    setSelectedInterview(null);
  };

  // =========================
  // SUCCESS
  // =========================

  const handleSuccess = () => {
    closeModal();
    fetchTemplates();
  };

  // =========================
  // PREVIEW
  // =========================

  const handlePreview = (interview) => {
  console.log("PREVIEW CLICKED:", interview);
  

  setPreviewInterview(interview);
  setShowPreview(true);
};

  const closePreview = () => {
    setPreviewInterview(null);
    setShowPreview(false);
  };

  // =========================
  // STATISTICS
  // =========================

  const stats = useMemo(() => {
    return {
      total: templates.length,

      active: templates.filter(
        (t) => t.status
      ).length,

      inactive: templates.filter(
        (t) => !t.status
      ).length,

      categories: categories.length,

      questions: templates.reduce(
        (sum, t) =>
          sum + (t.questions?.length || 0),
        0
      ),
    };
  }, [templates, categories]);

  // =========================
  // FILTERING
  // =========================

  const filteredTemplates = useMemo(() => {
    let data = [...templates];

    if (search) {
      data = data.filter((t) =>
        t.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (category) {
      data = data.filter(
        (t) =>
          t.category?._id === category
      );
    }

    if (type) {
      data = data.filter(
        (t) =>
          t.interviewType === type
      );
    }

    if (difficulty) {
      data = data.filter(
        (t) =>
          t.difficulty === difficulty
      );
    }

    if (status) {
      data = data.filter((t) =>
        status === "active"
          ? t.status
          : !t.status
      );
    }

    if (sort === "title") {
      data.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sort === "oldest") {
      data.reverse();
    }

    return data;
  }, [
    templates,
    search,
    category,
    type,
    difficulty,
    status,
    sort,
  ]);

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this interview template?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `${API}/interview-templates/${id}`
      );

      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================

  const handleToggle = async (item) => {
    try {
      await axios.patch(
        `${API}/interview-templates/${item._id}/status`
      );

      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // DUPLICATE
  // =========================

  const handleDuplicate = async (item) => {
    try {
      await axios.post(
        `${API}/interview-templates/${item._id}/duplicate`
      );

      fetchTemplates();
    } catch (err) {
      console.error(err);

      alert(
        "Failed to duplicate interview template."
      );
    }
  };

return (
  <AdminLayout>

    <div className="ai-interviews-page">

      {/* HEADER */}
    <div className="ai-interviews-header">
  <div className="ai-interviews-title">
    <h1>AI Interview Templates</h1>
    <p>Create and manage interview templates.</p>
  </div>

  <button
    type="button"
    className="create-btn"
    onClick={handleCreate}
  >
    + Create Interview
  </button>
</div>

      {/* STATISTICS */}
      <StatisticsCards stats={stats} />

      {/* FILTERS */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        type={type}
        setType={setType}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
        categories={categories}
      />

      {/* CONTENT */}
      {loading ? (
        <div className="ai-interviews-state">
          Loading...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="ai-interviews-state empty">
          <h3>No Interview Templates</h3>

          <p>
            Click "Create Interview" to create your first template.
          </p>
        </div>
      ) : (
        <div className="ai-template-grid">
          {filteredTemplates.map((item) => (
           <InterviewCard
  key={item._id}
  interview={item}
  technologyIcon={getTechnologyIcon(item)}
  onDelete={() => handleDelete(item._id)}
  onToggleStatus={() => handleToggle(item)}
  onEdit={() => handleEdit(item)}
  onPreview={() => handlePreview(item)}
  onDuplicate={() => handleDuplicate(item)}
/>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <InterviewModal
  isOpen={showModal}
  interview={selectedInterview}
  onClose={closeModal}
  onSuccess={handleSuccess}
/>

      {/* PREVIEW MODAL */}
      {showPreview && previewInterview && (
        <InterviewPreview
          interview={previewInterview}
          onClose={closePreview}
        />
      )}

    </div>

  </AdminLayout>
);
};

export default AIInterviews;
