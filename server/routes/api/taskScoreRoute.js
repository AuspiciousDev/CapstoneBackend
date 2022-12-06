const express = require("express");
const router = express.Router();
const taskScoreController = require("../../controller/taskScoreController");

router.get("/", taskScoreController.getAllDoc);
router.post("/register", taskScoreController.createDoc);
router.delete("/delete", taskScoreController.deleteByDocID);

module.exports = router;
