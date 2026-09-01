import { FaArrowRight, FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import Button from "../../../components/ui/Button";
import DashboardPreview from "../../../components/ui/DashboardPreview";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">

      <div className="blur blur1"></div>
      <div className="blur blur2"></div>

      <div className="hero-left">

        <motion.div
          className="badge"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🚀 AI Powered Mock Interview Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Practice Interviews.
          <br />
          Improve Skills.
          <br />
          <span>Ace Every Opportunity.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Practice HR interviews, technical interviews, coding challenges,
          resume analysis and AI-powered feedback from one modern platform.
        </motion.p>

        <div className="hero-buttons">

          <Button>
            Start Interview <FaArrowRight />
          </Button>

          <Button variant="secondary">
            <FaPlay />
            Watch Demo
          </Button>

        </div>

      </div>

      <motion.div
        className="hero-right"
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <DashboardPreview />
      </motion.div>

    </section>
  );
};

export default Hero;