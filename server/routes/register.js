const express = require("express");
const router = express.Router();
const registerUserController = require("../controller/registerUserController");

router.post("/register", registerUserController.createNewUser);
router.post("/activation", registerUserController.activate);

module.exports = router;
