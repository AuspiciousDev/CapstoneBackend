const Task = require("../model/Task");
const TaskScore = require("../model/TaskScore");

const createDoc = async (req, res) => {
  const { taskID, studID, subjectID, taskScore, empID, description } = req.body;
  console.log(req.body);
  if (!taskID || !studID || !subjectID || !taskScore || !empID) {
    return res.status(400).json({ message: "Incomplete Fields!" });
  }
  const duplicate = await TaskScore.findOne({
    taskID,
    studID,
    subjectID,
  })
    .lean()
    .exec();
  if (duplicate)
    return res.status(409).json({ message: "Duplicate Task Score!" });

  const docObject = {
    taskID,
    studID,
    subjectID,
    taskScore,
    empID,
    description,
  };
  console.log(docObject);

  try {
    // const empObjectRes = await Employee.create(empObject);
    const response = await TaskScore.create(docObject);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
    console.error(error);
  }
};

const getAllDoc1 = async (req, res) => {
  const task = await TaskScore.find();
  if (!task) return res.status(204).json({ message: "No record found!" });
  res.status(200).json(task);
};
const getAllDoc = async (req, res) => {
  const task = await TaskScore.aggregate([
    {
      $lookup: {
        from: "tasks",
        localField: "taskID",
        foreignField: "taskID",
        as: "profile",
      },
    },
    {
      $unwind: {
        path: "$profile",
      },
    },
    {
      $set: {
        taskName: {
          $toString: "$profile.taskName",
        },
        taskType: {
          $toString: "$profile.taskType",
        },
        maxPoints: {
          $toString: "$profile.maxPoints",
        },
      },
    },
  ]);
  if (!task) return res.status(204).json({ message: "No record found!" });
  res.status(200).json(task);
};
const deleteByDocID = async (req, res) => {
  try {
    const { taskScoreID } = req.body;
    if (!taskScoreID) {
      return res.status(400).json({ message: "Task ID required!" });
    }
    const findID = await TaskScore.findOne({ taskScoreID }).exec();
    if (!findID) {
      return res.status(400).json({ message: `${taskScoreID} not found!` });
    }

    const deleteItem = await findID.deleteOne({ taskScoreID });
    res.status(200).json(deleteItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createDoc,
  getAllDoc,
  deleteByDocID,
};
