const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const auth = require("../middleware/auth");
router.post("/", authController.handleLogin);
router.post("/verify", authController.verifyPassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", auth, authController.resetPassword);

module.exports = router;
