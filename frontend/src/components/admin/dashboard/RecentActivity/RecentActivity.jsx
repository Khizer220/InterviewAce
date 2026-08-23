import { useState } from "react";
import {
  FaFolderOpen,
  FaQuestionCircle,
  FaUserPlus,
  FaRobot,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import styles from "./RecentActivity.module.css";

const ICONS_BY_TYPE = {
  category: { icon: <FaFolderOpen />, color: "#6C4CF1" },
  question: { icon: <FaQuestionCircle />, color: "#3B82F6" },
  user: { icon: <FaUserPlus />, color: "#10B981" },
  interview: { icon: <FaRobot />, color: "#F97316" },
};

const COLLAPSED_COUNT = 5;

const timeAgo = (timestamp) => {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const RecentActivity = ({ items = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, COLLAPSED_COUNT);
  const hasMore = items.length > COLLAPSED_COUNT;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Recent Activity</h2>
      </div>

      <div
        className={styles.list}
        style={
          expanded
            ? { maxHeight: "420px", overflowY: "auto", paddingRight: "6px" }
            : undefined
        }
      >
        {visibleItems.length === 0 ? (
          <p>No activity yet.</p>
        ) : (
          visibleItems.map((item, index) => {
            const meta = ICONS_BY_TYPE[item.type] || ICONS_BY_TYPE.category;

            return (
              <div key={index} className={styles.item}>
                <div className={styles.icon} style={{ background: meta.color }}>
                  {meta.icon}
                </div>

                <div className={styles.info}>
                  <h4>{item.message}</h4>
                  <p>
                    By <strong>{item.actor}</strong>
                  </p>
                </div>

                <span>{timeAgo(item.timestamp)}</span>
              </div>
            );
          })
        )}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            marginTop: "14px",
            width: "100%",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            border: "1px solid #e2e8f0",
            borderRadius: "9px",
            background: "#f8fafc",
            color: "#6546ef",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {expanded ? (
            <>
              Show Less <FaChevronUp />
            </>
          ) : (
            <>
              View More ({items.length - COLLAPSED_COUNT} more) <FaChevronDown />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default RecentActivity;
