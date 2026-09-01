import { NavLink, useNavigate } from "react-router-dom";

import {
  HiOutlineHome,
  HiOutlineSparkles,
  HiOutlineCodeBracket,
  HiOutlineListBullet,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineClipboardDocumentCheck,
  HiOutlineArrowLeftOnRectangle,
} from "react-icons/hi2";

import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "nav-item active"
      : "nav-item";

  return (
    <aside className="candidate-sidebar">

      {/* Logo */}
      <div className="sidebar-logo">

        <div className="logo-mark">
          ✦
        </div>

        <div className="logo-text">
          <h2>Interview</h2>
          <h3>Ace</h3>
          <span>
            AI Interview Platform
          </span>
        </div>

      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <NavLink
          to="/candidate/dashboard"
          className={linkClass}
        >
          <HiOutlineHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/candidate/interviews"
          className={linkClass}
        >
          <HiOutlineSparkles />
          <span>AI Interviews</span>
        </NavLink>

        <NavLink
          to="/candidate/coding"
          className={linkClass}
        >
          <HiOutlineCodeBracket />
          <span>Coding Practice</span>
        </NavLink>

        <NavLink
          to="/candidate/mcq"
          className={linkClass}
        >
          <HiOutlineListBullet />
          <span>MCQ Practice</span>
        </NavLink>

        <NavLink
          to="/candidate/resume"
          className={linkClass}
        >
          <HiOutlineDocumentText />
          <span>Resume Review</span>
        </NavLink>

        <NavLink
          to="/candidate/performance"
          className={linkClass}
        >
          <HiOutlineChartBar />
          <span>Performance</span>
        </NavLink>

        <NavLink
          to="/candidate/results"
          className={linkClass}
        >
          <HiOutlineClipboardDocumentCheck />
          <span>Results</span>
        </NavLink>

        <NavLink
          to="/candidate/profile"
          className={linkClass}
        >
          <HiOutlineUser />
          <span>Profile</span>
        </NavLink>

      </nav>

      <div className="sidebar-spacer"></div>

      {/* Logout */}
      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        <HiOutlineArrowLeftOnRectangle />
        <span>Logout</span>
      </button>

    </aside>
  );
};

export default Sidebar;