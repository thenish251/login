const User = require("../models/User");

async function getUserProfile(userId) {
  try {
    // Find the user by their userId
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Extract the user profile data you want to return
    const userProfile = {
      email: user.email,
      name: user.name,
      // Add more fields as needed
    };

    return userProfile;
  } catch (error) {
    throw error; // Propagate the error to the calling function
  }
}

module.exports = { getUserProfile };
