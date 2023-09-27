const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");

const JWT_SECRET = "secretKey1234";

function isPasswordComplex(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return (
    password.length >= minLength && hasUppercase && hasLowercase && hasNumbers
  );
}

async function registerUser(email, password, name) {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
      throw new Error("Invalid email format");
    }

    if (!isPasswordComplex(password)) {
      throw new Error(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

    const session = new Session({
      userId: newUser._id,
      token,
    });

    await session.save();

    return { user: newUser, token };
  } catch (error) {
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    const session = new Session({
      userId: user._id,
      token,
    });

    await session.save();

    return { token };
  } catch (error) {
    throw error;
  }
}

module.exports = { registerUser, loginUser };
