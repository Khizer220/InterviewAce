import {
  HiOutlineHome,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineBookmark,
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
} from "react-icons/hi2";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="candidate-sidebar">

      {/* Logo */}
      <div className="sidebar-logo">

        <div className="logo-mark">
          ✦
        </div>

        <div className="logo-text">
          <h2>
            Interview<span style={{ color: "#6D5DFC" }}>Ace</span>
          </h2>

          <span>AI Interview Platform</span>
        </div>

      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <button className="nav-item active">
          <HiOutlineHome />
          <span>Dashboard</span>
        </button>

        <button className="nav-item">
          <HiOutlineSparkles />
          <span>AI Interviews</span>
        </button>

        <button className="nav-item">
          <HiOutlineClock />
          <span>Interview History</span>
        </button>

        <button className="nav-item">
          <HiOutlineBookmark />
          <span>Bookmarks</span>
        </button>

        <button className="nav-item">
          <HiOutlineDocumentText />
          <span>Reports</span>
        </button>

        <button className="nav-item">
          <HiOutlineAcademicCap />
          <span>Improve Skills</span>
        </button>

        <button className="nav-item">
          <HiOutlineChartBar />
          <span>Progress</span>
        </button>

        <button className="nav-item">
          <HiOutlineUser />
          <span>Profile</span>
        </button>

        <button className="nav-item">
          <HiOutlineCog6Tooth />
          <span>Settings</span>
        </button>

      </nav>

      <div className="sidebar-spacer"></div>

      {/* Logout */}
      <button className="logout-btn">
        <HiOutlineArrowLeftOnRectangle />
        <span>Logout</span>
      </button>

    </aside>
  );
};

export default Sidebar;