import styles from "./AISuggestions.module.css";

const AISuggestions = () => {
  return (
    <div className={styles.card}>
      <h2>AI Suggestions</h2>

      <ul>
        <li>Improve JavaScript fundamentals.</li>
        <li>Practice HR communication questions.</li>
        <li>Complete 2 coding challenges today.</li>
        <li>Upload your latest resume.</li>
      </ul>
    </div>
  );
};

export default AISuggestions;