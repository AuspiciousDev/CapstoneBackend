const Task = require("../model/Task");
const Grade = require("../model/Grade");
const TaskScore = require("../model/TaskScore");

const createDoc = async (req, res) => {
  const {
    taskID,
    taskType,
    subjectID,
    levelID,
    sectionID,
    maxPoints,
    empID,
    description,
    schoolYearID,
    taskName,
  } = req.body;
  console.log(req.body);
  if (
    !taskID ||
    !taskName ||
    !taskType ||
    !subjectID ||
    !levelID ||
    !sectionID ||
    !maxPoints ||
    !empID ||
    !schoolYearID
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
    taskName,
    subjectID,
    levelID,
    sectionID,
    schoolYearID,
    maxPoints,
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
const toggleStatusById = async (req, res) => {
  console.log(req.body);
  const { taskID, status } = req.body;
  if (!taskID) {
    return res.status(400).json({ message: "Task ID required!" });
  }

  const findID = await Task.findOne({
    taskID: taskID.toLowerCase(),
  }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${taskID} not found!` });
  }
  // const findGrade = await Grade.findOne({ taskID }).exec();
  // if (findGrade) {
  //   return res.status(400).json({
  //     message: `Cannot delete ${findID.taskID} in Tasks, A record/s currently exists with ${findID.taskID} in Grades. To delete the record, Remove all records that contains ${findID.taskID} and try again.`,
  //   });
  // }
  // const findScore = await TaskScore.findOne({ taskID }).exec();
  // if (findScore) {
  //   return res.status(400).json({
  //     message: `Cannot delete ${findID.taskID} in Tasks, A record/s currently exists with ${findID.taskID} in Scores. To delete the record, Remove all records that contains ${findID.taskID} and try again.`,
  //   });
  // }
  const updateItem = await Task.findOneAndUpdate(
    { taskID: taskID.toLowerCase() },
    {
      status,
    }
  );

  if (!updateItem) {
    return res.status(400).json({ message: "No Task!" });
  }
  //const result = await response.save();
  res.json(updateItem);
  console.log(updateItem);
};

const deleteByDocID = async (req, res) => {
  const { taskID } = req.body;
  if (!taskID) {
    return res.status(400).json({ message: "Task ID required!" });
  }
  const findID = await Task.findOne({ taskID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${taskID} not found!` });
  }
  const findTaskScore = await TaskScore.findOne({ taskID });
  console.log(findTaskScore);
  if (findTaskScore) {
    return res.status(400).json({
      message: `Cannot delete ${taskID} in Tasks, A record/s currently exists with ${taskID} in Scores. To delete the record, Remove all records that contains ${taskID} `,
    });
  }
  const deleteItem = await findID.deleteOne({ taskID });
  res.status(200).json(deleteItem);
};
module.exports = {
  createDoc,
  getAllDoc,
  toggleStatusById,
  deleteByDocID,
};
