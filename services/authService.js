const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");

const JWT_SECRET = "your-secret-key"; // Replace with your secret key

async function registerUser(email, password, name) {
  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

    // Create a session record in the database
    const session = new Session({
      userId: newUser._id,
      token,
    });

    await session.save();

    // Return the user and token
    return { user: newUser, token };
  } catch (error) {
    throw error; // Propagate the error to the calling function
  }
}

async function loginUser(email, password) {
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user does not exist, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, throw an error
    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    // Generate a new JWT token for the authenticated user
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    // Create a session record in the database
    const session = new Session({
      userId: user._id,
      token,
    });

    await session.save();

    // Return the user and token
    return { user, token };
  } catch (error) {
    throw error;
  }
}

module.exports = { registerUser, loginUser };
