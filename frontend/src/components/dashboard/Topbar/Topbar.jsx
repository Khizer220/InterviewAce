import { FaBell, FaMoon, FaSearch } from "react-icons/fa";
import styles from "./Topbar.module.css";

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className={styles.topbar}>
      <div>
        <h2>Dashboard</h2>
        <p>{today}</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        <button className={styles.iconButton}>
          <FaMoon />
        </button>

        <button className={styles.iconButton}>
          <FaBell />
        </button>

        <div className={styles.profile}>
          <div className={styles.avatar}>
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h4>{user?.fullName}</h4>
            <span>Candidate</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;