const Employee = require("../model/Employee");
const Student = require("../model/Student");
const User = require("../model/User");
const Grade = require("../model/Grade");
const TaskScore = require("../model/TaskScore");
const Task = require("../model/Task");

const createNewEmployee = async (req, res) => {
  try {
    const {
      empID,
      empType,
      SubjectLoads,
      LevelLoads,
      SectionLoads,
      active,
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
    console.log(empID);

    // if (!Number(req.body.empID))
    //   return res
    //     .status(409)
    //     .json({ message: `[${empID}] is not a valid Employee ID` });
    // if (!Number(mobile))
    //   return res
    //     .status(409)
    //     .json({ message: `[${contactNumber}] is not a valid Contact Number` });

    const duplicate = await Employee.findOne({ empID }).exec();
    if (duplicate)
      return res
        .status(409)
        .json({ message: "Duplicate Username for Employee" });
    const checkStud = await Student.findOne({ studID: empID }).exec();
    if (checkStud)
      return res.status(409).json({
        message: `Employee ID ${empID} already exist in Student records.`,
      });
    // const duplicateEmail = await Employee.findOne({ email }).exec();
    // if (duplicateEmail)
    const empObject = {
      empID,
      empType: empType.types,
      SubjectLoads,
      LevelLoads,
      SectionLoads,
      active,
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
    console.log(empObject);

    const empObjectRes = await Employee.create(empObject);
    if (!empObjectRes)
      return res.status(400).json({ message: "Cannot create employee!" });
    console.log(empObjectRes);
    res.status(201).json(empObjectRes);

    // const empObject = { empID, firstName, lastName };
    // const userObject = { username: empID, password: hashedPassword };
    // try {
    //   const empObjectRes = await Employee.create(empObject);
    //   const userObjectRes = await User.create(userObject);
    //   res.status(201).json({ empObjectRes, userObjectRes });
    // } catch (error) {
    //   console.error(error);
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllEmployees = async (req, res) => {
  const response = await Employee.find().sort({ empID: -1 });
  if (!response) return res.status(204).json({ message: "No Users Found!" });
  res.status(200).json(response);
};

const getEmployeeByID = async (req, res) => {
  try {
    if (!req?.params?.empID) {
      return res.status(400).json({ message: "Employee ID is required!" });
    }
    const employee = await Employee.findOne({ empID: req.params.empID }).exec();
    if (!employee) {
      return res
        .status(400)
        .json({ message: `Employee ID ${req.params.empID} not found` });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployeeByID = async (req, res) => {
  if (!req?.params?.empID) {
    return res.status(400).json({ message: "Employee ID params is required!" });
  }

  const {
    empID,
    empType,
    SubjectLoads,
    LevelLoads,
    SectionLoads,
    active,
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

  const response = await Employee.findOne({ empID: req.params.empID }).exec();

  if (!response) {
    return res.status(204).json({ message: "Employee doesn't exists!" });
  }

  const empObject = {
    empID,
    empType: empType.types,
    SubjectLoads,
    LevelLoads,
    SectionLoads,
    active,
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
  const update = await Employee.findOneAndUpdate(
    { empID: req.params.empID },
    {
      empType: empType.types,
      SubjectLoads,
      LevelLoads,
      SectionLoads,
      active,
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
  console.log(update);
  if (!update) {
    return res.status(400).json({ error: "No Employee" });
  }
  //const result = await response.save();
  res.json(update);
};
const updateEmployeeIMG = async (req, res) => {
  if (!req?.params?.empID) {
    return res.status(400).json({ message: "Employee ID params is required!" });
  }

  const { empID, imgURL } = req.body;
  console.log(req.body);
  console.log(imgURL);
  if (!imgURL) {
    return console.log("wala iamge");
  }
  if (!imgURL) {
    return res.status(400).json({ message: "Image URL is required!" });
  }
  const response = await Employee.findOne({ empID: req.params.empID }).exec();

  if (!response) {
    return res.status(204).json({ message: "Employee doesn't exists!" });
  }

  const empObject = {
    empID,
    imgURL,
  };
  console.log(empObject.imgURL);
  const update = await Employee.findOneAndUpdate(
    { empID: req.params.empID },
    {
      $set: { imgURL: empObject.imgURL },
    }
  );
  console.log(update);
  if (!update) {
    return res.status(400).json({ error: "No Employee" });
  }
  //const result = await response.save();
  res.json(update);
};

const updateEmployeeLoads = async (req, res) => {
  if (!req?.params?.empID) {
    return res.status(400).json({ message: "Employee ID params is required!" });
  }
  console.log(req.body);
  const { empID, levelLoad, sectionLoad, subjectLoad } = req.body;

  if (!empID) {
    return res.status(400).json({ message: "Employee ID is required!" });
  }
  if (empID !== req?.params?.empID) {
    return res
      .status(400)
      .json({ message: "Provided Employee ID and Request ID does not match!" });
  }

  const response = await Employee.findOne({ empID: req.params.empID }).exec();
  if (!response) {
    return res.status(204).json({ message: "Employee doesn't exists!" });
  }
  const empObject = {
    empID,
    SubjectLoads: subjectLoad.types,
    LevelLoads: levelLoad.types,
    SectionLoads: sectionLoad.types,
  };

  const update = await Employee.findOneAndUpdate(
    { empID: req.params.empID },
    {
      $set: {
        LevelLoads: empObject.LevelLoads,
        SectionLoads: empObject.SectionLoads,
        SubjectLoads: empObject.SubjectLoads,
      },
    }
  );
  console.log(update);
  if (!update) {
    return res.status(400).json({ error: "Employee Loads update failed!" });
  }
  res.json(update);
};

const deleteEmployeeByID = async (req, res) => {
  const { empID } = req.body;
  if (!empID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Employee.findOne({ empID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${empID} not found!` });
  }
  const findUser = await User.findOne({ username: empID });
  console.log(findUser);
  if (findUser) {
    return res.status(400).json({
      message: `Cannot delete ${empID}, A records currently exists with ${empID} in Users. To delete the record, Remove all records that contains ${empID} `,
    });
  }
  const findGrade = await Grade.find({ empID });
  if (findGrade.length > 0) {
    return res.status(400).json({
      message: `Cannot delete ${empID}, A records currently exists with ${empID} in Grades. To delete the record, Remove all records that contains ${empID} `,
    });
  }

  const findTask = await Task.find({ empID });
  if (findTask.length > 0) {
    return res.status(400).json({
      message: `Cannot delete ${empID}, A records currently exists with ${empID} in Tasks. To delete the record, Remove all records that contains ${empID} `,
    });
  }
  const findTaskScore = await TaskScore.find({ empID });
  if (findTaskScore.length > 0) {
    return res.status(400).json({
      message: `Cannot delete ${empID}, A records currently exists with ${empID} in Scores. To delete the record, Remove all records that contains ${empID} `,
    });
  }

  const deleteItem = await findID.deleteOne({ empID });
  res.json(deleteItem);
};
const toggleStatusById = async (req, res) => {
  console.log(req.body);
  const { empID, status } = req.body;
  if (!empID) {
    return res.status(400).json({ message: "ID required!" });
  }
  console.log(req.body);
  console.log(empID.toLowerCase());

  const findID = await Employee.findOne({
    empID: empID.toLowerCase(),
  }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${empID} not found!` });
  }
  const updateItem = await Employee.findOneAndUpdate(
    { empID: empID.toLowerCase() },
    {
      status,
    }
  );

  if (!updateItem) {
    return res.status(400).json({ message: "No Employee" });
  }
  //const result = await response.save();
  res.json(updateItem);
};
module.exports = {
  getAllEmployees,
  createNewEmployee,
  getEmployeeByID,
  updateEmployeeByID,
  deleteEmployeeByID,
  toggleStatusById,
  updateEmployeeIMG,
  updateEmployeeLoads,
};
