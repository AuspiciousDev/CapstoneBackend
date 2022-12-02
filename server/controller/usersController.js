const User = require("../model/User");
const Employee = require("../model/Employee");
const Student = require("../model/Student");
const bcrypt = require("bcrypt");
// const createNewUser = async (req, res) => {
//   const { username, password, roles } = req.body;
//   if (!username || !password) {
//     return res
//       .status(400)
//       .json({ message: "First and Last names and Roles are required" });
//   }
//   const duplicate = await User.findOne({ username }).exec();

//   if (duplicate) return res.status(409).json({ message: "Duplicate Employee" });

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const userObject = !roles
//     ? { username, password: hashedPassword }
//     : { username, password: hashedPassword, roles };
//   try {
//     const result = await User.create(userObject);
//     res.status(201).json(result);
//   } catch (error) {
//     console.error(error);
//   }
// };
const getAllUsers = async (req, res) => {
  const users = await User.find()
    // .select("-password")
    .sort({ createdAt: -1 })
    .lean();
  if (!users) return res.status(204).json({ message: "No Users Found!" });
  res.status(200).json(users);
};
const getDocEmployee = async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "employees",
        localField: "username",
        foreignField: "empID",
        as: "profile",
      },
    },
    {
      $unwind: {
        path: "$profile",
      },
    },
    {
      $match: {
        userType: "employee",
      },
    },
    {
      $set: {
        lastName: {
          $toString: "$profile.lastName",
        },
        firstName: {
          $toString: "$profile.firstName",
        },
        middleName: {
          $toString: "$profile.middleName",
        },
      },
    },
  ]);

  if (!users) return res.status(204).json({ message: "No Users Found!" });
  res.status(200).json(users);
};
const getDocStudent = async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "username",
        foreignField: "studID",
        as: "profile",
      },
    },
    {
      $unwind: {
        path: "$profile",
      },
    },
    {
      $match: {
        userType: "student",
      },
    },
    {
      $set: {
        lastName: {
          $toString: "$profile.lastName",
        },
        firstName: {
          $toString: "$profile.firstName",
        },
        middleName: {
          $toString: "$profile.middleName",
        },
      },
    },
  ]);

  if (!users) return res.status(204).json({ message: "No Users Found!" });
  res.status(200).json(users);
};
const createNewUser1 = async (req, res) => {
  // Retrieve data
  let defPassword;
  let verifyUserExists;
  let userType;
  const { username, roles, password } = req.body;
  console.log(username, roles, password);
  // Validate Data if given

  if (!username || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  if (roles.includes("2001" || "2002")) {
    verifyUserExists = await Employee.findOne({ empID: username })
      .lean()
      .exec();
    userType = "employee";
  } else if (roles.includes("2003")) {
    verifyUserExists = await Student.findOne({ studID: username })
      .lean()
      .exec();
    userType = "student";
  }
  console.log("Verify User Exists :", verifyUserExists);
  if (
    !verifyUserExists ||
    verifyUserExists === null ||
    verifyUserExists === undefined
  )
    return res
      .status(409)
      .json({ message: `Username ${username} does not exists!` });

  // Check for Duplicate Username
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate user!" });
  }
  // Hashed the password
  if (!password) {
    defPassword = "P@$$W0RD";
  } else {
    defPassword = password;
  }
  const hashedPassword = await bcrypt.hash(defPassword, 10);
  const userObject = { username, password: hashedPassword, roles, userType };

  // Create and Store new User
  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await User.create(userObject);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};
const createNewUser = async (req, res) => {
  // Retrieve data
  let verifyUserExists;
  const roles = [];
  const { username } = req.body;
  console.log(req.body);
  let userType;
  // Validate Data if given

  if (!username) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Username already registered!" });
  }
  verifyUserExists = await Employee.findOne({ empID: username }).lean().exec();
  console.log("Register12: ", verifyUserExists);

  if (verifyUserExists.length > 0) {
    userType = "employee";
  }
  if (
    !verifyUserExists ||
    verifyUserExists === null ||
    verifyUserExists === undefined
  ) {
    verifyUserExists = await Student.findOne({ studID: username })
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
  const password = "P@$$W0RD";
  const hashedPassword = await bcrypt.hash(password, 10);
  const userObject = { username, password: hashedPassword, roles, userType };
  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await User.create(userObject);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};

const updateUser = async (req, res) => {
  // Get Request data
  const { id, username, roles } = req.body;

  // Validate Data if given
  if (!username || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Does the user exist to update?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  user.username = username;
  user.roles = roles;

  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
};

const getUserByID = async (req, res) => {
  console.log("test", req.params.userNum);

  if (!req?.params?.userNum) {
    return res.status(400).json({ message: "ID required!" });
  }
  const user = await User.findOne({ username: req.params.userNum }).exec();
  if (!user) {
    return res
      .status(400)
      .json({ message: `User ID ${req.params.userNum} not found` });
  }
  res.json(user);
};

const getAllUserByRole = async (req, res) => {
  const role = req.body.role;
  try {
    const anything = await User.find({ role: role });
    if (anything.length === 0)
      return res.status(404).json({ message: `no user have role ${role}` });
    res.status(200).json(anything);
  } catch (error) {
    res.sendStatus(404);
    console.error(error);
  }
};
const deleteDocByID = async (req, res) => {
  const { username } = req.body;
  console.log(req.body);
  if (!username) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await User.findOne({ username }).exec();
  if (!findID) {
    return res.status(404).json({ message: `${username} not found!` });
  }
  const deleteItem = await findID.deleteOne({ username });
  res.status(200).json({ message: `${username} permanently deleted!` });
};

const removeUserRoleByID = async (req, res) => {
  if (!req?.params?.searchID) {
    return res.status(400).json({ message: "ID params is required!" });
  }
  const user = await User.findOne({ username: req.params.userNum }).exec();
  if (!user) {
    return res
      .status(400)
      .json({ message: `User ID ${req.params.userNum} not found` });
  }
  const update = await user.update(
    { username: req.params.userNum },
    {
      $unset: { "incomes.anyKeyNameIWant": "" },
    }
  );
};

const forgot = async (req, res) => {
  let verify;
  try {
    const { email } = req.body;
    verify = await Student.findOne({ email });
    if (!verify) {
      verify = await Employee.findOne({ email });
    } else {
      return res
        .status(404)
        .json({ message: `Email ${email} does not exists!` });
    }
  } catch (error) {}
};

const getUserProfileByID = async (req, res) => {
  let verifyUserExists;
  let user;
  try {
    const { username, roles } = req.body;
    if (!username || !Array.isArray(roles) || !roles.length) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const exists = await User.findOne({ username }).lean().exec();
    if (!exists) {
      return res.status(404).json({ message: "User does not exists!" });
    }
    if (roles.includes("2001" || "2002")) {
      verifyUserExists = await Employee.findOne({ empID: username })
        .lean()
        .exec();
    } else if (roles.includes("2003")) {
      verifyUserExists = await Student.findOne({ studID: username })
        .lean()
        .exec();
    }
    console.log("Verify User Exists :", verifyUserExists);
    if (
      !verifyUserExists ||
      verifyUserExists === null ||
      verifyUserExists === undefined
    )
      return res
        .status(409)
        .json({ message: `Username ${username} does not exists!` });

    if (roles.includes("2001" || "2002")) {
    } else if (roles.includes("2003")) {
      user = await User.findOne({ username }, [
        {
          $lookup: {
            from: "students",
            localField: "username",
            foreignField: "studID",
            as: "StudentProfile",
          },
        },
        {
          $unwind: {
            path: "$StudentProfile",
          },
        },
      ]);

      console.log(user);
    }
  } catch (error) {}
};
module.exports = {
  createNewUser,
  updateUser,
  getAllUsers,
  getAllUserByRole,
  getUserByID,
  deleteDocByID,
  getUserProfileByID,
  getDocEmployee,
  getDocStudent,
};
