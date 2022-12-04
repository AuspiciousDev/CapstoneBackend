const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.post("/", authController.handleLogin);
router.post("/verify", authController.verifyPassword);
router.post("/forgot", authController.forgotPassword);

module.exports = router;
