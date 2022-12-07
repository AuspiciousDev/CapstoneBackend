const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    imgURL: {
      type: String,
      default: "",
    },
    studID: {
      type: String,
      required: true,
    },
    LRN: {
      type: String,
      required: true,
    },
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

module.exports = mongoose.model("Student", userSchema);

// [
//   {
//     type: String,
//     default: "Employee",
//   },
// ],
