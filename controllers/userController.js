const userService = require("../services/userService");
const authenticate = require("../middleware/authenticationMiddleware");

// Function to get user profile
async function getUserProfile(req, res) {
  try {
    const userId = req.user.userId; // Extracted from the authenticated user's JWT
    const userProfile = await userService.getUserProfile(userId);
    res.json({ userProfile });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
}

module.exports = { getUserProfile };
