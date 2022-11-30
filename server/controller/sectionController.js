const Section = require("../model/Section");
const Enrolled = require("../model/Enrolled");

const getAllDoc = async (req, res) => {
  // const doc = await Section.find().sort({ createdAt: -1 }).lean();
  const doc = await Section.aggregate([
    {
      $lookup: {
        from: "levels",
        localField: "levelID",
        foreignField: "levelID",
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
        depName: {
          $toString: "$result.levelNum",
        },
        lvlStatus: {
          $toBool: "$result.status",
        },
      },
    },
  ]);
  if (!doc) return res.status(204).json({ message: "No Data Found!" });
  res.status(200).json(doc);
};

const createDoc = async (req, res) => {
  // Retrieve data
  const { sectionID, departmentID, levelID, sectionName } = req.body;

  // Validate Data if given
  if (!sectionID || !departmentID || !levelID || !sectionName) {
    return res.status(400).json({ message: "All Fields are required!" });
  }
  // Check for Duplicate Data
  const duplicate = await Section.findOne({
    sectionID,
  })
    .lean()
    .exec();
  if (duplicate) return res.status(409).json({ message: "Duplicate Section!" });

  // Create Object
  const docObject = { sectionID, departmentID, levelID, sectionName };
  // Create and Store new Doc
  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await Section.create(docObject);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};
const getDocByID = async (req, res) => {
  const { sectionID } = req.body;
  if (!sectionID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Section.findOne({ sectionID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${sectionID} not found!` });
  }
  res.json(findID);
};
const updateDocByID = async (req, res) => {
  const { sectionID } = req.body;
  if (!sectionID) {
    return res.status(400).json({ message: "ID required!" });
  }

  const findID = await Section.findOne({ sectionID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${sectionID} not found!` });
  }
  const updateItem = await Section.findOneAndUpdate(
    { sectionID },
    {
      ...req.body,
    }
  );

  if (!updateItem) {
    return res.status(400).json({ error: "No Section" });
  }
  //const result = await response.save();
  res.json(updateItem);
};
const deleteDocByID = async (req, res) => {
  const { sectionID } = req.body;
  if (!sectionID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Section.findOne({ sectionID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${sectionID} not found!` });
  }

  const findEnroll = await Enrolled.find({ sectionID });
  console.log(findEnroll);
  if (findEnroll.length > 0) {
    return res.status(400).json({
      message: `Cannot delete ${sectionID} in Enrolled, A record/s currently exists with ${sectionID}. To delete the record, Remove all records that contains ${sectionID} `,
    });
  }

  const deleteItem = await findID.deleteOne({ sectionID });
  res.status(201).json(deleteItem);
};

const toggleStatusById = async (req, res) => {
  console.log(req.body);
  const { sectionID, status } = req.body;
  if (!sectionID) {
    return res.status(400).json({ message: "ID required!" });
  }
  console.log(req.body);
  console.log(sectionID.toLowerCase());

  const findID = await Section.findOne({
    sectionID: sectionID.toLowerCase(),
  }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${sectionID} not found!` });
  }
  const updateItem = await Section.findOneAndUpdate(
    { sectionID: sectionID.toLowerCase() },
    {
      status,
    }
  );

  if (!updateItem) {
    return res.status(400).json({ message: "No Department" });
  }
  //const result = await response.save();
  res.json(updateItem);
};
module.exports = {
  createDoc,
  getAllDoc,
  getDocByID,
  updateDocByID,
  deleteDocByID,
  toggleStatusById,
};
