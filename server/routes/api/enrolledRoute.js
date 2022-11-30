const express = require("express");
const router = express.Router();
const enrolledController = require("../../controller/enrolledController");
router.get("/", enrolledController.getAllDoc);
router.post("/register", enrolledController.createDoc);

// router.patch("/update", activeStudentController.updateDocByID);
router.get("/search/:studID", enrolledController.getDocByID);
router.delete("/delete/", enrolledController.deleteDocByID);

module.exports = router;
