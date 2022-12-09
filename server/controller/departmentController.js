const Department = require("../model/Department");
const Level = require("../model/Level");
const Section = require("../model/Section");

const getAllDoc = async (req, res) => {
  const doc = await Department.find().sort({ createdAt: -1 }).lean();
  if (!doc) return res.status(204).json({ message: "No Data Found!" });
  res.status(200).json(doc);
};

const createDoc = async (req, res) => {
  // Retrieve data
  const { departmentID, depName, description } = req.body;

  // Validate Data if given
  if (!departmentID || !depName) {
    return res.status(400).json({ message: "All Fields are required!" });
  }
  // Check for Duplicate Data
  const duplicate = await Department.findOne({
    departmentID,
  })
    .lean()
    .exec();
  if (duplicate)
    return res.status(409).json({ message: "Duplicate Department!" });

  // Create Object
  const docObject = { departmentID, depName, description };
  // Create and Store new Doc
  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await Department.create(docObject);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};
const getDocByID = async (req, res) => {
  const { departmentID } = req.body;
  if (!departmentID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Department.findOne({ departmentID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${departmentID} not found!` });
  }
  res.json(findID);
};
const updateDocByID = async (req, res) => {
  const { departmentID } = req.body;
  if (!departmentID) {
    return res.status(400).json({ message: "ID required!" });
  }

  const findID = await Department.findOne({ departmentID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${departmentID} not found!` });
  }
  const updateItem = await Department.findOneAndUpdate(
    { departmentID },
    {
      ...req.body,
    }
  );

  if (!updateItem) {
    return res.status(400).json({ error: "No Department" });
  }
  //const result = await response.save();
  res.json(updateItem);
};
const deleteDocByID = async (req, res) => {
  const { departmentID } = req.body;
  if (!departmentID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Department.findOne({ departmentID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${departmentID} not found!` });
  }
  const findEnrolled = await Level.find({ departmentID });
  if (findEnrolled.length > 0) {
    return res.status(400).json({
      message: `Cannot delete ${departmentID}, A record/s currently exists with Department ID: [${departmentID}] in Levels. To delete the record, Remove all record/s that contains Department ID: [${departmentID}].`,
    });
  }
  const deleteItem = await findID.deleteOne({ departmentID });
  res.status(201).json(deleteItem);
};

const toggleStatusById = async (req, res) => {
  const { departmentID, status } = req.body;
  if (!departmentID) {
    return res.status(400).json({ message: "ID required!" });
  }
  console.log(req.body);
  console.log(departmentID.toLowerCase());

  const findID = await Department.findOne({
    departmentID: departmentID.toLowerCase(),
  }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${departmentID} not found!` });
  }
  const updateDep = await Department.findOneAndUpdate(
    { departmentID: departmentID.toLowerCase() },
    {
      status,
    }
  );
  if (status === false) {
    const updateLev = await Level.updateMany(
      { departmentID: { $in: departmentID.toLowerCase() } },
      { $set: { status: status } }
    );
    if (!updateLev) {
      return res.status(400).json({ message: "No Level" });
    }
    const updateSec = await Section.updateMany(
      { departmentID: { $in: departmentID.toLowerCase() } },
      { $set: { status: status } }
    );
    if (!updateSec) {
      return res.status(400).json({ message: "No Section" });
    }
  }

  if (!updateDep) {
    return res.status(400).json({ message: "No Department" });
  }

  //const result = await response.save();
  res.json(updateDep);
};

module.exports = {
  createDoc,
  getAllDoc,
  getDocByID,
  updateDocByID,
  deleteDocByID,
  toggleStatusById,
};
