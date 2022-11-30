const User = require("../model/User");
const Employee = require("../model/Employee");
const Student = require("../model/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createNewUser = async (req, res) => {
  // Retrieve data
  let verifyUserExists;
  var userType;
  const roles = [];
  const { username, email, password } = req.body;
  console.log(req.body);
  // Validate Data if given

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Username already registered!" });
  }
  verifyUserExists = await Employee.findOne({ empID: username, email: email })
    .lean()
    .exec();
  console.log("Register12: ", verifyUserExists);
  userType = "employee";
  if (
    !verifyUserExists ||
    verifyUserExists === null ||
    verifyUserExists === undefined
  ) {
    verifyUserExists = await Student.findOne({ studID: username, email: email })
      .lean()
      .exec();
    console.log("Register2: ", verifyUserExists);
    userType = "student";
    if (
      !verifyUserExists ||
      verifyUserExists === null ||
      verifyUserExists === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Username/Email does not exists!" });
    } else {
      roles.push(2003);
    }
  } else {
    roles.push(parseInt(verifyUserExists.empType));
  }
  console.log("userType :", userType);
  const hashedPassword = await bcrypt.hash(password, 10);
  const userObject = { username, password: hashedPassword, roles, userType };

  console.log("userObject :", userObject);

  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await User.create(userObject);
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createNewUser,
};
