import { useMemo, useState, useEffect, useCallback } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaChartLine,
  FaSearch,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
} from "react-icons/fa";

import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";
import {
  getUsers,
  deleteUser,
  getPendingUsers,
  updateUserStack,
  getCandidateInterviews,
} from "../../../services/adminService";

import "./Users.css";

// Common stack options an admin can quickly toggle on a candidate.
// Anything outside this list can still be added as a custom tag below.
const STACK_SUGGESTIONS = [
  "C", "C++", "Java", "Python", "JavaScript", "TypeScript",
  "React", "Node.js", "Express", "MongoDB", "SQL",
  "DBMS", "Data Structures", "Operating Systems", "System Design",
];

// Small decorative sparkline used on the stat cards.
// Purely visual — takes a handful of points and draws a line through them.
const Sparkline = ({ points, color }) => {
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * 100} ${40 - p * 40}`)
    .join(" ");

  return (
    <svg className="stat-sparkline" viewBox="0 0 100 40" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ONLINE_WINDOW_MS = 5 * 60 * 1000;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [stack, setStack] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Accordion (View button) state — which row is open, its fetched
  // interview history (cached per user id once loaded), and load state.
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [interviewDataById, setInterviewDataById] = useState({});
  const [loadingInterviewsId, setLoadingInterviewsId] = useState(null);
  const [interviewFetchError, setInterviewFetchError] = useState(null);

  // Stack editor (lives inside the expanded row panel)
  const [stackDraft, setStackDraft] = useState([]);
  const [customStackInput, setCustomStackInput] = useState("");
  const [savingStack, setSavingStack] = useState(false);
  const [stackError, setStackError] = useState(null);

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersData, pendingData] = await Promise.all([
        getUsers(),
        getPendingUsers(),
      ]);

      setUsers(usersData?.users || []);
      setPendingCount(pendingData?.count || 0);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Couldn't load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${user.fullName}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    // Optimistic-ish delete: only remove locally after the API confirms it.
    try {
      await deleteUser(user._id);

      setUsers((prevUsers) => prevUsers.filter((item) => item._id !== user._id));

      if (expandedUserId === user._id) {
        setExpandedUserId(null);
      }
    } catch (err) {
      console.error("Delete User Error:", err);
      alert(err?.response?.data?.message || "Failed to remove user.");
    }
  };

  // ==========================================
  // STACK OPTIONS
  // ==========================================

  const stackOptions = useMemo(() => {
    const stacks = new Set();

    users.forEach((user) => {
      if (Array.isArray(user.stack)) {
        user.stack.forEach((item) => {
          if (item) stacks.add(item);
        });
      }
    });

    return Array.from(stacks).sort();
  }, [users]);

  // ==========================================
  // ONLINE HELPER (single source of truth so the
  // stat card + row indicator can never disagree)
  // ==========================================

  const isUserOnline = useCallback((user) => {
    if (!user.lastActive) return false;
    return Date.now() - new Date(user.lastActive).getTime() <= ONLINE_WINDOW_MS;
  }, []);

  // ==========================================
  // PROGRESS
  // Backed by real InterviewAttempt data. adminController.getUsers sends:
  // user.progress = { interviewsAttempted, interviewsCompleted,
  // questionsAnswered, avgScore }. avgScore is null (not 0) when the
  // candidate has no "Evaluated" attempts yet.
  // ==========================================

  const getProgress = (user) => {
    const score = user.progress?.avgScore;
    if (typeof score !== "number") return null;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  // ==========================================
  // FILTER + SORT
  // ==========================================

  const visibleUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const filtered = users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.fullName?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue);

      const matchesStatus =
        status === "all" ||
        (status === "active" && user.isActive) ||
        (status === "inactive" && !user.isActive);

      const matchesStack = stack === "all" || user.stack?.includes(stack);

      return matchesSearch && matchesStatus && matchesStack;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.fullName || "").localeCompare(b.fullName || "");
        case "progress":
          return (getProgress(b) ?? -1) - (getProgress(a) ?? -1);
        case "recent":
        default: {
          const aTime = a.lastActive ? new Date(a.lastActive).getTime() : 0;
          const bTime = b.lastActive ? new Date(b.lastActive).getTime() : 0;
          return bTime - aTime;
        }
      }
    });

    return sorted;
  }, [users, search, status, stack, sortBy]);

  // ==========================================
  // STATS
  // ==========================================

  const onlineCount = useMemo(
    () => users.filter(isUserOnline).length,
    [users, isUserOnline]
  );

  const avgProgress = useMemo(() => {
    const withProgress = users
      .map((user) => getProgress(user))
      .filter((value) => value !== null);

    if (withProgress.length === 0) return null;

    const total = withProgress.reduce((sum, value) => sum + value, 0);
    return Math.round(total / withProgress.length);
  }, [users]);

  // ==========================================
  // EXPORT
  // ==========================================

  const handleExport = () => {
    if (visibleUsers.length === 0) return;

    const header = ["Name", "Email", "Stack", "Progress", "Last Active", "Status"];

    const rows = visibleUsers.map((user) => [
      user.fullName || "",
      user.email || "",
      (user.stack || []).join("; "),
      getProgress(user) ?? "",
      user.lastActive ? new Date(user.lastActive).toISOString() : "Never",
      user.isActive ? "Active" : "Inactive",
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "U";

  const getLastActive = (user) => {
    if (!user.lastActive) return "Never";
    return new Date(user.lastActive).toLocaleString();
  };

  // ==========================================
  // ACCORDION (View button)
  // ==========================================

  const toggleExpand = async (user) => {
    // Clicking the already-open row's View button collapses it.
    if (expandedUserId === user._id) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(user._id);
    setStackDraft(user.stack || []);
    setCustomStackInput("");
    setStackError(null);
    setInterviewFetchError(null);

    // Lazy-fetch once per candidate, cache after that — reopening the
    // same row doesn't refetch.
    if (!interviewDataById[user._id]) {
      try {
        setLoadingInterviewsId(user._id);
        const result = await getCandidateInterviews(user._id);
        setInterviewDataById((prev) => ({ ...prev, [user._id]: result }));
      } catch (err) {
        console.error("Get Candidate Interviews Error:", err);
        setInterviewFetchError(
          err?.response?.data?.message || "Failed to load interview history."
        );
      } finally {
        setLoadingInterviewsId(null);
      }
    }
  };

  // ==========================================
  // STACK EDITOR
  // ==========================================

  const toggleStackChip = (item) => {
    setStackDraft((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const addCustomStack = () => {
    const value = customStackInput.trim();
    if (!value) return;

    setStackDraft((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setCustomStackInput("");
  };

  const removeStackChip = (item) => {
    setStackDraft((prev) => prev.filter((s) => s !== item));
  };

  const handleSaveStack = async (userId) => {
    try {
      setSavingStack(true);
      setStackError(null);

      const result = await updateUserStack(userId, stackDraft);
      const savedStack = result?.stack ?? stackDraft;

      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, stack: savedStack } : u)));
    } catch (err) {
      console.error("Update Stack Error:", err);
      setStackError(err?.response?.data?.message || "Failed to update stack.");
    } finally {
      setSavingStack(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <AdminLayout>
      <div className="users-page">
        {/* HEADER */}
        <div className="users-header">
          <div className="users-header-left">
            <span className="users-badge">User Management</span>
            <h1>Users</h1>
            <p>Manage candidates and track their interview preparation progress.</p>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="users-stats">
          <div className="users-stat-card">
            <div className="stat-card-top">
              <div className="users-stat-icon purple">
                <FaUsers />
              </div>
              <Sparkline points={[0.3, 0.5, 0.4, 0.7, 0.6, 0.9]} color="#6546ef" />
            </div>
            <div className="stat-card-body">
              <strong>{users.length}</strong>
              <span className="users-stat-label">Total Users</span>
              <p className="users-stat-caption">All approved candidates</p>
            </div>
          </div>

          <div className="users-stat-card">
            <div className="stat-card-top">
              <div className="users-stat-icon green">
                <FaUserCheck />
              </div>
              <Sparkline points={[0.5, 0.3, 0.6, 0.4, 0.7, 0.5]} color="#16a34a" />
            </div>
            <div className="stat-card-body">
              <strong>{onlineCount}</strong>
              <span className="users-stat-label">Online Now</span>
              <p className="users-stat-caption">Currently active users</p>
            </div>
          </div>

          <div className="users-stat-card">
            <div className="stat-card-top">
              <div className="users-stat-icon orange">
                <FaUserClock />
              </div>
              <Sparkline points={[0.6, 0.5, 0.4, 0.5, 0.3, 0.4]} color="#e58a00" />
            </div>
            <div className="stat-card-body">
              <strong>{pendingCount}</strong>
              <span className="users-stat-label">Pending Approval</span>
              <p className="users-stat-caption">Awaiting review</p>
            </div>
          </div>

          <div className="users-stat-card">
            <div className="stat-card-top">
              <div className="users-stat-icon blue">
                <FaChartLine />
              </div>
              <Sparkline points={[0.4, 0.5, 0.6, 0.55, 0.7, 0.8]} color="#2563eb" />
            </div>
            <div className="stat-card-body">
              <strong>{avgProgress === null ? "—" : `${avgProgress}%`}</strong>
              <span className="users-stat-label">Avg Progress</span>
              <p className="users-stat-caption">Average candidate progress</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="users-content">
          {/* TOOLBAR */}
          <div className="users-toolbar">
            <div className="users-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="users-filters">
              <div className="users-select">
                <select value={stack} onChange={(e) => setStack(e.target.value)}>
                  <option value="all">All Stacks</option>
                  {stackOptions.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <FaChevronDown />
              </div>

              <div className="users-select">
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <FaChevronDown />
              </div>

              <div className="users-select">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="recent">Sort by: Recently Active</option>
                  <option value="name">Sort by: Name (A-Z)</option>
                  <option value="progress">Sort by: Progress</option>
                </select>
                <FaChevronDown />
              </div>

              <button type="button" className="users-export-btn" onClick={handleExport}>
                <FaDownload />
                Export
              </button>
            </div>
          </div>

          {/* TABLE HEADER */}
          <div className="users-table-header">
            <div>STUDENT</div>
            <div>TECHNOLOGY STACK</div>
            <div>PROGRESS</div>
            <div>LAST ACTIVE</div>
            <div>STATUS</div>
            <div>ACTION</div>
          </div>

          {/* LOADING / ERROR / EMPTY / USERS */}
          {loading ? (
            <div className="users-state">Loading users...</div>
          ) : error ? (
            <div className="users-state">
              <FaUsers />
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          ) : visibleUsers.length === 0 ? (
            <div className="users-state">
              <FaUsers />
              <h3>No users found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          ) : (
            <div className="users-list">
              {visibleUsers.map((user) => {
                const progress = getProgress(user);
                const online = isUserOnline(user);
                const isExpanded = expandedUserId === user._id;
                const interviewData = interviewDataById[user._id];
                const isLoadingInterviews = loadingInterviewsId === user._id;

                return (
                  <div className="user-row-group" key={user._id}>
                    <div className="user-row">
                      {/* STUDENT */}
                      <div className="student-cell">
                        <div className="student-avatar">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.fullName} />
                          ) : (
                            getInitial(user.fullName)
                          )}
                        </div>
                        <div className="student-info">
                          <h3>{user.fullName}</h3>
                          <p>{user.email}</p>
                        </div>
                      </div>

                      {/* TECHNOLOGY STACK */}
                      <div className="stack-cell">
                        {user.stack && user.stack.length > 0 ? (
                          <div className="stack-list">
                            {user.stack.slice(0, 3).map((item) => (
                              <span className="stack-tag" key={`${user._id}-${item}`}>
                                {item}
                              </span>
                            ))}
                            {user.stack.length > 3 && (
                              <span className="stack-more">+{user.stack.length - 3}</span>
                            )}
                          </div>
                        ) : (
                          <span className="no-stack">Not assigned</span>
                        )}
                      </div>

                      {/* PROGRESS */}
                      <div className="progress-cell">
                        {progress === null ? (
                          <div className="progress-empty">
                            <span>Not started</span>
                          </div>
                        ) : (
                          <>
                            <div className="progress-top">
                              <span>Progress</span>
                              <strong>{progress}%</strong>
                            </div>
                            <div className="progress-track">
                              <div className="progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="progress-meta">
                              {user.progress.interviewsCompleted} of {user.progress.interviewsAttempted}{" "}
                              interviews · {user.progress.questionsAnswered} questions
                            </p>
                          </>
                        )}
                      </div>

                      {/* LAST ACTIVE */}
                      <div className="last-active">
                        {online && <span className="online-dot" />}
                        <span>{online ? "Online" : getLastActive(user)}</span>
                      </div>

                      {/* STATUS */}
                      <div>
                        <span className={user.isActive ? "account-status active" : "account-status inactive"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* ACTION */}
                      <div className="row-actions">
                        <button
                          type="button"
                          className="view-user-btn"
                          onClick={() => toggleExpand(user)}
                        >
                          <FaEye />
                          {isExpanded ? "Hide" : "View"}
                          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <button type="button" className="remove-user-btn" onClick={() => handleDeleteUser(user)}>
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED PANEL — interview history + category breakdown */}
                    {isExpanded && (
                      <div className="user-expand-panel">
                        {isLoadingInterviews ? (
                          <div className="expand-loading">Loading interview history...</div>
                        ) : interviewFetchError ? (
                          <div className="expand-error">{interviewFetchError}</div>
                        ) : (
                          <div className="expand-columns">
                            {/* INTERVIEW HISTORY */}
                            <div className="expand-summary">
                              <h4>Interview Activity</h4>

                              {interviewData && interviewData.totalAttempts > 0 ? (
                                <>
                                  <p className="expand-total">
                                    {interviewData.totalAttempts}{" "}
                                    interview{interviewData.totalAttempts === 1 ? "" : "s"} attended
                                  </p>

                                  <div className="category-breakdown">
                                    {interviewData.categoryBreakdown.map((cat) => (
                                      <div className="category-row" key={cat.category}>
                                        <span className="category-name">{cat.category}</span>
                                        <span className="category-count">
                                          {cat.attempts} attempt{cat.attempts === 1 ? "" : "s"}
                                        </span>
                                        <span className="category-score">
                                          {cat.avgScore === null ? "—" : `${cat.avgScore}%`}
                                        </span>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="attempts-list">
                                    {interviewData.attempts.map((attempt) => (
                                      <div className="attempt-row" key={attempt._id}>
                                        <div className="attempt-main">
                                          <span className="attempt-title">{attempt.title}</span>
                                          <span className="attempt-category">{attempt.category}</span>
                                        </div>
                                        <span
                                          className={`attempt-status status-${attempt.status
                                            .toLowerCase()
                                            .replace(" ", "-")}`}
                                        >
                                          {attempt.status}
                                        </span>
                                        <span className="attempt-score">
                                          {attempt.percentage === null ? "—" : `${attempt.percentage}%`}
                                        </span>
                                        <span className="attempt-date">
                                          {attempt.submittedAt
                                            ? new Date(attempt.submittedAt).toLocaleDateString()
                                            : "—"}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <p className="expand-empty">No interviews attempted yet.</p>
                              )}
                            </div>

                            {/* STACK EDITOR */}
                            <div className="expand-stack-editor">
                              <h4>Technology Stack</h4>

                              {stackDraft.length > 0 && (
                                <div className="stack-editor-selected">
                                  {stackDraft.map((item) => (
                                    <span className="stack-editor-chip selected" key={item}>
                                      {item}
                                      <button
                                        type="button"
                                        onClick={() => removeStackChip(item)}
                                        aria-label={`Remove ${item}`}
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="stack-editor-suggestions">
                                {STACK_SUGGESTIONS.filter((item) => !stackDraft.includes(item)).map((item) => (
                                  <button
                                    type="button"
                                    key={item}
                                    className="stack-editor-chip"
                                    onClick={() => toggleStackChip(item)}
                                  >
                                    + {item}
                                  </button>
                                ))}
                              </div>

                              <div className="stack-editor-custom">
                                <input
                                  type="text"
                                  placeholder="Add a custom skill..."
                                  value={customStackInput}
                                  onChange={(e) => setCustomStackInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addCustomStack();
                                    }
                                  }}
                                />
                                <button type="button" onClick={addCustomStack}>
                                  Add
                                </button>
                              </div>

                              {stackError && <p className="stack-editor-error">{stackError}</p>}

                              <button
                                type="button"
                                className="stack-editor-save"
                                onClick={() => handleSaveStack(user._id)}
                                disabled={savingStack}
                              >
                                {savingStack ? "Saving..." : "Save Stack"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Users;
