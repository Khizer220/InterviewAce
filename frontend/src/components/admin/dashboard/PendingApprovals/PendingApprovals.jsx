import { useNavigate } from "react-router-dom";
import { FaUserClock, FaChevronRight } from "react-icons/fa";

import styles from "./PendingApprovals.module.css";

const PendingApprovals = ({ users = [], count = 0 }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Pending Approvals</h2>
          {count > 0 && <span className={styles.countBadge}>{count}</span>}
        </div>
      </div>

      {users.length === 0 ? (
        <p className={styles.empty}>No candidates waiting for approval.</p>
      ) : (
        <div className={styles.row}>
          {users.slice(0, 6).map((user) => (
            <div className={styles.card} key={user._id}>
              <div className={styles.avatar}>
                {user.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className={styles.info}>
                <h4>{user.fullName}</h4>
                <p>{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className={styles.reviewBtn}
        onClick={() => navigate("/admin/pending-users")}
      >
        <FaUserClock />
        Review Pending Candidates
        <FaChevronRight />
      </button>
    </div>
  );
};

export default PendingApprovals;
