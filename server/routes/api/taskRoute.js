const express = require("express");
const router = express.Router();
const taskController = require("../../controller/taskController");

router.get("/", taskController.getAllDoc);
router.post("/register", taskController.createDoc);
router.patch("/status/:taskID", taskController.toggleStatusById);

module.exports = router;
