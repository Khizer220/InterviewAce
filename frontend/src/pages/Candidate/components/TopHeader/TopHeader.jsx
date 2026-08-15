import {
  FaBell,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";

import "./TopHeader.css";

const TopHeader = () => {
  return (
    <header className="top-header">

      <div className="header-left">

        <h1>
          Welcome back,
          <span> Khizer 👋</span>
        </h1>

        <p>
          Ready for your next AI interview?
        </p>

      </div>

      <div className="header-right">

        <div className="search-box">
          <FaSearch />
          <input
            placeholder="Search interviews..."
          />
        </div>

        <button className="notification-btn">
          <FaBell />
          <span className="notification-dot" />
        </button>

        <div className="profile-box">

          <img
            src="https://i.pravatar.cc/150?img=12"
            alt=""
          />

          <div>

            <h4>Khizer</h4>

            <span>Candidate</span>

          </div>

          <FaChevronDown />

        </div>

      </div>

    </header>
  );
};

export default TopHeader;