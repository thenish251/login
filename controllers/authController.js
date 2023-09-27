const authService = require("../login/services/authService");
const authenticate = require("../login/middleware/authenticationMiddleware");
const User = require("../login/models/User");

const JWT_SECRET = "secretKey1234";

async function register(req, res) {
  console.log("login service called");
  try {
    const { email, password, name } = req.body;
    const user = await authService.registerUser(email, password, name);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

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
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    await Session.deleteOne({ userId: decoded.userId, token });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(401).json({ message: "Logout failed: " + error.message });
  }
}

// Function to generate an access token
function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1h", // Access token expiration time (adjust as needed)
  });
}

// Function to refresh an access token using a valid refresh token
async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.body;

    // Verify the refresh token

    console.log("refresh token called");
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    console.log(decoded);
    // Check if the user exists (you can add more validation here)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user._id);

    console.log(accessToken);

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Token refresh failed" });
  }
}

module.exports = { register, login, logout, refreshAccessToken };
