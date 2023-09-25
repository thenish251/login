const authService = require("../services/authService");
const authenticate = require("../middleware/authenticationMiddleware");

// Function for user registration
async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    const user = await authService.registerUser(email, password, name);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Function for user login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    // Get the session token from the request headers
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Decode the token to extract the user ID
    const decoded = jwt.verify(token, JWT_SECRET);

    // Delete the session record associated with the token
    await Session.deleteOne({ userId: decoded.userId, token });

    // You can add additional logout logic here if needed

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    // Handle errors (e.g., token verification failure)
    res.status(401).json({ message: "Logout failed: " + error.message });
  }
}

module.exports = { register, login, logout };
