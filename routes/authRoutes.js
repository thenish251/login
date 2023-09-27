const express = require("express");
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authenticationMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/refresh-token", authenticate, authController.refreshAccessToken);

module.exports = router;
