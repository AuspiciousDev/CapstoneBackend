const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    schoolYearID: {
      type: String,
      required: true,
    },
    schoolYear: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdBy: {
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
module.exports = mongoose.model("SchoolYear", userSchema);
