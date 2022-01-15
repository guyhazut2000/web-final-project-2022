const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");

const GradeSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    labs: [
      {
        labNumber: { type: Number },
        labGrade: { type: Number },
      },
    ],
    exercises: [
      {
        exerciseNumber: { type: Number },
        exerciseGrade: { type: Number },
      },
    ],
  },
  { collection: "grades" },
  { strict: false },
  { timestamps: true }
);

GradeSchema.index({ studentID: 1, courseID: 1 }, { unique: true });
module.exports = mongoose.model("Grade", GradeSchema);
