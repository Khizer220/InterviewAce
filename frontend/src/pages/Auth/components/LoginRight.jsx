import { useState } from "react";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

import "./LoginRight.css";

const LoginRight = ({
  selectedRole,
  setSelectedRole,
  formData,
  handleChange,
  handleSubmit,
}) => {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="login-right">

      <div className="login-card">

        <div className="login-header">

          <div className="mini-logo">
            ✦
          </div>

          <h1>
            Interview<span>Ace</span>
          </h1>

          <h2>Sign In</h2>

          <p>
            Continue your AI interview preparation.
          </p>

        </div>

        {/* Role Switch */}

        <div className="role-switch">

          <button
            type="button"
            className={
              selectedRole === "candidate"
                ? "active"
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
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedRole("admin")
            }
          >
            Administrator
          </button>

        </div>

        {/* FORM */}

       <form onSubmit={handleSubmit} autoComplete="off">

  {/* Email */}

  <div className="input-box">

    <label>Email Address</label>

    <div className="input-field">

      <HiOutlineEnvelope />

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

  </div>

  {/* Password */}

  <div className="input-box">

    <label>Password</label>

    <div className="input-field">

      <HiOutlineLockClosed />

      <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />

      <button
        type="button"
        className="eye-btn"
        onClick={() =>
          setShowPassword(!showPassword)
        }
      >
        {showPassword ? (
          <HiOutlineEyeSlash />
        ) : (
          <HiOutlineEye />
        )}
      </button>

    </div>

  </div>

  {/* Options */}

  <div className="login-options">

    <label>
      <input type="checkbox" />
      Remember me
    </label>

    <button
      type="button"
      className="forgot-btn"
    >
      Forgot Password?
    </button>

  </div>

  {/* Login */}

  <button
    type="submit"
    className="signin-btn"
  >
    {selectedRole === "admin"
      ? "Sign In as Administrator"
      : "Sign In as Candidate"}
  </button>

</form>

        {/* Divider */}

        <div className="divider">

          <span>OR</span>

        </div>

        {/* Google */}

        <button
          type="button"
          className="google-btn"
        >
          <FcGoogle />

          Continue with Google

        </button>

        <p className="register-link">

          Don't have an account?{" "}

          <Link to="/register">

            Register

          </Link>

        </p>

      </div>

    </div>
  );
};

export default LoginRight;