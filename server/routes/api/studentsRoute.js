const express = require("express");
const router = express.Router();
const studentController = require("../../controller/studentsController");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var uploads = multer({ storage: storage });

router.get("/", studentController.getAllStudents);
router.get("/search/:studID", studentController.getStudentByID);
router.post("/register", studentController.createNewStudent);
router.post("/import", uploads.single("csv"), studentController.importStudent);
router.patch("/update/:studID", studentController.updateStudentByID);
router.patch("/update/img/:studID", studentController.updateIMG);

router.patch("/status", studentController.toggleStatusById);
router.delete("/delete", studentController.deleteStudentByID);
module.exports = router;
