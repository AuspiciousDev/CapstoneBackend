const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    schoolYearID: {
      type: String,
      required: true,
    },
    enrolledID: {
      type: String,
      required: true,
    },
    studID: {
      type: String,
      required: true,
    },
    levelID: {
      type: String,
      required: true,
    },
    sectionID: {
      type: String,
      required: true,
    },
    departmentID: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrolled", userSchema);
