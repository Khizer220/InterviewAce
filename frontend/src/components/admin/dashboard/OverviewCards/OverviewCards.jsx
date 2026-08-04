import {
  FaFolder,
  FaQuestionCircle,
  FaUsers,
  FaBriefcase,
  FaArrowUp,
} from "react-icons/fa";

import styles from "./OverviewCards.module.css";

const cards = [
  {
    title: "Categories",
    value: 8,
    growth: "+2 this week",
    icon: <FaFolder />,
    color: "#6C4CF1",
  },
  {
    title: "Questions",
    value: 120,
    growth: "+15 this week",
    icon: <FaQuestionCircle />,
    color: "#10B981",
  },
  {
    title: "Users",
    value: 45,
    growth: "+8 this week",
    icon: <FaUsers />,
    color: "#F97316",
  },
  {
    title: "Interviews",
    value: 12,
    growth: "+3 this week",
    icon: <FaBriefcase />,
    color: "#3B82F6",
  },
];

const OverviewCards = () => {
  return (
    <div className={styles.grid}>
      {cards.map((card, index) => (
        <div className={styles.card} key={index}>
          <div
            className={styles.icon}
            style={{ background: card.color }}
          >
            {card.icon}
          </div>

          <div className={styles.content}>
            <p>{card.title}</p>

            <h2>{card.value}</h2>

            <span>
              {card.growth}
              <FaArrowUp />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;