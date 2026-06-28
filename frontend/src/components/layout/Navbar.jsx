import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          Interview<span>Ace</span>
        </Link>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="start-btn">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;