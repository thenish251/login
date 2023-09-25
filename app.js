const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/database");

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Import and use your routes here
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Use authentication routes under the "/auth" path
app.use("/auth", authRoutes);

// Use user-related routes under the "/user" path
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
