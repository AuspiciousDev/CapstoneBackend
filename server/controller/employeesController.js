const Employee = require("../model/Employee");
const User = require("../model/User");
const Grade = require("../model/Grade");

const createNewEmployee = async (req, res) => {
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
  if (duplicate) return res.status(409).json({ message: "Duplicate Employee" });

  const duplicateEmail = await Employee.findOne({ email }).exec();
  if (duplicateEmail)
    return res.status(409).json({ message: "Duplicate Email" });
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
  try {
    const empObjectRes = await Employee.create(empObject);
    if (!empObjectRes)
      return res.status(400).json({ message: "Cannot create employee!" });
    console.log(empObjectRes);
    res.status(201).json(empObjectRes);
  } catch (error) {
    console.error(error);
  }

  // const empObject = { empID, firstName, lastName };
  // const userObject = { username: empID, password: hashedPassword };
  // try {
  //   const empObjectRes = await Employee.create(empObject);
  //   const userObjectRes = await User.create(userObject);
  //   res.status(201).json({ empObjectRes, userObjectRes });
  // } catch (error) {
  //   console.error(error);
  // }
};

const getAllEmployees = async (req, res) => {
  const response = await Employee.find().sort({ empID: -1 });
  if (!response) return res.status(204).json({ message: "No Users Found!" });
  res.status(200).json(response);
};

const getEmployeeByID = async (req, res) => {
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
    }
  );
  console.log(update);
  if (!update) {
    return res.status(400).json({ error: "No Employee" });
  }
  //const result = await response.save();
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
  const findUser = await User.find({ username: empID });
  if (findUser) {
    return res.status(400).json({
      message: `Cannot delete ${empID}, A records currently exists with ${empID} in Users. To delete the record, Remove all records that contains ${empID} `,
    });
  }
  const findGrade = await Grade.find({ empID });
  if (findGrade) {
    return res.status(400).json({
      message: `Cannot delete ${empID}, A records currently exists with ${empID} in Grades. To delete the record, Remove all records that contains ${empID} `,
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
};
