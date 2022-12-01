const express = require("express");
const router = express.Router();
const gradesController = require("../../controller/gradesController");

router.get("/", gradesController.getAllDoc);
// router.patch("/update", departmentController.updateDocByID);
// router.get("/search", departmentController.getDocByID);
router.get("/search/:studID/:year", gradesController.getDocByStudIDandYear);
router.post("/register", gradesController.createDoc);
router.delete("/delete/", gradesController.deleteDocByID);
module.exports = router;
