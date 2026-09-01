const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// Generate JWT
// ===============================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ===============================
// Register User
// ===============================

const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role = "candidate",
      adminKey,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!["candidate", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration role",
      });
    }

    // Admin registration
    if (role === "admin") {
      if (!adminKey) {
        return res.status(400).json({
          success: false,
          message: "Admin registration key is required",
        });
      }

      if (adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin registration key",
        });
      }
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      isApproved: role === "admin",
      lastLogin: null,
      lastActive: null,
    });

    return res.status(201).json({
      success: true,
      message:
        role === "admin"
          ? "Admin account created successfully."
          : "Registration successful. Your account is pending administrator approval.",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// ===============================
// Login User
// ===============================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact the administrator.",
      });
    }

    if (
      user.role === "candidate" &&
      !user.isApproved
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is pending administrator approval.",
      });
    }

    const now = new Date();

    user.lastLogin = now;
    user.lastActive = now;

    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login Successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        isActive: user.isActive,

        lastLogin: user.lastLogin,
        lastActive: user.lastActive,

        stack: user.stack || [],

        progress: user.progress || {
          completed: 0,
          total: 0,
          percentage: 0,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// ===============================
// Get Logged-in User
// ===============================

const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// ===============================
// Update Logged-in User Profile
// ===============================

const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether another user already owns this email
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered to another account",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullName = fullName.trim();
    user.email = normalizedEmail;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        lastActive: user.lastActive,
        stack: user.stack || [],
        progress: user.progress || {
          completed: 0,
          total: 0,
          percentage: 0,
        },
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// ===============================
// Export
// ===============================

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};