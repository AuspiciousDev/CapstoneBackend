const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const auth = require("../middleware/auth");

const rateLimit = require("express-rate-limit");
// Each IP can only send 5 login requests in 10 minutes
const loginRateLimiter = rateLimit({ max: 5, windowMS: 1000 * 60 * 10 });

// router.post("/", authController.handleLogin);
router.post("/", loginRateLimiter, authController.handleLogin);
router.post("/verify", authController.verifyPassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", auth, authController.resetPassword);
router.post("/change-password", auth, authController.changePassword);

module.exports = router;
