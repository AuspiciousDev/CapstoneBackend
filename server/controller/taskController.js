const Task = require("../model/Task");

const createDoc = async (req, res) => {
  const {
    taskID,
    taskType,
    subjectID,
    schoolYearID,
    taskTotalScore,
    empID,
    description,
  } = req.body;
  if (
    !taskID ||
    !taskType ||
    !subjectID ||
    !schoolYearID ||
    !taskTotalScore ||
    !empID ||
    !description
  ) {
    return res.status(400).json({ message: "Incomplete Fields!" });
  }
  const duplicate = await Task.findOne({
    taskID,
  })
    .lean()
    .exec();
  if (duplicate) return res.status(409).json({ message: "Duplicate TaskID!" });

  const docObject = {
    taskID,
    taskType,
    subjectID,
    schoolYearID,
    taskTotalScore,
    empID,
    description,
  };
  // docObject.map((v) => v.toLowerCase());
  console.log(docObject);

  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await Task.create(docObject);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
};

const getAllDoc = async (req, res) => {
  const task = await Task.find();
  if (!task) return res.status(204).json({ message: "No record found!" });
  res.status(200).json(task);
};
module.exports = {
  createDoc,
  getAllDoc,
};