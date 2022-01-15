const mongoose = require("mongoose");
const User = require("../models/User");

const CourseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true, unique: true },
    teacher: {
      teacherName: { type: String },
      teacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    students: [
      {
        studentName: { type: String },
        studentID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { collection: "courses" },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
