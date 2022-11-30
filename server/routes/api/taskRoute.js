const express = require("express");
const router = express.Router();
const taskController = require("../../controller/taskController");

router.get("/", taskController.getAllDoc);
router.post("/register", taskController.createDoc);

module.exports = router;
