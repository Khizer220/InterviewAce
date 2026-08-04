import {
  FaFolderPlus,
  FaQuestionCircle,
  FaUserPlus,
  FaRobot,
} from "react-icons/fa";

import styles from "./QuickActions.module.css";

const actions = [
  {
    title: "Add Category",
    subtitle: "Create interview categories",
    icon: <FaFolderPlus />,
    color: "#6C4CF1",
  },
  {
    title: "Add Question",
    subtitle: "Manage question bank",
    icon: <FaQuestionCircle />,
    color: "#3B82F6",
  },
  {
    title: "Add User",
    subtitle: "Register new users",
    icon: <FaUserPlus />,
    color: "#10B981",
  },
  {
    title: "Create Interview",
    subtitle: "Schedule AI interviews",
    icon: <FaRobot />,
    color: "#F97316",
  },
];

const QuickActions = () => {
  return (
    <div className={styles.container}>
      <h2>Quick Actions</h2>

      <div className={styles.grid}>
        {actions.map((action, index) => (
          <div key={index} className={styles.card}>
            <div
              className={styles.icon}
              style={{ background: action.color }}
            >
              {action.icon}
            </div>

            <h3>{action.title}</h3>

            <p>{action.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;