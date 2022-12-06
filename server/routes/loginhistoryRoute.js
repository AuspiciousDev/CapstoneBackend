const express = require("express");
const router = express.Router();
const loginHistoryController = require("../controller/loginHistoryController");

router.get("/", loginHistoryController.getAllDoc);
router.post("/register", loginHistoryController.createDoc);
router.get("/employees", loginHistoryController.getAllEmpDoc);
router.get("/students", loginHistoryController.getAllStudDoc);
router.delete("/delete", loginHistoryController.deleteDocByID);

module.exports = router;
