const Subject = require("../model/Subject");

const createDoc = async (req, res) => {
  const { subjectID, levelID, subjectName, description } = req.body;
  if (!subjectID) {
    return res.status(400).json({ message: "ID is required!" });
  }
  const duplicate = await Subject.findOne({
    subjectID,
  })
    .lean()
    .exec();
  if (duplicate) return res.status(409).json({ message: "Duplicate Subject!" });

  const docObject = { subjectID, levelID, subjectName, description };
  // docObject.map((v) => v.toLowerCase());
  console.log(docObject);

  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await Subject.create(docObject);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};
const getAllDoc = async (req, res) => {
  const subject = await Subject.find();
  if (!subject) return res.status(204).json({ message: "No record found!" });
  res.status(200).json(subject);
};
const getAllDocByLevel = async (req, res) => {
  console.log("getAllDocByLevel :",req?.params?.levelID);
  if (!req?.params?.levelID) {
    return res.status(400).json({ message: "LevelID is required!" });
  }
  const subject = await Subject.find({ levelID: req?.params?.levelID });
  if (!subject) return res.status(204).json({ message: "No record found!" });
  res.status(200).json(subject);
};

const getDocByID = async (req, res) => {
  if (!req?.params?.searchID) {
    return res.status(400).json({ message: "ID is required!" });
  }
  const subjectID = req?.params?.searchID.toLowerCase();
  console.log("ID>>", subjectID);
  const response = await Subject.findOne({ subjectID: subjectID }).exec();
  if (!response) {
    return res
      .status(400)
      .json({ message: `ID ${req.params.searchID} not found` });
  }
  res.json(response);
};

const updateDocByID = async (req, res) => {
  if (!req?.params?.searchID) {
    return res.status(400).json({ message: "ID params is required!" });
  }
  const subjectID = req.params.searchID.toLowerCase();
  const response = await Subject.findOne({ subjectID: subjectID }).exec();
  if (!response) {
    return res.status(204).json({ message: "ID required!" });
  }
  const update = await Subject.findOneAndUpdate(
    { subjectID: subjectID },
    {
      ...req.body,
    }
  );

  if (!update) {
    return res.status(400).json({ error: "No record found!" });
  }
  res.json(update);
};
const deleteDocByID = async (req, res) => {
  const { subjectID } = req.body;
  if (!subjectID) {
    return res.status(400).json({ message: "ID required!" });
  }
  const findID = await Subject.findOne({ subjectID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${subjectID} not found!` });
  }
  const deleteItem = await findID.deleteOne({ subjectID });
  res.json(deleteItem);
};

const toggleStatusById = async (req, res) => {
  console.log(req.body);
  const { subjectID, status } = req.body;
  if (!subjectID) {
    return res.status(400).json({ message: "ID required!" });
  }
  console.log(req.body);
  console.log(subjectID.toLowerCase());

  const findID = await Subject.findOne({
    subjectID: subjectID.toLowerCase(),
  }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${subjectID} not found!` });
  }
  const updateItem = await Subject.findOneAndUpdate(
    { subjectID: subjectID.toLowerCase() },
    {
      status,
    }
  );

  if (!updateItem) {
    return res.status(400).json({ message: "No Subject" });
  }
  //const result = await response.save();
  res.json(updateItem);
  console.log(updateItem);
};
module.exports = {
  createDoc,
  getAllDoc,
  getDocByID,
  updateDocByID,
  deleteDocByID,
  toggleStatusById,
  getAllDocByLevel,
};
