import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserTie,
  FaCode,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        Interview<span>Ace</span>
      </div>

      <nav className={styles.menu}>
        <NavLink
          to="/candidate/dashboard"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/candidate/interviews" className={styles.link}>
          <FaUserTie />
          <span>Mock Interviews</span>
        </NavLink>

        <NavLink to="/candidate/coding" className={styles.link}>
          <FaCode />
          <span>Coding Practice</span>
        </NavLink>

        <NavLink to="/candidate/resume" className={styles.link}>
          <FaFileAlt />
          <span>Resume Analyzer</span>
        </NavLink>

        <NavLink to="/candidate/reports" className={styles.link}>
          <FaChartBar />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/candidate/settings" className={styles.link}>
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </nav>

      <button className={styles.logout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;