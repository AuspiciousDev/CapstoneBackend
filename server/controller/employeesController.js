const Employee = require("../model/Employee");
const Student = require("../model/Student");
const User = require("../model/User");
const Grade = require("../model/Grade");
const TaskScore = require("../model/TaskScore");
const Task = require("../model/Task");
const Enrolled = require("../model/Enrolled");
const SchoolYear = require("../model/SchoolYear");

const csv = require("csvtojson");

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
  try {
    if (!req?.params?.empID) {
      return res
        .status(400)
        .json({ message: "Employee ID params is required!" });
    }
    console.log(req.body);
    const { empID, levelLoad, sectionLoad, subjectLoad } = req.body;

    if (!empID) {
      return res.status(400).json({ message: "Employee ID is required!" });
    }
    if (empID !== req?.params?.empID) {
      return res.status(400).json({
        message: "Provided Employee ID and Request ID does not match!",
      });
    }
    console.log(
      "🚀 ~ file: employeesController.js:298 ~ updateEmployeeLoads ~  levelLoad.length",
      levelLoad.types.length
    );
    const response = await Employee.findOne({ empID: req.params.empID }).exec();
    if (!response) {
      return res.status(204).json({ message: "Employee doesn't exists!" });
    }
    if (response.SubjectLoads.length > 3 || subjectLoad.types.length > 3) {
      return res
        .status(400)
        .json({ message: "Employee can only have 3 total subjects" });
    }
    if (response.LevelLoads.length > 2 || levelLoad.types.length > 2) {
      return res
        .status(400)
        .json({ message: "Employee can only have 2 total Levels" });
    }
    if (response.SectionLoads.length > 5 || sectionLoad.types.length > 5) {
      return res
        .status(400)
        .json({ message: "Employee can only have 5 total Sections" });
    }
    const findSY = await SchoolYear.findOne({ status: true }).exec();
    console.log(
      "🚀 ~ file: employeesController.js:315 ~ updateEmployeeLoads ~ findSY",
      findSY.schoolYearID
    );
    if (!findSY) {
      return res
        .status(400)
        .json({ message: ` No Active School Year not found!` });
    }

    const getTotalStudent = await Enrolled.find().lean().exec();
    const getTotal = await getTotalStudent.filter((fill) => {
      return (
        fill?.status === true &&
        levelLoad &&
        levelLoad.types.some((e) => e === fill.levelID) &&
        fill?.schoolYearID === findSY.schoolYearID &&
        sectionLoad &&
        sectionLoad.types.some((e) => e === fill.sectionID)
        // console.log(levelLoad.types)
      );
    }).length;
    console.log(
      "🚀 ~ file: employeesController.js:338 ~ getTotal ~ getTotal",
      getTotal
    );
    if (getTotal > 200) {
      return res.status(400).json({
        message: "Employee can only handle 200 students!",
      });
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
  } catch (error) {
    console.log(
      "🚀 ~ file: employeesController.js:342 ~ updateEmployeeLoads ~ error",
      error
    );
    return res.status(500).json({ message: error.message });
  }
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
const importEmployee = async (req, res) => {
  // try {
  //   console.log(req.file.path);
  //   res.sendStatus(200);
  // } catch (error) {
  //   res.sendStatus(500);
  // }

  try {
    console.log(req);
    let bulkTags = [];

    await csv()
      .fromFile(req.file.path)
      .then(async (jsonObj) => {
        console.log(jsonObj);
        for (var x = 0; x < jsonObj; x++) {
          temp = parseFloat(jsonObj[x].empID);
          jsonObj[x].empID = temp;
          temp = parseFloat(jsonObj[x].empType);
          jsonObj[x].empType = temp;
          temp = parseFloat(jsonObj[x].firstName);
          jsonObj[x].firstName = temp;
          temp = parseFloat(jsonObj[x].middleName);
          jsonObj[x].middleName = temp;
          temp = parseFloat(jsonObj[x].lastName);
          jsonObj[x].lastName = temp;
          temp = parseFloat(jsonObj[x].dateOfBirth);
          jsonObj[x].dateOfBirth = temp;
          temp = parseFloat(jsonObj[x].gender);
          jsonObj[x].gender = temp;
        }

        jsonObj.forEach(async (tag) => {
          bulkTags.push({
            updateOne: {
              filter: {
                empID: tag.empID,
                empType: tag.empType,
                firstName: tag.firstName,
                middleName: tag.middleName,
              },
              update: {
                $set: {
                  empID: tag.empID,
                  empType: tag.empType,
                  firstName: tag.firstName,
                  middleName: tag.middleName,
                  lastName: tag.lastName,
                  dateOfBirth: tag.dateOfBirth,
                  gender: tag.gender,
                },
              },
              upsert: true,
            },
          });
        });
      });
    console.log(
      "🚀 ~ file: employeesController.js:448 ~ Employee.bulkWrite ~ bulkTags",
      bulkTags
    );

    Employee.bulkWrite(bulkTags, (error, result) => {
      if (error) {
        res.status(400).json({ message: error.message });
      } else {
        console.log(
          "🚀 ~ file: employeesController.js:434 ~ Employee.bulkWrite ~ result",
          result
        );
        res.status(201).json({
          message:
            result?.nUpserted > 0
              ? `Imported ${result?.nUpserted} of Employee Data.`
              : `Matched [${result?.nMatched}] existing Employee. No new data is created!`,
        });
      }
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: employeesController.js:415 ~ importEmployee ~ error",
      error
    );
    res.status(500).json({ message: error.message });
  }
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
  importEmployee,
};
