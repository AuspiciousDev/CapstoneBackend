const Student = require("../model/Student");
const User = require("../model/User");
const Grade = require("../model/Grade");
const Enrolled = require("../model/Enrolled");

const createNewStudent = async (req, res) => {
  console.log("New Student :", req.body);
  const {
    studID,
    LRN,
    firstName,
    middleName,
    lastName,
    suffix,
    dateOfBirth,
    placeOfBirth,
    gender,
    civilStatus,
    nationality,
    religion,
    address,
    city,
    province,
    mobile,
    telephone,
    emergencyName,
    emergencyRelationship,
    emergencyNumber,
  } = req.body;

  console.log(studID);
  if (
    !studID ||
    !LRN ||
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !gender ||
    !email
  ) {
    return res.status(400).json({ message: "Incomplete details!" });
  }
  // if (!Number(studID))
  //   return res
  //     .status(409)
  //     .json({ message: `[${studID}] is not a valid Employee ID` });
  // if (!Number(contactNumber))
  //   return res
  //     .status(409)
  //     .json({ message: `[${contactNumber}] is not a valid Contact Number` });

  const duplicate = await Student.findOne({ studID }).exec();
  if (duplicate) return res.status(409).json({ message: "Duplicate Student" });
  const empObject = {
    studID,
    LRN,
    firstName,
    middleName,
    lastName,
    suffix,
    dateOfBirth,
    placeOfBirth,
    gender,
    civilStatus,
    nationality,
    religion,
    address,
    city,
    province,
    mobile,
    telephone,
    emergencyName,
    emergencyRelationship,
    emergencyNumber,
  };
  try {
    const empObjectRes = await Student.create(empObject);
    if (!empObjectRes)
      return res.status(400).json({ message: "Cannot create student!" });
    console.log(empObjectRes);
    res.status(201).json(empObjectRes);
  } catch (error) {
    console.error(error);
  }
};
const getAllStudents = async (req, res) => {
  const response = await Student.find();
  if (!response) return res.status(204).json({ message: "No Student Found!" });
  res.status(200).json(response);
};
const getStudentByID = async (req, res) => {
  if (!req?.params?.studID) {
    return res.status(400).json({ message: "Student ID required!" });
  }
  const student = await Student.findOne({ studID: req.params.studID }).exec();
  if (!student) {
    return res
      .status(400)
      .json({ message: `Student ID ${req.params.studID} not found` });
  }
  res.status(200).json(student);
};

const updateStudentByID = async (req, res) => {
  console.log(req.body);
  if (!req?.params?.studID) {
    return res.status(400).json({ message: "Student ID params is required!" });
  }
  const {
    studID,
    LRN,
    firstName,
    middleName,
    lastName,
    suffix,
    dateOfBirth,
    placeOfBirth,
    gender,
    civilStatus,
    nationality,
    religion,
    address,
    city,
    province,
    email,
    mobile,
    telephone,
    emergencyName,
    emergencyRelationship,
    emergencyNumber,
  } = req.body;

  const response = await Student.findOne({ studID: req.params.studID }).exec();

  if (!response) {
    return res.status(204).json({ message: "Employee ID required!" });
  }

  const object = {
    LRN,
    firstName,
    middleName,
    lastName,
    suffix,
    dateOfBirth,
    placeOfBirth,
    gender,
    civilStatus,
    nationality,
    religion,
    address,
    city,
    province,
    email,
    mobile,
    telephone,
    emergencyName,
    emergencyRelationship,
    emergencyNumber,
  };

  const update = await Student.findOneAndUpdate(
    { studID: req.params.studID },
    {
      LRN,
      firstName,
      middleName,
      lastName,
      suffix,
      dateOfBirth,
      placeOfBirth,
      gender,
      civilStatus,
      nationality,
      religion,
      address,
      city,
      province,
      email,
      mobile,
      telephone,
      emergencyName,
      emergencyRelationship,
      emergencyNumber,
    }
  );

  if (!update) {
    return res.status(400).json({ error: "No Employee" });
  }
  //const result = await response.save();
  res.json(update);
};

const deleteStudentByID = async (req, res) => {
  const { studID } = req.body;
  if (!studID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Student.findOne({ studID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${studID} not found!` });
  }
  const findUser = await User.findOne({ username: studID });
  console.log(findUser);
  if (findUser) {
    return res.status(400).json({
      message: `Cannot delete ${studID} in Users collections, A record/s currently exists with ${studID}. To delete the record, Remove all records that contains ${studID} `,
    });
  }
  const findGrade = await Grade.findOne({ studID }).exec();
  console.log(findGrade);
  if (findGrade) {
    return res.status(400).json({
      message: `Cannot delete ${studID} in Grades, A record/s currently exists with ${studID}. To delete the record, Remove all records that contains ${studID} `,
    });
  }
  const findEnroll = await Enrolled.findOne({ studID }).exec();
  console.log(findEnroll);
  if (findEnroll) {
    return res.status(400).json({
      message: `Cannot delete ${studID} in Enrolled, A record/s currently exists with ${studID}. To delete the record, Remove all records that contains ${studID} `,
    });
  }

  const deleteItem = await findID.deleteOne({ studID });
  res.json(deleteItem);
};

const toggleStatusById = async (req, res) => {
  console.log(req.body);
  const { studID, status } = req.body;
  if (!studID) {
    return res.status(400).json({ message: "ID required!" });
  }
  console.log(req.body);
  console.log(studID.toLowerCase());

  const findID = await Student.findOne({
    studID: studID.toLowerCase(),
  }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${studID} not found!` });
  }
  const updateItem = await Student.findOneAndUpdate(
    { studID: studID.toLowerCase() },
    {
      status,
    }
  );

  if (!updateItem) {
    return res.status(400).json({ message: "No Student" });
  }
  //const result = await response.save();
  res.json(updateItem);
};

const updateIMG = async (req, res) => {
  if (!req?.params?.studID) {
    return res.status(400).json({ message: "Student ID params is required!" });
  }

  const { studID, imgURL } = req.body;
  console.log(req.body);
  console.log(imgURL);
  if (!imgURL) {
    return console.log("wala iamge");
  }
  if (!imgURL) {
    return res.status(400).json({ message: "Image URL is required!" });
  }
  const response = await Student.findOne({ imgURL: req.params.imgURL }).exec();

  if (!response) {
    return res.status(204).json({ message: "Student doesn't exists!" });
  }

  const empObject = {
    studID,
    imgURL,
  };
  console.log(empObject.imgURL);
  const update = await Student.findOneAndUpdate(
    { imgURL: req.params.imgURL },
    {
      $set: { imgURL: empObject.imgURL },
    }
  );
  console.log(update);
  if (!update) {
    return res.status(400).json({ error: "No Student" });
  }
  //const result = await response.save();
  res.json(update);
};
module.exports = {
  createNewStudent,
  getAllStudents,
  getStudentByID,
  updateStudentByID,
  deleteStudentByID,
  toggleStatusById,
  updateIMG,
};
