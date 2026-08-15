const User = require("../models/User");

// ======================================
// Get All Candidates
// ======================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "candidate",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    const formattedUsers = users.map((user) => {
      const userObject = user.toObject();

      const completed = user.progress?.completed || 0;
      const total = user.progress?.total || 0;

      let percentage = user.progress?.percentage || 0;

      // Calculate percentage automatically if
      // completed and total are available.
      if (total > 0) {
        percentage = Math.round(
          (completed / total) * 100
        );
      }

      return {
        ...userObject,

        progress: {
          completed,
          total,
          percentage,
        },

        stack: user.stack || [],

        isActive: user.isActive === true,

        isApproved: user.isApproved === true,

        lastLogin: user.lastLogin || null,

        lastActive: user.lastActive || null,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ======================================
// Get Pending Users
// ======================================

const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "candidate",
      isApproved: false,
      isActive: true,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get Pending Users Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending users",
    });
  }
};

// ======================================
// Approve User
// ======================================

const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "candidate",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        message: "User is already approved",
      });
    }

    user.isApproved = true;
    user.isActive = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Candidate approved successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Approve User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to approve candidate",
    });
  }
};

// ======================================
// Reject User
// ======================================

const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "candidate",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    user.isActive = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Candidate rejected successfully",
    });
  } catch (error) {
    console.error(
      "Reject User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to reject candidate",
    });
  }
};

// ======================================
// Delete Candidate
// ======================================

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "candidate",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Candidate removed successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove candidate",
    });
  }
};

// ======================================
// Export
// ======================================

module.exports = {
  getUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser,
};