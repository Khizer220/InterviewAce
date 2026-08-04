import styles from "./DashboardHeader.module.css";

const DashboardHeader = () => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.header}>
      <div>
        <h1>Welcome back, Admin! 👋</h1>
        <p>Here's what's happening with InterviewAce today.</p>
      </div>

      <div className={styles.date}>
        📅 {today}
      </div>
    </div>
  );
};

export default DashboardHeader;