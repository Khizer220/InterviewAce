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

    // Validate basic fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate role
    if (!["candidate", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration role",
      });
    }

    // =================================
    // ADMIN REGISTRATION
    // =================================

    if (role === "admin") {
      if (!adminKey) {
        return res.status(400).json({
          success: false,
          message: "Admin registration key is required",
        });
      }

      if (
        adminKey !== process.env.ADMIN_REGISTRATION_KEY
      ) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin registration key",
        });
      }
    }

    // =================================
    // CHECK EXISTING USER
    // =================================

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // =================================
    // HASH PASSWORD
    // =================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // =================================
    // CREATE USER
    // =================================

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,

      // Admins are automatically approved.
      // Candidates require administrator approval.
      isApproved: role === "admin",

      // New users have no activity yet.
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
    console.error(
      "Registration Error:",
      error
    );

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

    // =================================
    // VALIDATE FIELDS
    // =================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // =================================
    // FIND USER
    // =================================

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // =================================
    // CHECK PASSWORD
    // =================================

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

    // =================================
    // CHECK ACTIVE ACCOUNT
    // =================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact the administrator.",
      });
    }

    // =================================
    // CANDIDATE APPROVAL CHECK
    // =================================

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

    // =================================
    // UPDATE LOGIN ACTIVITY
    // =================================

    const now = new Date();

    user.lastLogin = now;
    user.lastActive = now;

    await user.save();

    // =================================
    // GENERATE TOKEN
    // =================================

    const token = generateToken(user);

    // =================================
    // LOGIN RESPONSE
    // =================================

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

        // Send activity information
        // to the frontend as well.
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
    console.error(
      "Login Error:",
      error
    );

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
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

// ===============================
// Export
// ===============================

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};