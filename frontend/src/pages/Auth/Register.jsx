import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
    adminKey: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
      adminKey: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.role === "admin" && !formData.adminKey) {
      alert("Admin registration key is required.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === "admin" && {
          adminKey: formData.adminKey,
        }),
      });

      if (formData.role === "admin") {
        alert("Admin account created successfully.");
      } else {
        alert(
          "Registration successful. Your account is pending administrator approval."
        );
      }

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Decorative background */}
      <div className="register-orb register-orb-one"></div>
      <div className="register-orb register-orb-two"></div>

      <div className="register-container">

        {/* ================= LEFT SIDE ================= */}

        <div className="register-left">

          <div className="register-brand">

            <div className="register-brand-icon">
              ✦
            </div>

            <h1>
              Interview<span>Ace</span>
            </h1>

          </div>

          <div className="register-hero">

            <span className="register-tag">
              AI Powered Platform
            </span>

            <h2>
              Start Your
              <br />
              Interview Journey
            </h2>

            <p>
              Create your account and practice smarter
              with AI-powered mock interviews, feedback,
              and skill improvement.
            </p>

          </div>

          <div className="register-highlight">

            <div className="highlight-icon">
              ✦
            </div>

            <div>
              <h3>
                Practice. Improve. Succeed.
              </h3>

              <p>
                Build confidence one interview at a time.
              </p>
            </div>

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="register-right">

          <div className="register-card">

            <div className="register-header">

              <div className="register-mini-logo">
                ✦
              </div>

              <h2>
                Create Account
              </h2>

              <p>
                Start your interview preparation journey.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
            >

              {/* ================= ROLE ================= */}

              <div className="register-role-section">

                <label>
                  Register As
                </label>

                <div className="register-role-options">

                  <button
                    type="button"
                    className={
                      formData.role === "candidate"
                        ? "role-option active"
                        : "role-option"
                    }
                    onClick={() =>
                      handleRoleChange("candidate")
                    }
                  >
                    <span>👤</span>
                    Candidate
                  </button>

                  <button
                    type="button"
                    className={
                      formData.role === "admin"
                        ? "role-option active"
                        : "role-option"
                    }
                    onClick={() =>
                      handleRoleChange("admin")
                    }
                  >
                    <span>🛡️</span>
                    Admin
                  </button>

                </div>

              </div>

              {/* ================= NAME ================= */}

              <div className="register-input-box">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />

              </div>

              {/* ================= EMAIL ================= */}

              <div className="register-input-box">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />

              </div>

              {/* ================= PASSWORD ================= */}

              <div className="register-input-box">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

              </div>

              {/* ================= CONFIRM PASSWORD ================= */}

              <div className="register-input-box">

                <label>
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

              </div>

              {/* ================= ADMIN KEY ================= */}

              {formData.role === "admin" && (
                <div className="register-input-box">

                  <label>
                    Admin Registration Key
                  </label>

                  <input
                    type="password"
                    name="adminKey"
                    placeholder="Enter admin registration key"
                    value={formData.adminKey}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />

                </div>
              )}

              {/* ================= SUBMIT ================= */}

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>

            <div className="register-login">

              Already have an account?

              <Link to="/login">
                Login
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;