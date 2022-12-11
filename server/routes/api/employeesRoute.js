const express = require("express");
const router = express.Router();
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,"./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var uploads = multer({ storage: storage });

const employeesController = require("../../controller/employeesController");

router.get("/", employeesController.getAllEmployees);
router.get("/search/:empID", employeesController.getEmployeeByID);
router.post("/register", employeesController.createNewEmployee);
router.post(
  "/import",
  uploads.single("csv"),
  employeesController.importEmployee
);
router.patch("/update/:empID", employeesController.updateEmployeeByID);
router.patch("/update/img/:empID", employeesController.updateEmployeeIMG);
router.post("/update/loads/:empID", employeesController.updateEmployeeLoads);
router.patch("/status", employeesController.toggleStatusById);
router.delete("/delete", employeesController.deleteEmployeeByID);

module.exports = router;
