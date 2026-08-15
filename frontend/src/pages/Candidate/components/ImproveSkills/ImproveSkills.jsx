import { FaChevronRight } from "react-icons/fa";
import {
  FaCode,
  FaUserTie,
  FaComments,
  FaDatabase,
} from "react-icons/fa";

import "./ImproveSkills.css";

const suggestions = [
  {
    icon: <FaCode />,
    title: "Improve Data Structures & Algorithms",
  },
  {
    icon: <FaUserTie />,
    title: "Practice Behavioral Questions",
  },
  {
    icon: <FaComments />,
    title: "Enhance Communication Skills",
  },
  {
    icon: <FaDatabase />,
    title: "Review DBMS & SQL Concepts",
  },
];

const ImproveSkills = () => {
  return (
    <section className="improve-card">

      <span className="improve-badge">
        Enhance Yourself
      </span>

      <h2>
        Improve Your Skills
      </h2>

      <p className="improve-subtitle">
        Personalized suggestions generated from your
        recent interview performance.
      </p>

      <div className="improve-list">

        {suggestions.map((item, index) => (

          <div
            className="improve-item"
            key={index}
          >

            <div className="improve-left">

              <div className="improve-icon">

                {item.icon}

              </div>

              <span>

                {item.title}

              </span>

            </div>

            <FaChevronRight className="improve-arrow" />

          </div>

        ))}

      </div>

    </section>
  );
};

export default ImproveSkills;