const SchoolYear = require("../model/SchoolYear");
const Enrolled = require("../model/Enrolled");
const Grade = require("../model/Grade");

const getAllDoc = async (req, res) => {
  const doc = await SchoolYear.find().sort({ schoolYearID: -1 }).lean();
  if (!doc) return res.status(204).json({ message: "No Data Found!" });
  res.status(200).json(doc);
};

const createDoc = async (req, res) => {
  // Retrieve data
  try {
    const { schoolYearID, schoolYear, description, createdBy } = req.body;

    // Validate Data if given
    if (!schoolYearID || !schoolYear || !createdBy) {
      return res.status(400).json({ message: "All Fields are required!" });
    }
    const duplicate = await SchoolYear.findOne({
      schoolYearID,
    })
      .lean()
      .exec();
    if (duplicate)
      return res
        .status(409)
        .json({ message: `Duplicate School Year ${schoolYearID}!` });

    const findActive = await SchoolYear.findOne({ status: true }).exec();
    console.log("findActive : ", findActive);
    if (!findActive) {
      // Check for Duplicate Data

      // Create Object
      const docObject = { schoolYearID, schoolYear, description, createdBy };

      const response = await SchoolYear.create(docObject);
      if (response) res.status(201).json(response);
    } else {
      return (
        res.status(400).json({
          message: `School Year ${findActive.schoolYearID} is still active!`,
        }),
        console.log(
          `School Year : School Year ${findActive.schoolYearID} is still active!`
        )
      );
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
const getDocActive = async (req, res) => {
  const findID = await SchoolYear.findOne({ status: true }).exec();
  if (!findID) {
    return res
      .status(400)
      .json({ message: ` No Active School Year not found!` });
  }
  res.status(200).json(findID);
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
    return res.status(400).json({ error: "No School Year" });
  }
  //const result = await response.save();
  res.json(updateItem);
};

const deleteDocByID = async (req, res) => {
  const { schoolYearID } = req.body;
  if (!schoolYearID) {
    return res.status(400).json({ message: "School ID is required!" });
  }
  const findID = await SchoolYear.findOne({ schoolYearID }).exec();
  if (!findID) {
    return res.status(400).json({ message: `${schoolYearID} not found!` });
  }
  const findGrade = await Grade.find({ schoolYearID });
  if (findGrade.length > 0) {
    return res.status(400).json({
      message: `Cannot delete year ${schoolYearID}, A records currently exists with year ${schoolYearID}. To delete the record, Remove all records that contains ${schoolYearID} `,
    });
  }
  const findEnrolled = await Enrolled.find({ schoolYearID });
  if (findEnrolled.length > 0) {
    return res.status(400).json({
      message: `Cannot delete year ${schoolYearID}, A records currently exists with year ${schoolYearID}. To delete the record, Remove all records that contains ${schoolYearID} `,
    });
  }

  const deleteItem = await findID.deleteOne({ schoolYearID });
  res.json(deleteItem);
};

const toggleStatusById = async (req, res) => {
  const { schoolYearID, status } = req.body;
  if (!schoolYearID) {
    return res.status(400).json({ message: "ID required!" });
  }
  console.log("Request : ", req.body);

  const findActive = await SchoolYear.findOne({ status: true }).exec();
  console.log("findActive : ", findActive);
  if (!findActive) {
    const updateItem = await SchoolYear.findOneAndUpdate(
      { schoolYearID },
      {
        status,
      }
    );
    //const result = await response.save();
    res.json(updateItem);
  } else {
    if (findActive.schoolYearID === schoolYearID) {
      console.log(`New Active School Year : ${schoolYearID}`);
      const updateItem = await SchoolYear.findOneAndUpdate(
        { schoolYearID },
        {
          status,
        }
      );
      //const result = await response.save();
      if (status === false) {
        const updateLev = await Enrolled.updateMany(
          { schoolYearID: { $in: schoolYearID.toLowerCase() } },
          { $set: { status: status } }
        );
        if (!updateLev) {
          return res.status(400).json({ message: "No Level" });
        }
      }
      res.status(200).json(updateItem);
    } else {
      return (
        res.status(400).json({
          message: `School Year ${findActive.schoolYearID} is still active!`,
        }),
        console.log(
          `School Year : School Year ${findActive.schoolYearID} is still active!`
        )
      );
    }
  }
};

module.exports = {
  createDoc,
  getAllDoc,
  getDocByID,
  updateDocByID,
  deleteDocByID,
  toggleStatusById,
  getDocActive,
};
