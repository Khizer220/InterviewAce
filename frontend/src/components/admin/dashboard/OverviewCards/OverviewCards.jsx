import {
  FaFolder,
  FaQuestionCircle,
  FaUsers,
  FaBriefcase,
  FaArrowUp,
} from "react-icons/fa";

import styles from "./OverviewCards.module.css";

const CARD_META = [
  { key: "categories", title: "Categories", icon: <FaFolder />, color: "#6C4CF1" },
  { key: "questions", title: "Questions", icon: <FaQuestionCircle />, color: "#10B981" },
  { key: "users", title: "Users", icon: <FaUsers />, color: "#F97316" },
  { key: "interviews", title: "Interviews", icon: <FaBriefcase />, color: "#3B82F6" },
];

const OverviewCards = ({ overview }) => {
  return (
    <div className={styles.grid}>
      {CARD_META.map((meta) => {
        const data = overview?.[meta.key];
        const value = data?.value ?? 0;
        const weekCount = data?.weekCount ?? 0;

        return (
          <div className={styles.card} key={meta.key}>
            <div className={styles.icon} style={{ background: meta.color }}>
              {meta.icon}
            </div>

            <div className={styles.content}>
              <p>{meta.title}</p>

              <h2>{value}</h2>

              {weekCount > 0 ? (
                <span>
                  +{weekCount} this week
                  <FaArrowUp />
                </span>
              ) : (
                <span>No change this week</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;
