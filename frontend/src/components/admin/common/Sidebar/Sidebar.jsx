import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaFolderOpen,
  FaQuestionCircle,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaCode,
  FaRobot,
  FaFileAlt,
  FaUserClock,
} from "react-icons/fa";

import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("user") || "null");
  const adminName = admin?.fullName || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>

      {/* =========================
          Logo
      ========================= */}

      <div className={styles.logo}>

        <div className={styles.logoMark}>
          IA
        </div>

        <div>
          <h2>InterviewAce</h2>
          <p>Admin Panel</p>
        </div>

      </div>

      {/* =========================
          Main
      ========================= */}

      <div className={styles.sectionTitle}>
        MAIN
      </div>

      <nav className={styles.menu}>

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
        >
          <FaFolderOpen />
          <span>Categories</span>
        </NavLink>

        <NavLink
          to="/admin/questions"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
        >
          <FaQuestionCircle />
          <span>Questions</span>
        </NavLink>

      </nav>

      {/* =========================
          Management
      ========================= */}

      <div className={styles.sectionTitle}>
        MANAGEMENT
      </div>

      <nav className={styles.menu}>

        {/* Users */}

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
        >
          <FaUsers />
          <span>Users</span>
        </NavLink>

        {/* Pending Users */}

        <NavLink
          to="/admin/pending-users"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
        >
          <FaUserClock />
          <span>Pending Users</span>

          <span className={styles.pendingBadge}>
            Pending
          </span>

        </NavLink>

        {/* Analytics */}

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
        >
          <FaChartBar />
          <span>Analytics</span>
        </NavLink>

        {/* Coding */}

        <NavLink
          to="/admin/coding"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
        >
          <FaCode />
          <span>Coding</span>
        </NavLink>

        {/* Mock Interviews */}

        <NavLink
          to="/admin/ai-interviews"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
        >
          <FaRobot />
          <span>Mock Interviews</span>
        </NavLink>

        {/* Resume Reviews */}

        <NavLink
          to="/admin/resumes"
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
        >
          <FaFileAlt />
          <span>Resume Reviews</span>
        </NavLink>

      </nav>

      {/* =========================
          Bottom
      ========================= */}

      <div className={styles.bottom}>

        <div className={styles.profile}>

          <div className={styles.avatar}>
            {adminInitial}
          </div>

          <div>
            <h4>{adminName}</h4>
            <p>Administrator</p>
          </div>

        </div>

        <button
          className={styles.logout}
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
