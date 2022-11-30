const Enrolled = require("../model/Enrolled");
const Student = require("../model/Student");
const getAllDoc = async (req, res) => {
  const doc = await Enrolled.find().sort({ createdAt: -1 }).lean();
  if (!doc) return res.status(204).json({ message: "No Data Found!" });
  res.status(200).json(doc);
};
const createDoc = async (req, res) => {
  // Retrieve data
  const {
    enrollmentID,
    schoolYearID,
    studID,
    levelID,
    sectionID,
    departmentID,
  } = req.body;

  console.log("New Enrollee: ", req.body);
  // Validate Data if given
  if (
    !enrollmentID ||
    !schoolYearID ||
    !studID ||
    !levelID ||
    !sectionID ||
    !departmentID
  ) {
    return res.status(400).json({ message: "All Fields are required!" });
  }
  // Check for Duplicate Data
  const duplicate = await Enrolled.findOne({
    studID: studID,
    schoolYearID: schoolYearID,
  })
    .lean()
    .exec();
  if (duplicate)
    return res.status(409).json({ message: "Duplicate Enrollee!" });
  const isActive = await Student.findOne({
    studID: studID,
  });
  if (!isActive)
    return res.status(409).json({ message: "Student does not exists!!" });
  if (isActive.status === false)
    return res.status(409).json({ message: "Student not Active!" });
  // Create Object
  const docObject = {
    enrolledID: enrollmentID,
    schoolYearID,
    studID,
    levelID,
    sectionID,
    departmentID,
  };
  // Create and Store new Doc
  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await Enrolled.create(docObject);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};

const getDocByID = async (req, res) => {
  if (!req?.params?.studID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Enrolled.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "studID",
        foreignField: "studID",
        as: "result",
      },
    },
    {
      $unwind: {
        path: "$result",
      },
    },
    {
      $set: {
        firstName: {
          $toString: "$result.firstName",
        },
        middleName: {
          $toString: "$result.middleName",
        },
        lastName: {
          $toString: "$result.lastName",
        },
        gender: {
          $toString: "$result.gender",
        },
        email: {
          $toString: "$result.email",
        },
      },
    },
  ]);
  if (!findID) {
    return res.status(400).json({ message: `${sectionID} not found!` });
  }
  res.status(200).json(findID);
};

const deleteDocByID = async (req, res) => {
  const { enrolledID } = req.body;
  if (!enrolledID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Enrolled.findOne({ enrolledID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${enrolledID} not found!` });
  }
  const deleteItem = await findID.deleteOne({ enrolledID });
  res.status(201).json(deleteItem);
};
module.exports = {
  createDoc,
  getAllDoc,
  getDocByID,
  //   updateDocByID,
  deleteDocByID,
};
