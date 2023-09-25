const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authenticationMiddleware");

const router = express.Router();

// Define a protected route that requires authentication
router.get("/profile", authenticate, userController.getUserProfile);

module.exports = router;
