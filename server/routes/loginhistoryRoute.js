const express = require("express");
const router = express.Router();
const loginHistoryController = require("../controller/loginHistoryController");

router.get("/", loginHistoryController.getAllDoc);
router.post("/register", loginHistoryController.createDoc);
router.get("/employees", loginHistoryController.getAllEmpDoc);

module.exports = router;
