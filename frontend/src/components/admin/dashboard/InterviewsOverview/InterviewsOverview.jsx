import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import styles from "./InterviewsOverview.module.css";

const STATUS_COLORS = {
  Evaluated: "#16a34a",
  Completed: "#3b82f6",
  "In Progress": "#f97316",
};

const Donut = ({ segments, total }) => {
  const size = 150;
  const stroke = 20;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={styles.donut}>
      {total === 0 ? (
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef0f4" strokeWidth={stroke} />
      ) : (
        segments.map((seg) => {
          const fraction = seg.count / total;
          const dash = fraction * circumference;
          const offset = circumference * (1 - cumulative);
          cumulative += fraction;

          return (
            <circle
              key={seg.status}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={STATUS_COLORS[seg.status] || "#94a3b8"}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })
      )}
    </svg>
  );
};

const InterviewsOverview = ({ data }) => {
  const navigate = useNavigate();

  const total = data?.total ?? 0;
  const segments = data?.statusBreakdown ?? [];
  const deltaPercent = data?.deltaPercent ?? 0;
  const isUp = deltaPercent >= 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Interviews Overview</h2>
        <button type="button" onClick={() => navigate("/admin/users")}>
          View All
        </button>
      </div>

      {total === 0 ? (
        <p className={styles.empty}>No interviews have been taken yet.</p>
      ) : (
        <>
          <div className={styles.body}>
            <div className={styles.donutWrap}>
              <Donut segments={segments} total={total} />
              <div className={styles.donutCenter}>
                <strong>{total.toLocaleString()}</strong>
                <span>Total Interviews</span>
              </div>
            </div>

            <div className={styles.legend}>
              {segments.map((seg) => (
                <div className={styles.legendRow} key={seg.status}>
                  <i className={styles.dot} style={{ background: STATUS_COLORS[seg.status] || "#94a3b8" }} />
                  <span>{seg.status}</span>
                  <strong>
                    {seg.count.toLocaleString()} ({seg.percent}%)
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <p className={isUp ? `${styles.delta} ${styles.up}` : `${styles.delta} ${styles.down}`}>
            {isUp ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(deltaPercent)}% {isUp ? "more" : "fewer"} than last week
          </p>
        </>
      )}
    </div>
  );
};

export default InterviewsOverview;
