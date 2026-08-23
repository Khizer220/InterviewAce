import { useNavigate } from "react-router-dom";

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
    path: "/admin/categories",
  },
  {
    title: "Add Question",
    subtitle: "Manage question bank",
    icon: <FaQuestionCircle />,
    color: "#3B82F6",
    path: "/admin/questions",
  },
  {
    title: "Add User",
    subtitle: "Register new users",
    icon: <FaUserPlus />,
    color: "#10B981",
    // Candidates self-register and admins approve them (see Pending
    // Users) — there's no direct "admin creates a candidate" flow in
    // authController.js, so this points at approvals rather than a
    // create form that doesn't exist yet. Swap this path if that's wrong.
    path: "/admin/pending-users",
  },
  {
    title: "Create Interview",
    subtitle: "Schedule AI interviews",
    icon: <FaRobot />,
    color: "#F97316",
    path: "/admin/ai-interviews",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2>Quick Actions</h2>

      <div className={styles.grid}>
        {actions.map((action) => (
          <div
            key={action.title}
            className={styles.card}
            role="button"
            tabIndex={0}
            onClick={() => navigate(action.path)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(action.path);
              }
            }}
          >
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
