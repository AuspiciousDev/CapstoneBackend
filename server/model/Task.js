const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // taskID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   index: true,
    //   required: true,
    //   auto: true,
    // },
    taskID: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    subjectID: {
      type: String,
      required: true,
    },
    schoolYearID: {
      type: String,
      required: true,
    },

    maxPoints: {
      type: Number,
      required: true,
    },
    empID: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Task", userSchema);
