import styles from "./UpcomingInterviews.module.css";

const interviews = [
  {
    title: "HR Interview",
    date: "30 June 2026",
    time: "10:00 AM",
  },
  {
    title: "React Technical",
    date: "02 July 2026",
    time: "02:30 PM",
  },
];

const UpcomingInterviews = () => {
  return (
    <div className={styles.card}>
      <h2>Upcoming Interviews</h2>

      {interviews.map((item, index) => (
        <div className={styles.item} key={index}>
          <div>
            <h4>{item.title}</h4>
            <p>{item.date}</p>
          </div>

          <span>{item.time}</span>
        </div>
      ))}
    </div>
  );
};

export default UpcomingInterviews;