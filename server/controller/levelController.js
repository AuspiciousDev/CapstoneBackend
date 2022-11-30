const Level = require("../model/Level");
const Section = require("../model/Section");

const getAllDoc = async (req, res) => {
  // const doc = await Level.find().sort({ createdAt: -1 }).lean();
  const doc = await Level.aggregate([
    {
      $lookup: {
        from: "departments",
        localField: "departmentID",
        foreignField: "departmentID",
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
          $toString: "$result.depName",
        },
        depStatus: {
          $toBool: "$result.status",
        },
      },
    },
  ]);
  if (!doc) return res.status(204).json({ message: "No Data Found!" });
  res.status(200).json(doc);
};
// >>
/**
 * *FRT Working
 */
const createDoc = async (req, res) => {
  // Retrieve data
  console.log(req.body);
  const { levelID, levelNum, departmentID } = req.body;

  // Validate Data if given
  if (!levelID || !levelNum || !departmentID) {
    return res.status(400).json({ message: "All Fields are required!" });
  }
  // Check for Duplicate Data
  const duplicate = await Level.findOne({
    levelID,
  })
    .lean()
    .exec();
  if (duplicate) return res.status(409).json({ message: "Duplicate Level!" });

  // Create Object
  const docObject = { levelID, levelNum, departmentID };
  // Create and Store new Doc
  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await Level.create(docObject);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};
const getDocByID = async (req, res) => {
  const { levelID } = req.body;
  if (!levelID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Level.findOne({ levelID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${levelID} not found!` });
  }
  res.json(findID);
};

const updateDocByID = async (req, res) => {
  const { levelID } = req.body;
  if (!levelID) {
    return res.status(400).json({ message: "ID required!" });
  }

  const findID = await Level.findOne({ levelID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${levelID} not found!` });
  }
  const updateItem = await Level.findOneAndUpdate(
    { levelID },
    {
      ...req.body,
    }
  );

  if (!updateItem) {
    return res.status(400).json({ error: "No Level" });
  }
  //const result = await response.save();
  res.json(updateItem);
};

const deleteDocByID = async (req, res) => {
  console.log(req.body);
  const { levelID } = req.body;
  if (!levelID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Level.findOne({ levelID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${levelID} not found!` });
  }
  const deleteItem = await findID.deleteOne({ levelID });
  res.status(200).json(deleteItem);
};

const toggleStatusById = async (req, res) => {
  const { levelID, status } = req.body;
  if (!levelID) {
    return res.status(400).json({ message: "ID required!" });
  }
  console.log(req.body);
  console.log(levelID.toLowerCase());

  const findID = await Level.findOne({
    levelID: levelID.toLowerCase(),
  }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${levelID} not found!` });
  }
  const updateItem = await Level.findOneAndUpdate(
    { levelID: levelID.toLowerCase() },
    {
      status,
    }
  );
  if (status === false) {
    const updateLev = await Section.updateMany(
      { levelID: { $in: levelID.toLowerCase() } },
      { $set: { status: status } }
    );
    if (!updateLev) {
      return res.status(400).json({ message: "No Level" });
    }
  }

  if (!updateItem) {
    return res.status(400).json({ message: "No School Year" });
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
