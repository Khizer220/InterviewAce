import { useEffect, useState } from "react";
import {
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineClock,
  HiOutlineEnvelope,
} from "react-icons/hi2";

import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../../../services/adminService";

import "./PendingUsers.css";

const PendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);

      const data = await getPendingUsers();

      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch pending users:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load pending users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);

      await approveUser(id);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );

      alert("Candidate approved successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to approve candidate."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this candidate?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);

      await rejectUser(id);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );

      alert("Candidate rejected successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to reject candidate."
      );
    } finally {
      setActionLoading(null);
    }
  };

 return (
  <div className="pending-page">

    {/* ================= HEADER ================= */}

    <div className="pending-header">

      <div className="pending-header-left">

        <span className="pending-badge">
          User Management
        </span>

        <h1 className="pending-title">
          Pending Candidates
        </h1>

        <p className="pending-description">
          Review and approve candidates before they
          can access InterviewAce.
        </p>

      </div>

      <div className="pending-count">

        <div className="pending-count-icon">
          <HiOutlineClock />
        </div>

        <div className="pending-count-content">
          <span className="pending-count-number">
            {users.length}
          </span>

          <span className="pending-count-label">
            Pending Candidates
          </span>
        </div>

      </div>

    </div>


    {/* ================= CONTENT ================= */}

    <div className="pending-content">

      {/* TABLE HEADER */}

      {!loading && users.length > 0 && (
        <div className="pending-list-header">

          <div className="pending-list-title">
            <h2>Pending Users</h2>

            <span>
              {users.length} users awaiting approval
            </span>
          </div>

          <div className="pending-list-status">
            <span className="pending-list-dot"></span>
            Awaiting Review
          </div>

        </div>
      )}


      {loading ? (

        <div className="pending-loading">
          <HiOutlineClock />
          Loading pending candidates...
        </div>

      ) : users.length === 0 ? (

        <div className="pending-empty">

          <div className="pending-empty-icon">
            <HiOutlineCheck />
          </div>

          <h3>
            All caught up!
          </h3>

          <p>
            There are no candidates waiting for approval.
          </p>

        </div>

      ) : (

        <div className="pending-user-list">

          {users.map((user) => (

            <div
              className="pending-user"
              key={user._id}
            >

              {/* USER */}

              <div className="user-info">

                <div className="user-avatar">
                  {user.fullName
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div className="user-details">

                  <h3 className="user-name">
                    {user.fullName}
                  </h3>

                  <p className="user-email">
                    <HiOutlineEnvelope />
                    {user.email}
                  </p>

                </div>

              </div>


              {/* DATE */}

              <div className="registered-info">

                <span className="registered-label">
                  Registered
                </span>

                <strong className="registered-date">
                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}
                </strong>

              </div>


              {/* STATUS */}

              <div className="pending-status-wrapper">

                <span className="status-badge">

                  <span className="status-dot"></span>

                  Pending

                </span>

              </div>


              {/* ACTIONS */}

              <div className="user-actions">

                <button
                  type="button"
                  className="approve-btn"
                  disabled={
                    actionLoading === user._id
                  }
                  onClick={() =>
                    handleApprove(user._id)
                  }
                >

                  <HiOutlineCheck />

                  {actionLoading === user._id
                    ? "Processing..."
                    : "Approve"}

                </button>


                <button
                  type="button"
                  className="reject-btn"
                  disabled={
                    actionLoading === user._id
                  }
                  onClick={() =>
                    handleReject(user._id)
                  }
                >

                  <HiOutlineXMark />

                  Reject

                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  </div>
);
};

export default PendingUsers;