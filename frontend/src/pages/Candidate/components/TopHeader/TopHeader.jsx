import {
  FaBell,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";

import "./TopHeader.css";

const TopHeader = ({ user }) => {
  const firstName = user?.fullName?.split(" ")[0] || "there";
  const displayName = user?.fullName || "Candidate";

  return (
    <header className="top-header">

      <div className="header-left">

        <h1>
          Welcome back,
          <span> {firstName} 👋</span>
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

          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={displayName}
            />
          ) : (
            <div className="profile-box-initial">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>

            <h4>{displayName}</h4>

            <span>Candidate</span>

          </div>

          <FaChevronDown />

        </div>

      </div>

    </header>
  );
};

export default TopHeader;
