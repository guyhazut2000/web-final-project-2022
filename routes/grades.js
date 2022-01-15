const mongoose = require("mongoose");
const Grade = require("../models/Grade");
const router = require("express").Router();
const User = require("../models/User");
const Course = require("../models/Course");

// GET ALL GRADES
router.get("/", async (req, res) => {
  try {
    /*
    sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    */
    // User.createIndexes();
    const allGrades = await Grade.find();
    res.status(200).json(allGrades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// delete grade
router.post("/delete-grade", async (req, res) => {
  try {
    data = req.body;
    console.log("delete grade: ", data);
    switch (req.body.type) {
      case "lab":
        var grade = await Grade.findOne({
          "labs._id": data._id,
        });
        // console.log("grade: ", grade);
        // console.log("data: ", mongoose.Types.ObjectId(data._id));
        var deletedGrade = await Grade.updateOne(
          { _id: grade._id },
          { $pull: { labs: { _id: mongoose.Types.ObjectId(data._id) } } },
          { new: true }
        );
        // console.log("deletedGrade: ", deletedGrade);
        break;
      case "exercise":
        // grade = await Grade.findOneAndDelete({
        //   "exercises._id": data._id,
        // });
        // break;
        grade = await Grade.findOne({
          "exercises._id": data._id,
        });
        deletedGrade = await Grade.updateOne(
          { _id: grade._id },
          { $pull: { exercises: { _id: mongoose.Types.ObjectId(data._id) } } },
          { new: true }
        );
        break;

      default:
        break;
    }

    console.log("res", grade);
    res.status(200).json(grade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET ALL GRADES by specific user
router.get("/:user", async (req, res) => {
  try {
    // get user
    const user = await User.findOne({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    // get course
    const coursesList = await Course.find(); // return array of courses
    const allGrades = await Grade.find({
      studentID: user._id,
    });
    // console.log(allGrades);
    res.status(200).json(allGrades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL GRADES by specific course
router.get("/all-grades/:course", async (req, res) => {
  try {
    var courseName = req.params.course;
    console.log(courseName);
    const course = await Course.findOne({ courseName: courseName });

    const allGrades = await Grade.find({ courseID: course._id });
    // const allGrades = await Grade.find({
    //   studentID: user._id,
    // });
    // console.log(allGrades);
    res.status(200).json(allGrades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL GRADES by specific user and specific course
router.post("/:course/:user", async (req, res) => {
  try {
    /*
    sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    */
    // User.createIndexes();
    // get user
    // console.log(req.body);
    const user = await User.findOne({
      username: req.params.user,
      email: req.body.email,
      password: req.body.password,
    });
    console.log(user);
    // get course
    const course = await Course.findOne({
      courseName: req.params.course,
    });
    // console.log(course);
    // if user or coruse is un defined return error
    if (!user || !course) {
      res.status(500).json({ error: "undefined user or course error" });
      console.log("error");
      return;
    }
    // get grades
    const allGrades = await Grade.findOne({
      studentID: user._id,
      courseID: course._id,
    });
    console.log(allGrades);
    res.status(200).json(allGrades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE NEW GRADE
router.put("/", async (req, res) => {
  try {
    /*
    sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    */
    Grade.createIndexes();
    await new Grade(req.body).save();
    console.log(req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE COURSE GRADE
router.post("/:course/:user/delete-grade", async (req, res) => {
  try {
    /*
    sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    */
    var courseName = req.params.course;
    var userName = req.params.user;
    var type = req.body.type;
    var number = req.body.gradeNumber;
    if (
      !(req.body.username === userName) ||
      !(req.body.courseName === courseName)
    ) {
      res.status(500).json({
        error: "req.params and req.body data is not matched " + err.message,
      });
      return;
    }
    const user = await User.findOne({
      username: req.params.user,
      email: req.body.email,
      password: req.body.password,
    });
    // get course
    const course = await Course.findOne({
      courseName: courseName,
    });
    var grade = await Grade.findOne({
      studentID: user._id,
      courseID: course._id,
    });
    // check if there is any labs

    switch (type) {
      case "lab":
        if (grade.labs == null) {
          res.status(500).json("the user has no labs.");
          console.log("lab number is not exists.");
          return;
        }
        var labs = grade.labs.slice();
        // check if grade number is exists
        var isExists = false;
        labs.forEach((lab) => {
          if (lab.labNumber === number) {
            isExists = true;
          }
        });
        if (!isExists) {
          res.status(500).json("lab number is not exists.");
          console.log("lab number is not exists.");
          return;
        }
        // delete old lab grade
        labs = labs.filter((lab) => {
          return lab.labNumber !== number;
        });
        // update lab grade
        var oldGrade = await Grade.findOneAndUpdate(
          {
            studentID: user._id,
            courseID: course._id,
          },
          {
            studentID: user._id,
            courseID: course._id,
            labs: labs,
          },
          { new: true }
        );
        break;
      case "exercise":
        if (grade.exercises == null) {
          res.status(500).json("the user has no exercises.");
          console.log("exercise number is not exists.");
          return;
        }
        var exercises = grade.exercises.slice();
        // check if grade number is exists
        var isExists = false;
        exercises.forEach((exercise) => {
          if (exercise.exerciseNumber === number) {
            isExists = true;
          }
        });
        if (!isExists) {
          res.status(500).json("exercise number is not exists.");
          console.log("exercise number is not exists.");
          return;
        }
        // delete old lab grade
        exercises = exercises.filter((exercise) => {
          return exercise.exerciseNumber !== number;
        });
        // update lab grade
        var oldGrade = await Grade.findOneAndUpdate(
          {
            studentID: user._id,
            courseID: course._id,
          },
          {
            studentID: user._id,
            courseID: course._id,
            exercises: exercises,
          },
          { new: true }
        );
        break;

      default:
        break;
    }
    // console.log(oldGrade);
    res.status(200).json(oldGrade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD COURSE GRADE
router.post("/:course/:user/add-grade", async (req, res) => {
  try {
    /*
    sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    */
    console.log(res.body);
    var courseName = req.params.course;
    var userName = req.params.user;
    var number = req.body.number;
    var gradeValue = req.body.grade;
    var type = req.body.type;
    if (
      !(req.body.username === userName) ||
      !(req.body.courseName === courseName)
    ) {
      res.status(500).json({
        error: "req.params and req.body data is not matched ",
      });
      return;
    }
    const user = await User.findOne({
      username: req.params.user,
      email: req.body.email,
      password: req.body.password,
    });
    // get course
    const course = await Course.findOne({
      courseName: courseName,
    });
    console.log("here");
    // get grade
    var grade = await Grade.findOne({
      studentID: user._id,
      courseID: course._id,
    });
    console.log(grade);

    if (grade === null) {
      // create new grade
      await Grade({ studentID: user._id, courseID: course._id }).save();
      grade = await Grade.findOne({
        studentID: user._id,
        courseID: course._id,
      });
    }
    switch (type) {
      case "lab":
        // check if there is any labs
        var labs = [];
        if (grade.labs.length === 0) {
          labs.push({ labNumber: number, labGrade: gradeValue });
        } else {
          labs = grade.labs.slice();
          // check if grade number is exists
          var isExists = false;
          labs.forEach((lab) => {
            if (lab.labNumber === number) {
              isExists = true;
            }
          });
          console.log("test");
          if (isExists) {
            res.status(500).json("lab number exists already.");
            console.log("lab number exists.");
            return;
          }
          labs.push({ labNumber: number, labGrade: gradeValue });
        }
        // update lab grade
        var oldGrade = await Grade.findOneAndUpdate(
          {
            studentID: user._id,
            courseID: course._id,
          },
          {
            studentID: user._id,
            courseID: course._id,
            labs: labs,
          },
          { new: true }
        );
        break;
      case "exercise":
        // check if there is any exercise
        var exercises = [];
        if (grade.exercises.length === 0) {
          exercises.push({
            exerciseNumber: number,
            exerciseGrade: gradeValue,
          });
        } else {
          exercises = grade.exercises.slice();
          // check if grade number is exists
          var isExists = false;
          exercises.forEach((exercise) => {
            if (exercise.exerciseNumber === number) {
              isExists = true;
            }
          });
          if (isExists) {
            res.status(500).json("exercise number exists already.");
            console.log("exercise number exists.");
            return;
          }
          exercises.push({
            exerciseNumber: number,
            exerciseGrade: gradeValue,
          });
        }
        // update lab grade
        var oldGrade = await Grade.findOneAndUpdate(
          {
            studentID: user._id,
            courseID: course._id,
          },
          {
            studentID: user._id,
            courseID: course._id,
            exercises: exercises,
          },
          { new: true }
        );
        break;

      default:
        break;
    }

    res.status(200).json(oldGrade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE COURSE GRADE
router.post("/:course/:user/update-grade", async (req, res) => {
  try {
    /*
    sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    */
    // var courseName = req.params.course;
    // var userName = req.params.user;
    // var number = req.body.number;
    // var oldGradeValue = req.body.oldGrade;
    // var newGradeValue = req.body.newGrade;
    // var type = req.body.type;
    // if (
    //   !(req.body.username === userName) ||
    //   !(req.body.courseName === courseName)
    // ) {
    //   res.status(500).json({
    //     error: "req.params and req.body data is not matched ",
    //   });
    //   return;
    // }
    // const user = await User.findOne({
    //   username: req.params.user,
    //   email: req.body.email,
    //   password: req.body.password,
    // });
    // // get course
    // const course = await Course.findOne({
    //   courseName: courseName,
    // });
    // grade
    var number = req.body.number;
    var oldGradeValue = req.body.oldGrade;
    var newGradeValue = req.body.newGrade;
    var type = req.body.type;
    var studentID = req.body.studentID;
    var courseID = req.body.courseID;
    console.log(studentID);
    console.log(courseID);
    var grade = await Grade.findOne({
      studentID: studentID,
      courseID: courseID,
    });
    console.log(grade);
    switch (type) {
      case "lab":
        // check if there is any labs
        var labs = [];
        if (grade.labs.length === 0) {
          res.status(500).json("user labs grades is empty list.");
          return;
        } else {
          labs = grade.labs.slice();
          // check if grade number is exists
          var isExists = false;

          labs.forEach((lab) => {
            if (lab.labNumber === number && lab.labGrade === oldGradeValue) {
              isExists = true;
              lab.labGrade = newGradeValue;
            }
          });
          if (!isExists) {
            res.status(500).json("lab number is not exists.");
            return;
          }
        }
        // update lab grade
        var oldGrade = await Grade.findOneAndUpdate(
          {
            studentID: studentID,
            courseID: courseID,
          },
          {
            studentID: studentID,
            courseID: courseID,
            labs: labs,
          },
          { new: true }
        );
        break;
      case "exercise":
        // check if there is any exercise
        var exercises = [];
        if (grade.exercises.length === 0) {
          res.status(500).json("user exercises grades is empty list.");
          return;
        } else {
          exercises = grade.exercises.slice();
          // check if grade number is exists
          var isExists = false;
          exercises.forEach((exercise) => {
            if (
              exercise.exerciseNumber === number &&
              exercise.exerciseGrade === oldGradeValue
            ) {
              isExists = true;
              exercise.exerciseGrade = newGradeValue;
            }
          });
          if (!isExists) {
            res.status(500).json("exercise values is not exists.");
            return;
          }
        }
        // update lab grade
        var oldGrade = await Grade.findOneAndUpdate(
          {
            studentID: studentID,
            courseID: courseID,
          },
          {
            studentID: studentID,
            courseID: courseID,
            exercises: exercises,
          },
          { new: true }
        );
        break;

      default:
        break;
    }

    res.status(200).json(oldGrade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
