import {
  FaArrowRight,
  FaClock,
  FaQuestionCircle,
  FaRobot,
} from "react-icons/fa";

import "./InterviewCard.css";

const icons = {
  HTML: "/icons/html.png",
  CSS: "/icons/css.png",
  JavaScript: "/icons/javascript.png",
  React: "/icons/react.png",
  Python: "/icons/python.png",
  Java: "/icons/java.png",
  "Node.js": "/icons/nodejs.png",
};

const difficultyColor = {
  Beginner: "green",
  Intermediate: "orange",
  Advanced: "red",
};

const InterviewCard = ({
  interview,
  onStart,
}) => {

  const category = interview.category?.name || "General";

const title = interview.title.toLowerCase();
const categoryName = category.toLowerCase();

let icon = "💼";

if (title.includes("html") || categoryName.includes("html"))
  icon = "/icons/html.png";

else if (title.includes("css") || categoryName.includes("css"))
  icon = "/icons/css.png";

else if (title.includes("python") || categoryName.includes("python"))
  icon = "/icons/python.png";

else if (
  (title.includes("java") && !title.includes("javascript")) ||
  (categoryName.includes("java") &&
    !categoryName.includes("javascript"))
)
  icon = "/icons/java.png";

else if (
  title.includes("javascript") ||
  categoryName.includes("javascript")
)
  icon = "/icons/javascript.png";

else if (
  title.includes("react") ||
  categoryName.includes("react")
)
  icon = "/icons/react.png";

else if (
  title.includes("node") ||
  categoryName.includes("node")
)
  icon = "/icons/nodejs.png";

  return (

    <div className="interview-card">

      <div className="card-ai">

        <FaRobot />

        AI

      </div>

      <div className="card-icon">

        {typeof icon === "string" && icon.startsWith("/") ? (

  <img
    src={icon}
    alt={interview.title}
  />

) : (

  <span>{icon}</span>

)}

      </div>

      <h3>

        {interview.title}

      </h3>

   <p className="card-category">
  {interview.company || `${category} Development`}
</p>

      <span
        className={`difficulty ${difficultyColor[
          interview.difficulty
        ]}`}
      >

        {interview.difficulty}

      </span>

      <div className="card-info">

        <span>

          <FaClock />

          {interview.duration} min

        </span>

        <span>

          <FaQuestionCircle />

          {interview.questions?.length || 0} Questions

        </span>

      </div>

      <p className="card-description">

        {interview.description ||
          "Practice AI generated interview questions tailored for your skill level."}

      </p>

      <button
        onClick={onStart}
      >

        Start Interview

        <FaArrowRight />

      </button>

    </div>

  );

};

export default InterviewCard;