import {
  FaBook,
  FaClock,
  FaLayerGroup,
  FaArrowRight,
} from "react-icons/fa";

import "./InterviewCard.css";

const InterviewCard = ({
  interview,
  onStart,
}) => {
  return (
    <div className="candidate-interview-card">

      <div className="candidate-card-top">

        <div className="candidate-logo">

          💼

        </div>

        <div>

          <h3>{interview.title}</h3>

          <p>
            {interview.description}
          </p>

        </div>

      </div>

      <div className="candidate-tags">

        <span>

          <FaBook />

          {interview.category?.name}

        </span>

        <span>

          <FaLayerGroup />

          {interview.difficulty}

        </span>

        <span>

          <FaClock />

          {interview.duration} min

        </span>

      </div>

      <button
        className="candidate-start-btn"
        onClick={onStart}
      >
        Start Interview

        <FaArrowRight />

      </button>

    </div>
  );
};

export default InterviewCard;