const SchoolYear = require("../model/SchoolYear");

const getAllDoc = async (req, res) => {
  const doc = await SchoolYear.find().sort({ schoolYearID: -1 }).lean();
  if (!doc) return res.status(204).json({ message: "No Data Found!" });
  res.status(200).json(doc);
};

const createDoc = async (req, res) => {
  // Retrieve data
  const { schoolYearID, title, description } = req.body;
  // Validate Data if given
  if (!schoolYearID || !title) {
    return res.status(400).json({ message: "All Fields are required!!title" });
  }
  // Check for Duplicate Data
  const duplicate = await SchoolYear.findOne({
    schoolYearID,
  })
    .lean()
    .exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: `Duplicate School Year ${schoolYearID}!` });

  // Create Object
  const docObject = { schoolYearID, title, description };
  // Create and Store new Doc
  // const createObj = await SchoolYear.create(docObject);
  // if (createObj) {
  //   res.status(201).json({ message: `${schoolYearID}-${title} created!` });
  // } else {
  //   res.status(400).json({ message: "Invalid Data received!" });
  // }

  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await SchoolYear.create(docObject);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};
const getDocByID = async (req, res) => {
  const { schoolYearID } = req.body;
  if (!schoolYearID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await SchoolYear.findOne({ schoolYearID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${schoolYearID} not found!` });
  }
  res.json(findID);
};
const updateDocByID = async (req, res) => {
  const { schoolYearID } = req.body;
  if (!schoolYearID) {
    return res.status(400).json({ message: "ID required!" });
  }

  const findID = await SchoolYear.findOne({ schoolYearID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${schoolYearID} not found!` });
  }
  const updateItem = await SchoolYear.findOneAndUpdate(
    { schoolYearID },
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
const findActiveSchoolYear = async (req, res) => {
  const { schoolYearID, active } = req.body;
  if (!schoolYearID) {
    return res.status(400).json({ message: "ID required!" });
  }

  const findActive = await SchoolYear.find({ active: true }).exec();
  console.log(findActive);
  if (findActive.length === 0) {
    return res.status(400).json({ message: `Nothing is active!` });
  } else {
    return res
      .status(400)
      .json({ message: `${findActive[0].schoolYearID} is still active!` });
  }
};
const deleteDocByID = async (req, res) => {
  const { schoolYearID } = req.body;
  if (!schoolYearID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await SchoolYear.findOne({ schoolYearID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${schoolYearID} not found!` });
  }
  const deleteItem = await findID.deleteOne({ schoolYearID });
  res.json(deleteItem);
};

module.exports = {
  createDoc,
  getAllDoc,
  getDocByID,
  updateDocByID,
  findActiveSchoolYear,
  deleteDocByID,
};
