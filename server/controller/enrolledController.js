const Enrolled = require("../model/Enrolled");
const Student = require("../model/Student");
const Grade = require("../model/Grade");
const TaskScore = require("../model/TaskScore");
// const getAllDoc = async (req, res) => {
//   const doc = await Enrolled.find().sort({ createdAt: -1 }).lean();
//   if (!doc) return res.status(204).json({ message: "No Data Found!" });
//   res.status(200).json(doc);
// };
const getAllDoc = async (req, res) => {
  // const doc = await Enrolled.find().sort({ createdAt: -1 }).lean();
  const doc = await Enrolled.aggregate([
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
        imgURL: {
          $toString: "$result.imgURL",
        },
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
  if (!doc) return res.status(204).json({ message: "No Data Found!" });
  res.status(200).json(doc);
};
const createDoc = async (req, res) => {
  try {
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
      return res.status(409).json({ message: "Student is not Active!" });
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
  } catch (error) {
    console.log(
      "🚀 ~ file: enrolledController.js:110 ~ createDoc ~ error",
      error
    );
    res.status(500).json({ message: error.message });
  }
  // Retrieve data
};

const getDocByID = async (req, res) => {
  const studID = req?.params?.studID;
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
      $match: {
        studID: `${req?.params?.studID}`,
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
  ]).exec();
  if (!findID) {
    return res.status(400).json({ message: `${sectionID} not found!` });
  }
  console.log(findID);
  res.status(200).json(findID);
};

const deleteDocByID = async (req, res) => {
  try {
    console.log("Delete Enrolled: ", req.body);
    const { enrolledID, schoolYearID, studID } = req.body;
    if (!enrolledID || !schoolYearID || !studID) {
      return res.status(400).json({ message: "ID required!" });
    }
    const findID = await Enrolled.findOne({ enrolledID }).exec();
    console.log("Enrolled FindID: ", findID);
    if (!findID) {
      return res.status(400).json({ message: `${enrolledID} not found!` });
    }
    const findGrade = await Grade.findOne({ studID }).exec();
    console.log("Enrolled FindGrade: ", findGrade);
    if (findGrade) {
      return res.status(400).json({
        message: `Cannot delete ${findID.studID} in Enrolled, A record/s currently exists with ${findID.studID} in Grades. To delete the record, Remove all records that contains ${findID.studID} and try again.`,
      });
    }
    const findTask = await TaskScore.findOne({ studID, schoolYearID }).exec();

    if (findTask) {
      return res.status(400).json({
        message: `Cannot delete ${findID.studID} in Enrolled, A record/s currently exists with ${findID.studID} in Tasks. To delete the record, Remove all records that contains ${findID.studID} and try again.`,
      });
    }
    const deleteItem = await findID.deleteOne({ enrolledID });
    res.status(201).json(deleteItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const toggleStatusById = async (req, res) => {
  try {
    console.log("Enrolled Toggle :", req.body);
    const { enrolledID, studID, schoolYearID, status } = req.body;
    if (!enrolledID || !studID || !schoolYearID) {
      return res.status(400).json({ message: "ID required to toggle status!" });
    }

    const findID = await Enrolled.findOne({
      enrolledID,
      studID,
      schoolYearID,
    }).exec();
    if (!findID) {
      return res
        .status(400)
        .json({ message: `${studID} not found in year ${schoolYearID} !` });
    }
    const updateItem = await Enrolled.findOneAndUpdate(
      { enrolledID: enrolledID },
      {
        status,
      }
    );

    if (!updateItem) {
      return res.status(400).json({ message: "No Student" });
    }
    // const result = await response.save();
    console.log("Enrolled update : ", updateItem);
    res.json(updateItem);
  } catch (error) {
    console.log(
      "🚀 ~ file: enrolledController.js:234 ~ toggleStatusById ~ error",
      error
    );
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createDoc,
  getAllDoc,
  getDocByID,
  //   updateDocByID,
  deleteDocByID,
  toggleStatusById,
};
