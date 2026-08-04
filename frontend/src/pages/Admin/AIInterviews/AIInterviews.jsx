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

  // Fetch Templates
  const fetchTemplates = async () => {
    try {
      const res = await axios.get(
        `${API}/interview-templates`
      );

      setTemplates(res.data.templates || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API}/categories`
      );

      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

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
  const handleCreate = () => {
  setSelectedInterview(null);
  setShowModal(true);
};

const handleEdit = (interview) => {
  setSelectedInterview(interview);
  setShowModal(true);
};

const closeModal = () => {
  setShowModal(false);
  setSelectedInterview(null);
};

const handleSuccess = () => {
  closeModal();
  fetchTemplates();
};

const handlePreview = async (interview) => {
  try {
    const res = await axios.get(
      `${API}/interview-templates/${interview._id}`
    );

    setPreviewInterview(res.data.template);
    setShowPreview(true);

  } catch (err) {
    console.error(err);
    alert("Failed to load interview preview.");
  }
};

const closePreview = () => {
  setPreviewInterview(null);
  setShowPreview(false);
};
  // Statistics
  const stats = useMemo(() => {
    return {
      total: templates.length,
      active: templates.filter((t) => t.status).length,
      inactive: templates.filter((t) => !t.status).length,
      categories: categories.length,
      questions: templates.reduce(
        (sum, t) => sum + (t.questions?.length || 0),
        0
      ),
    };
  }, [templates, categories]);

  // Filtering
  const filteredTemplates = useMemo(() => {
    let data = [...templates];

    if (search) {
      data = data.filter((t) =>
        t.title
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (category) {
      data = data.filter(
        (t) => t.category?._id === category
      );
    }

    if (type) {
      data = data.filter(
        (t) => t.interviewType === type
      );
    }

    if (difficulty) {
      data = data.filter(
        (t) => t.difficulty === difficulty
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

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this interview template?"
      )
    )
      return;

    try {
      await axios.delete(
        `${API}/interview-templates/${id}`
      );

      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleDuplicate = async (item) => {
  try {
    await axios.post(
      `${API}/interview-templates/${item._id}/duplicate`
    );

    fetchTemplates();
  } catch (err) {
    console.error(err);
    alert("Failed to duplicate interview template.");
  }
};

return (
  <AdminLayout>
    <div className="ai-interviews-page">
      <div className="page-header">
        <div>
          <h1>AI Interview Templates</h1>
          <p>
            Create and manage interview
            templates.
          </p>
        </div>

        <button
  className="create-btn"
  onClick={handleCreate}
>
  + Create Interview
</button>
      </div>

      <StatisticsCards stats={stats} />

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

      {loading ? (
        <h3>Loading...</h3>
      ) : filteredTemplates.length === 0 ? (
        <div className="empty-state">
          <h2>No Interview Templates</h2>
          <p>
            Click "Create Interview" to
            create your first template.
          </p>
        </div>
      ) : (
        <div className="interview-grid">
          {filteredTemplates.map((item) => (
 <InterviewCard
  key={item._id}
  interview={item}
  onDelete={() => handleDelete(item._id)}
  onToggleStatus={() => handleToggle(item)}
  onEdit={() => handleEdit(item)}
  onPreview={() => handlePreview(item)}
  onDuplicate={() => handleDuplicate(item)}
/>
          ))}
        </div>
      )}
            <InterviewModal
        isOpen={showModal}
        onClose={closeModal}
        onSuccess={handleSuccess}
        interview={selectedInterview}
      />

      <InterviewPreview
  isOpen={showPreview}
  interview={previewInterview}
  onClose={closePreview}
/>
      </div>
  </AdminLayout>
);
};

export default AIInterviews;