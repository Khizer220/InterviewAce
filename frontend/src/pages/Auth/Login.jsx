import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] =
    useState("candidate");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);

      // ===============================
      // Role Validation
      // ===============================

      if (
        selectedRole === "admin" &&
        data.user.role !== "admin"
      ) {
        alert(
          "This account is not registered as an Administrator."
        );
        return;
      }

      if (
        selectedRole === "candidate" &&
        data.user.role !== "candidate"
      ) {
        alert(
          "This account is not registered as a Candidate."
        );
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login Successful");

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/candidate/dashboard");
      }

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>
          Interview<span>Ace</span>
        </h1>

        <h2>Welcome Back 👋</h2>

        <p>
          Sign in to continue your interview preparation.
        </p>

        {/* Role Selector */}

        <div className="role-switch">

          <button
            type="button"
            className={
              selectedRole === "candidate"
                ? "active-role"
                : ""
            }
            onClick={() =>
              setSelectedRole("candidate")
            }
          >
            Candidate
          </button>

          <button
            type="button"
            className={
              selectedRole === "admin"
                ? "active-role"
                : ""
            }
            onClick={() =>
              setSelectedRole("admin")
            }
          >
            Administrator
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {selectedRole === "admin"
              ? "Sign In as Administrator"
              : "Sign In as Candidate"}
          </button>

        </form>

        <div className="bottom-text">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Login;