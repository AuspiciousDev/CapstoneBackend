const express = require("express");
const router = express.Router();
const usersController = require("../../controller/usersController");

router.get("/", usersController.getAllUsers);
router.patch("/update", usersController.updateUser);
router.get("/role", usersController.getAllUserByRole);
router.get("/search/:userNum", usersController.getUserByID);
router.get("/search", usersController.getUserProfileByID);
router.get("/employees", usersController.getDocEmployee);
router.get("/students", usersController.getDocStudent);

router.post("/register", usersController.createNewUser);
router.delete("/delete", usersController.deleteDocByID);

module.exports = router;
