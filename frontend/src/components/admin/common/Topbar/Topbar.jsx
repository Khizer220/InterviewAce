import {
  FaBell,
  FaCog,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";

import styles from "./Topbar.module.css";

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className={styles.topbar}>
      <div className={styles.searchBox}>
        <FaSearch />

        <input
          type="text"
          placeholder="Search anything..."
        />
      </div>

      <div className={styles.right}>
        <button className={styles.iconButton}>
          <FaBell />
          <span className={styles.badge}>3</span>
        </button>

        <button className={styles.iconButton}>
          <FaCog />
        </button>

        <div className={styles.profile}>
          <div className={styles.avatar}>
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>

          <div className={styles.userInfo}>
            <h4>{user?.fullName}</h4>
            <span>Administrator</span>
          </div>

          <FaChevronDown className={styles.arrow} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;