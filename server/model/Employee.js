const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    imgURL: {
      type: String,
      default: "",
    },
    empID: {
      type: String,
      required: true,
    },

    empType: [
      {
        type: Number,
        required: true,
      },
    ],
    SubjectLoads: [
      {
        type: String,
      },
    ],
    LevelLoads: [
      {
        type: String,
      },
    ],
    SectionLoads: [
      {
        type: String,
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
    },

    dateOfBirth: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    placeOfBirth: {
      type: String,
    },
    suffix: {
      type: String,
    },
    civilStatus: {
      type: String,
    },
    nationality: {
      type: String,
    },
    religion: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    province: {
      type: String,
    },

    mobile: {
      type: String,
    },
    telephone: {
      type: String,
    },
    emergencyName: {
      type: String,
    },
    emergencyRelationship: {
      type: String,
    },
    emergencyNumber: {
      type: String,
    },
    refreshToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", userSchema);

// [
//   {
//     type: String,
//     default: "Employee",
//   },
// ],
