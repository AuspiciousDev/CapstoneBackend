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
    taskScoreID: {
      type: String,
      required: true,
    },
    taskID: {
      type: String,
      required: true,
    },

    studID: {
      type: String,
      required: true,
    },

    taskScore: {
      type: Number,
      required: true,
    },

    empID: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("TaskScore", userSchema);
