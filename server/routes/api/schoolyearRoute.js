const express = require("express");
const router = express.Router();
const schoolyearController = require("../../controller/schoolyearController");

router.get("/", schoolyearController.getAllDoc);
router.patch("/update", schoolyearController.updateDocByID);
router.get("/search", schoolyearController.getDocByID);
router.post("/register", schoolyearController.createDoc);
router.delete("/delete/", schoolyearController.deleteDocByID);
router.patch("/status", schoolyearController.toggleStatusById);
router.get("/status/active", schoolyearController.getDocActive);

module.exports = router;
