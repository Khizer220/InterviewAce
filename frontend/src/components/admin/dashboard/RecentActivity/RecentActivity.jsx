import {
  FaFolderOpen,
  FaQuestionCircle,
  FaUserPlus,
  FaRobot,
} from "react-icons/fa";

import styles from "./RecentActivity.module.css";

const activities = [
  {
    title: "React Category Added",
    user: "Admin",
    time: "2 min ago",
    icon: <FaFolderOpen />,
    color: "#6C4CF1",
  },
  {
    title: "Java Questions Updated",
    user: "Admin",
    time: "15 min ago",
    icon: <FaQuestionCircle />,
    color: "#3B82F6",
  },
  {
    title: "New User Registered",
    user: "System",
    time: "30 min ago",
    icon: <FaUserPlus />,
    color: "#10B981",
  },
  {
    title: "AI Interview Completed",
    user: "Interview Engine",
    time: "1 hour ago",
    icon: <FaRobot />,
    color: "#F97316",
  },
];

const RecentActivity = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Recent Activity</h2>
        <button>View All</button>
      </div>

      <div className={styles.list}>
        {activities.map((item, index) => (
          <div key={index} className={styles.item}>
            <div
              className={styles.icon}
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <div className={styles.info}>
              <h4>{item.title}</h4>

              <p>
                By <strong>{item.user}</strong>
              </p>
            </div>

            <span>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;