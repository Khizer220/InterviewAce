const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ======================================
    // BASIC INFORMATION
    // ======================================

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    // ======================================
    // ROLE
    // ======================================

    role: {
      type: String,
      enum: ["candidate", "admin"],
      default: "candidate",
    },

    // ======================================
    // PROFILE
    // ======================================

    profileImage: {
      type: String,
      default: "",
    },

    // ======================================
    // TECHNOLOGY STACK
    // ======================================

    stack: {
      type: [String],
      default: [],
    },

    // ======================================
    // INTERVIEW PREPARATION PROGRESS
    // ======================================

    progress: {
      completed: {
        type: Number,
        default: 0,
        min: 0,
      },

      total: {
        type: Number,
        default: 0,
        min: 0,
      },

      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    // ======================================
    // ACCOUNT STATUS
    // ======================================

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    // ======================================
    // ACTIVITY TRACKING
    // ======================================

    lastLogin: {
      type: Date,
      default: null,
    },

    lastActive: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;