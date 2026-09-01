import { useEffect, useState } from "react";
import axios from "axios";

import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineShieldCheck,
  HiOutlineCalendarDays,
  HiOutlinePencilSquare,
  HiOutlineCheck,
  HiOutlineXMark,
} from "react-icons/hi2";

import Sidebar from "../components/Sidebar/Sidebar";

import "./Profile.css";

const API = "http://localhost:5000/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // ==========================================
  // LOAD AUTHENTICATED USER
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          `${API}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const loggedInUser = response.data.user;

        setUser(loggedInUser);

        setFormData({
          name: loggedInUser.fullName || "",
          email: loggedInUser.email || "",
        });

        // Keep localStorage synchronized
        localStorage.setItem(
          "user",
          JSON.stringify(loggedInUser)
        );

      } catch (error) {
        console.error(
          "Load Profile Error:",
          error
        );

        // Fallback to stored user
        try {
          const storedUser = JSON.parse(
            localStorage.getItem("user")
          );

          if (storedUser) {
            setUser(storedUser);

            setFormData({
              name:
                storedUser.fullName ||
                storedUser.name ||
                "",
              email: storedUser.email || "",
            });
          }
        } catch (fallbackError) {
          console.error(
            "Failed to load stored user:",
            fallbackError
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="candidate-layout">
        <Sidebar />

        <main className="profile-main">
          <div className="profile-loading">
            Loading profile...
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // NO USER
  // ==========================================

  if (!user) {
    return (
      <div className="candidate-layout">
        <Sidebar />

        <main className="profile-main">
          <div className="profile-loading">
            Unable to load profile.
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // USER DATA
  // ==========================================

  const displayName =
    user.fullName ||
    user.name ||
    user.username ||
    "Candidate";

  const email =
    user.email || "No email available";

  const role =
    user.role || "candidate";

  const accountId =
    user._id ||
    user.id ||
    "Not available";

  // ==========================================
  // INITIALS
  // ==========================================

  const getInitials = (name) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    setFormData({
      name: user.fullName || user.name || "",
      email: user.email || "",
    });

    setEditing(false);
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSave = () => {
    const updatedUser = {
      ...user,
      fullName: formData.name,
      email: formData.email,
    };

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setEditing(false);
  };

  return (
    <div className="candidate-layout">

      {/* ======================================
          CANDIDATE SIDEBAR
      ====================================== */}

      <Sidebar />

      {/* ======================================
          PROFILE CONTENT
      ====================================== */}

      <main className="profile-main">

        {/* Header */}

        <div className="profile-header">

          <div>
            <span className="profile-badge">
              Profile
            </span>

            <h1>Your Profile</h1>

            <p>
              Manage your account information and
              personal details.
            </p>
          </div>

          {!editing && (
            <button
              className="edit-profile-btn"
              onClick={() => setEditing(true)}
            >
              <HiOutlinePencilSquare />
              Edit Profile
            </button>
          )}

        </div>

        {/* ======================================
            PROFILE CARD
        ====================================== */}

        <div className="profile-card">

          {/* Profile Hero */}

          <div className="profile-hero">

            <div className="profile-avatar">
              {getInitials(displayName)}
            </div>

            <div className="profile-identity">

              <h2>{displayName}</h2>

              <p>{email}</p>

              <span className="profile-role">
                {role}
              </span>

            </div>

          </div>

          {/* ====================================
              PERSONAL INFORMATION
          ==================================== */}

          <div className="profile-section">

            <div className="section-heading">

              <div>
                <h3>
                  Personal Information
                </h3>

                <p>
                  Your basic account information.
                </p>
              </div>

            </div>

            <div className="profile-fields">

              {/* Full Name */}

              <div className="profile-field">

                <label>
                  <HiOutlineUser />
                  Full Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="field-value">
                    {displayName}
                  </div>
                )}

              </div>

              {/* Email */}

              <div className="profile-field">

                <label>
                  <HiOutlineEnvelope />
                  Email Address
                </label>

                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="field-value">
                    {email}
                  </div>
                )}

              </div>

              {/* Account Type */}

              <div className="profile-field">

                <label>
                  <HiOutlineShieldCheck />
                  Account Type
                </label>

                <div className="field-value">

                  <span className="account-type">
                    {role}
                  </span>

                </div>

              </div>

              {/* Account ID */}

              <div className="profile-field">

                <label>
                  <HiOutlineCalendarDays />
                  Account ID
                </label>

                <div className="field-value account-id">
                  {accountId}
                </div>

              </div>

            </div>

          </div>

          {/* ====================================
              EDIT ACTIONS
          ==================================== */}

          {editing && (
            <div className="profile-actions">

              <button
                className="cancel-profile-btn"
                onClick={handleCancel}
              >
                <HiOutlineXMark />
                Cancel
              </button>

              <button
                className="save-profile-btn"
                onClick={handleSave}
              >
                <HiOutlineCheck />
                Save Changes
              </button>

            </div>
          )}

        </div>

        {/* ======================================
            ACCOUNT STATUS
        ====================================== */}

        <div className="account-status-card">

          <div className="status-icon">
            <HiOutlineShieldCheck />
          </div>

          <div className="status-content">

            <h3>
              Account Status
            </h3>

            <p>
              Your InterviewAce candidate account
              is active and ready for interviews.
            </p>

          </div>

          <span className="active-status">
            {user.isActive === false
              ? "Inactive"
              : "Active"}
          </span>

        </div>

      </main>

    </div>
  );
};

export default Profile;