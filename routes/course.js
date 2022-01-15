const { Mongoose } = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const router = require("express").Router();
const { ObjectId } = require("mongodb");

// ADD NEW STUDENT TO SPECIFIC COURSE
router.put("/add-student", async (req, res) => {
  try {
    // get student info
    var student = await User.findOne({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      userType: "student",
    });
    // get user id
    var studentID = student._id;
    // get course
    var course = await Course.findOne({
      courseName: req.body.courseName,
    });
    // check user and course
    if (!student || !course) {
      res.status(500).json({ error: "user or course is not exists in db." });
      return;
    }
    // update course
    var oldStudents = course.students; // old students

    var newStudents = oldStudents.slice(); //return array, copy by value
    // check if student is already in the course list.
    var alreadyInCourse = false;
    oldStudents.forEach((student) => {
      if (student.studentID.equals(studentID)) {
        alreadyInCourse = true;
      }
    });
    if (alreadyInCourse) {
      res.status(500).json({ error: "user is already signed to the course." });
      return;
    }

    //add new student
    newStudents.push({
      studentName: student.username,
      studentID: studentID,
    });
    var updateResult = await Course.findOneAndUpdate(
      //update the db
      {
        username: course.Name,
        teacher: course.teacher,
        students: course.students,
      },
      {
        username: course.Name,
        teacher: course.teacher,
        students: newStudents,
      },
      { new: true }
    );
    res.status(200).json(updateResult);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE STUDENT FROM SPECIFIC COURSE
router.post("/delete-student", async (req, res) => {
  try {
    // get student info
    var student = await User.findOne({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      userType: "student",
    });
    // get user id
    var studentID = student._id;
    // get course
    var course = await Course.findOne({
      courseName: req.body.courseName,
    });
    // check user and course
    if (!student || !course) {
      res
        .status(500)
        .json({ error: "can't delete, user or course is not exists in db." });
      return;
    }
    // update course
    var oldStudents = course.students; // old students

    var newStudents = oldStudents.slice(); //return array, copy by value
    // check if student is already in the course list.
    var userInCourse = false;
    oldStudents.forEach((student) => {
      if (student.studentID.equals(studentID)) {
        userInCourse = true;
      }
    });
    if (!userInCourse) {
      res.status(500).json({ error: "user is not signed to the course." });
      return;
    }

    //add new student
    newStudents.pop({
      studentName: student.username,
      studentID: studentID,
    });
    var updateResult = await Course.findOneAndUpdate(
      //update the db
      {
        username: course.Name,
        teacher: course.teacher,
        students: course.students,
      },
      {
        username: course.Name,
        teacher: course.teacher,
        students: newStudents,
      },
      { new: true }
    );
    res.status(200).json(updateResult);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET ALL COURSES for specific user
router.post("/:id", async (req, res) => {
  try {
    // get user
    var user = await User.findOne({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    // console.log("server cmd - user", user);
    // search user courses by user id.
    const coursesList =
      user.userType === "student"
        ? await Course.find({ "students.studentID": user._id })
        : await Course.find({ "teacher.teacherID": user._id });
    // console.log("server cmd - courses", coursesList);
    res.status(200).json(coursesList);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// CREATE NEW COURSE
router.put("/create", async (req, res) => {
  try {
    var newCourse = await new Course({
      courseName: req.body.courseName,
      teacher: req.body.teacher,
      students: req.body.students,
    }).save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// CREATE NEW COURSE
router.get("/:courseName", async (req, res) => {
  try {
    var courseName = req.params.courseName;
    const course = Course.findOne({ courseName: courseName });
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// get course by course name and specific user
router.post("/:courseName/:username", async (req, res) => {
  try {
    // get user
    var user = await User.findOne({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    // console.log("server cmd - user", user);
    // console.log("params:", req.params.courseName);
    // search user courses by user id.
    var course;
    user.userType === "student"
      ? (course = await Course.findOne({
          courseName: req.params.courseName,
          "students.studentID": user._id,
        }))
      : (course = await Course.findOne({
          courseName: req.params.courseName,
          "teacher.teacherID": user._id,
        }));
    // console.log("server cmd - courses", course);
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
module.exports = router;
