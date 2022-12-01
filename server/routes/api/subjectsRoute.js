const express = require("express");
const router = express.Router();
const subjectController = require("../../controller/subjectController");

router.get("/", subjectController.getAllDoc);
router.get("/search/:searchID", subjectController.getDocByID);
router.get("/search/level/:levelID", subjectController.getAllDocByLevel);
router.post("/register", subjectController.createDoc);
router.patch("/update", subjectController.updateDocByID);
router.patch("/status", subjectController.toggleStatusById);

router.delete("/delete", subjectController.deleteDocByID);

module.exports = router;