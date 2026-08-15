import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaSearch,
  FaEye,
  FaChevronDown,
} from "react-icons/fa";

import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";
import {
  getUsers,
   deleteUser,
  getPendingUsers,
} from "../../../services/adminService";

import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [stack, setStack] = useState("all");

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const [usersData, pendingData] = await Promise.all([
        getUsers(),
        getPendingUsers(),
      ]);

      setUsers(usersData.users || []);
      setPendingCount(pendingData.count || 0);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (user) => {
  const confirmed = window.confirm(
    `Are you sure you want to remove ${user.fullName}? This action cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteUser(user._id);

    setUsers((prevUsers) =>
      prevUsers.filter(
        (item) => item._id !== user._id
      )
    );

    alert("User removed successfully.");
  } catch (error) {
    console.error("Delete User Error:", error);

    alert(
      error.response?.data?.message ||
        "Failed to remove user."
    );
  }
};

  // ==========================================
  // STACK OPTIONS
  // ==========================================

  const stackOptions = useMemo(() => {
    const stacks = [];

    users.forEach((user) => {
      if (Array.isArray(user.stack)) {
        user.stack.forEach((item) => {
          if (item && !stacks.includes(item)) {
            stacks.push(item);
          }
        });
      }
    });

    return stacks.sort();
  }, [users]);

  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.fullName
          ?.toLowerCase()
          .includes(searchValue) ||
        user.email
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "all" ||
        (status === "active" && user.isActive) ||
        (status === "inactive" && !user.isActive);

      const matchesStack =
        stack === "all" ||
        user.stack?.includes(stack);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesStack
      );
    });
  }, [users, search, status, stack]);

  // ==========================================
  // ONLINE COUNT
  // ==========================================

  const onlineUsers = users.filter((user) => {
    if (!user.lastActive) {
      return false;
    }

    const lastActiveTime =
      new Date(user.lastActive).getTime();

    const fiveMinutes = 5 * 60 * 1000;

    return (
      Date.now() - lastActiveTime <= fiveMinutes
    );
  }).length;

  // ==========================================
  // HELPERS
  // ==========================================

  const getInitial = (name) => {
    return (
      name?.charAt(0)?.toUpperCase() || "U"
    );
  };

  const getProgress = () => {
    // Progress will be connected later
    // to interviews / coding / questions.
    return null;
  };

  const getLastActive = (user) => {
    if (!user.lastActive) {
      return "Never";
    }

    const date = new Date(user.lastActive);

    return date.toLocaleString();
  };

  // ==========================================
  // VIEW PROFILE
  // ==========================================

  const handleViewProfile = (user) => {
    console.log("VIEW CLICKED:", user);
    setSelectedUser(user);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <AdminLayout>
      <div className="users-page">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="users-header">
          <div className="users-header-left">

            <span className="users-badge">
              User Management
            </span>

            <h1>Users</h1>

            <p>
              Manage candidates and track their
              interview preparation progress.
            </p>

          </div>
        </div>

        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="users-stats">

          {/* TOTAL USERS */}

          <div className="users-stat-card">
            <div className="users-stat-icon purple">
              <FaUsers />
            </div>

            <div>
              <span className="users-stat-label">
                Total Users
              </span>

              <strong>
                {users.length}
              </strong>
            </div>
          </div>

          {/* ONLINE USERS */}

          <div className="users-stat-card">
            <div className="users-stat-icon green">
              <FaUserCheck />
            </div>

            <div>
              <span className="users-stat-label">
                Online Now
              </span>

              <strong>
                {onlineUsers}
              </strong>
            </div>
          </div>

          {/* PENDING */}

          <div className="users-stat-card">
            <div className="users-stat-icon orange">
              <FaUserClock />
            </div>

            <div>
              <span className="users-stat-label">
                Pending Approval
              </span>

              <strong>
                {pendingCount}
              </strong>
            </div>
          </div>

          {/* ACTIVE */}

          <div className="users-stat-card">
            <div className="users-stat-icon blue">
              <FaUserCheck />
            </div>

            <div>
              <span className="users-stat-label">
                Active Accounts
              </span>

              <strong>
                {
                  users.filter(
                    (user) => user.isActive
                  ).length
                }
              </strong>
            </div>
          </div>

        </div>

        {/* =====================================
            USERS CONTENT
        ===================================== */}

        <div className="users-content">

          {/* TOOLBAR */}

          <div className="users-toolbar">

            {/* SEARCH */}

            <div className="users-search">
              <FaSearch />

              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="users-filters">

              {/* STATUS */}

              <div className="users-select">

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="all">
                    All Status
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>

                <FaChevronDown />

              </div>

              {/* STACK */}

              <div className="users-select">

                <select
                  value={stack}
                  onChange={(e) =>
                    setStack(e.target.value)
                  }
                >
                  <option value="all">
                    All Stacks
                  </option>

                  {stackOptions.map((item) => (
                    <option
                      value={item}
                      key={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>

                <FaChevronDown />

              </div>

            </div>
          </div>

          {/* =====================================
              TABLE HEADER
          ===================================== */}

          <div className="users-table-header">

            <div>STUDENT</div>

            <div>TECHNOLOGY STACK</div>

            <div>PROGRESS</div>

            <div>LAST ACTIVE</div>

            <div>STATUS</div>

            <div>ACTION</div>

          </div>

          {/* =====================================
              LOADING / EMPTY / USERS
          ===================================== */}

          {loading ? (
            <div className="users-state">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="users-state">

              <FaUsers />

              <h3>
                No users found
              </h3>

              <p>
                Try changing your search or filters.
              </p>

            </div>
          ) : (
            <div className="users-list">

              {filteredUsers.map((user) => {

                const progress =
                  getProgress(user);

                const isOnline =
                  user.lastActive &&
                  Date.now() -
                    new Date(
                      user.lastActive
                    ).getTime() <=
                    5 * 60 * 1000;

                return (
                  <div
                    className="user-row"
                    key={user._id}
                  >

                    {/* =================================
                        STUDENT
                    ================================= */}

                    <div className="student-cell">

                      <div className="student-avatar">

                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.fullName}
                          />
                        ) : (
                          getInitial(
                            user.fullName
                          )
                        )}

                      </div>

                      <div className="student-info">

                        <h3>
                          {user.fullName}
                        </h3>

                        <p>
                          {user.email}
                        </p>

                      </div>

                    </div>

                    {/* =================================
                        TECHNOLOGY STACK
                    ================================= */}

                    <div className="stack-cell">

                      {user.stack &&
                      user.stack.length > 0 ? (

                        <div className="stack-list">

                          {user.stack
                            .slice(0, 3)
                            .map((item) => (
                              <span
                                className="stack-tag"
                                key={item}
                              >
                                {item}
                              </span>
                            ))}

                          {user.stack.length > 3 && (
                            <span className="stack-more">
                              +
                              {user.stack.length - 3}
                            </span>
                          )}

                        </div>

                      ) : (
                        <span className="no-stack">
                          Not assigned
                        </span>
                      )}

                    </div>

                    {/* =================================
                        PROGRESS
                    ================================= */}

                    <div className="progress-cell">

                      {progress === null ? (

                        <div className="progress-empty">
                          <span>
                            Not started
                          </span>
                        </div>

                      ) : (
                        <>
                          <div className="progress-top">

                            <span>
                              Progress
                            </span>

                            <strong>
                              {progress}%
                            </strong>

                          </div>

                          <div className="progress-track">

                            <div
                              className="progress-fill"
                              style={{
                                width: `${progress}%`,
                              }}
                            />

                          </div>
                        </>
                      )}

                    </div>

                    {/* =================================
                        LAST ACTIVE
                    ================================= */}

                    <div className="last-active">

                      {isOnline && (
                        <span className="online-dot" />
                      )}

                      <span>
                        {isOnline
                          ? "Online"
                          : getLastActive(user)}
                      </span>

                    </div>

                    {/* =================================
                        STATUS
                    ================================= */}

                    <div>

                      <span
                        className={
                          user.isActive
                            ? "account-status active"
                            : "account-status inactive"
                        }
                      >
                        {user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    {/* =================================
                        ACTION
                    ================================= */}

                    <div>

                      <button
                        type="button"
                        className="view-user-btn"
                        onClick={() =>
                          handleViewProfile(user)
                        }
                      >
                        <FaEye />
                        View
                      </button>

                      <button
  type="button"
  className="remove-user-btn"
  onClick={() => handleDeleteUser(user)}
>
  Remove
</button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>

      {/* ==========================================
          USER DETAILS MODAL
      ========================================== */}

      {selectedUser && (
        <div
          className="user-modal-overlay"
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="user-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="user-modal-header">

              <div>

                <span className="user-modal-badge">
                  Candidate Profile
                </span>

                <h2>
                  {selectedUser.fullName}
                </h2>

                <p>
                  {selectedUser.email}
                </p>

              </div>

              <button
                type="button"
                className="user-modal-close"
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="user-modal-body">

              {/* ACCOUNT STATUS */}

              <div className="user-detail">

                <span>
                  Account Status
                </span>

                <strong
                  className={
                    selectedUser.isActive
                      ? "modal-active"
                      : "modal-inactive"
                  }
                >
                  {selectedUser.isActive
                    ? "Active"
                    : "Inactive"}
                </strong>

              </div>

              {/* APPROVAL */}

              <div className="user-detail">

                <span>
                  Approval Status
                </span>

                <strong>
                  {selectedUser.isApproved
                    ? "Approved"
                    : "Pending"}
                </strong>

              </div>

              {/* STACK */}

              <div className="user-detail">

                <span>
                  Technology Stack
                </span>

                <strong>
                  {selectedUser.stack?.length
                    ? selectedUser.stack.join(", ")
                    : "Not assigned"}
                </strong>

              </div>

              {/* REGISTERED */}

              <div className="user-detail">

                <span>
                  Registered
                </span>

                <strong>
                  {selectedUser.createdAt
                    ? new Date(
                        selectedUser.createdAt
                      ).toLocaleDateString()
                    : "Unknown"}
                </strong>

              </div>

              {/* LAST LOGIN */}

              <div className="user-detail">

                <span>
                  Last Login
                </span>

                <strong>
                  {selectedUser.lastLogin
                    ? new Date(
                        selectedUser.lastLogin
                      ).toLocaleString()
                    : "Never"}
                </strong>

              </div>

              {/* LAST ACTIVE */}

              <div className="user-detail">

                <span>
                  Last Active
                </span>

                <strong>
                  {selectedUser.lastActive
                    ? new Date(
                        selectedUser.lastActive
                      ).toLocaleString()
                    : "Never"}
                </strong>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="user-modal-footer">

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </AdminLayout>
  );
};

export default Users;