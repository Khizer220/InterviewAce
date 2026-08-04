import { NavLink } from "react-router-dom";
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
} from "react-icons/fa";

import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>IA</div>

        <div>
          <h2>InterviewAce</h2>
          <p>Admin Panel</p>
        </div>
      </div>

      {/* Main */}
      <div className={styles.sectionTitle}>
        MAIN
      </div>

      <nav className={styles.menu}>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <FaFolderOpen />
          <span>Categories</span>
        </NavLink>

        <NavLink
          to="/admin/questions"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <FaQuestionCircle />
          <span>Questions</span>
        </NavLink>
      </nav>

      {/* Management */}
      <div className={styles.sectionTitle}>
        MANAGEMENT
      </div>

      <nav className={styles.menu}>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <FaUsers />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <FaChartBar />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/admin/coding"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <FaCode />
          <span>Coding</span>
        </NavLink>

        <NavLink
         to="/admin/ai-interviews"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <FaRobot />
          <span>Mock Interviews</span>
        </NavLink>

        <NavLink
          to="/admin/resumes"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <FaFileAlt />
          <span>Resume Reviews</span>
        </NavLink>
      </nav>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.profile}>
          <div className={styles.avatar}>N</div>

          <div>
            <h4>Nagu</h4>
            <p>Administrator</p>
          </div>
        </div>

        <button className={styles.logout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;