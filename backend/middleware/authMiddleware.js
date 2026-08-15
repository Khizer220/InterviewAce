const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Only bump lastActive if it's been at least this long since the last
// write. Every authenticated request would otherwise trigger a DB write —
// this keeps "last active" accurate to the minute without hammering Mongo
// on every single API call a candidate's UI makes.
const LAST_ACTIVE_THROTTLE_MS = 60 * 1000;

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    // Token was valid but the account behind it is gone (deleted after
    // the token was issued). Without this check, req.user would be null
    // and every downstream route reading req.user.role/._id would throw
    // a confusing 500 instead of a clean 401.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // Real last-active tracking: touches on every authenticated request
    // from a candidate, not just login. Fire-and-forget — a slow or
    // failed write here should never block or fail the actual request.
    if (req.user.role === "candidate") {
      const lastActiveTime = req.user.lastActive
        ? new Date(req.user.lastActive).getTime()
        : 0;

      if (Date.now() - lastActiveTime > LAST_ACTIVE_THROTTLE_MS) {
        User.findByIdAndUpdate(req.user._id, { lastActive: new Date() }).catch(
          (err) => console.error("Failed to update lastActive:", err)
        );
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = { protect };