const jwt = require("jsonwebtoken");
const Session = require("../models/Session");

const JWT_SECRET = "your-secret-key";

async function authenticate(req, res, next) {
  console.log("middleware called");
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await Session.findOne({ userId: decoded.userId, token });

    if (!session) {
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    // Attach the user's ID to the request for use in subsequent middleware or route handlers
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired or invalid" });
  }
}

module.exports = authenticate;
