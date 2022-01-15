import React, { useEffect, useState } from "react";
import StudentDataService from "../services/Student";
import UserDataService from "../services/User";
import TeacherDataService from "../services/Teacher";
import Table from "../components/Table";
import AddNewGrade from "../components/AddNewGrade";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const StudentTable = (props) => {
  // console.log(props.students[0].studentID);
  // console.log(props);
  // console.log("student table rendered");
  var students = props.students;
  var course = props.course;
  var defaultStudent;
  // if there is students in the course set random students to be displayed
  if (Array.isArray(props.students) && props.students.length !== 0)
    defaultStudent = props.students[0].studentID;
  // console.log(defaultStudent);
  const [selectedStudent, setSelectedStudent] = useState(defaultStudent);
  const [grades, setGrades] = useState();
  const [average, setAverage] = useState(0);

  const styles = {
    width: "200px",
    margin: "10px",
  };

  useEffect(() => {
    const getStudentGrades = async () => {
      try {
        // console.log(selectedStudent);
        // console.log("getStudentGrades is rendered");
        var user = await UserDataService.getUserByID(selectedStudent);
        // console.log("user:", user.data);
        var data = {
          username: user.data.username,
          email: user.data.email,
          password: user.data.password,
        };
        var grades = await StudentDataService.getStudentGradesByCourse(
          course.courseName,
          data
        );
        // console.log("grades:", grades.data);
        setGrades(grades.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    //check if there is students if there is then fetch students grades.
    Array.isArray(props.students) &&
      props.students.length !== 0 &&
      getStudentGrades();
  }, [selectedStudent]);

  const handleSelectChange = (e) => {
    // console.log(e.target.value);
    setSelectedStudent(e.target.value);
    setGrades(null);
  };
  useEffect(() => {
    const getCourseAverageGrade = async () => {
      var sumOfGrades = 0;
      var totalGrades = 0;
      try {
        var courseName = course.courseName;
        var res = await TeacherDataService.getCourseGradesByCourseName(
          courseName
        );
        if (res && res.data !== null) {
          // console.log("all grades", res.data);
          res.data.forEach((grades) => {
            if (grades) {
              grades.labs.forEach((lab) => {
                sumOfGrades += lab.labGrade;
                totalGrades++;
              });
              grades.exercises.forEach((exercise) => {
                sumOfGrades += exercise.exerciseGrade;
                totalGrades++;
              });
            }
          });
        }
        var avg = sumOfGrades / totalGrades;
        avg = avg + "";
        setAverage(avg.substring(0, 5));
      } catch (error) {
        console.log(error);
      }
    };
    students && getCourseAverageGrade();
  }, [average]);
  return (
    <>
      {students.length !== 0 ? (
        <div
          className="course-list"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0",
                fontWeight: 600,
                fontFamily: "Josefin Slab",
              }}
            >
              {" "}
              {course.courseName.toUpperCase()} Course
            </h1>
            <h1
              style={{
                margin: "0",
                fontWeight: 600,
                fontFamily: "Josefin Slab",
              }}
            >
              {" "}
              Course Average: {average}
            </h1>
          </div>
          <TextField
            select
            label="selected Student"
            value={selectedStudent}
            onChange={handleSelectChange}
            style={{ width: "100%", margin: "10px 0" }}
          >
            {students
              ? students.map((student, i) => (
                  <MenuItem key={i} value={student.studentID}>
                    {student.studentName}
                  </MenuItem>
                ))
              : ""}
          </TextField>
          <div style={{ display: "flex" }}>
            <div className="col-sm-8">
              <h2>Lab Grades</h2>
              {grades && (
                <Table
                  th={["No", "grade", "action"]}
                  data={grades}
                  type="lab"
                ></Table>
              )}
            </div>
            <div className="col-sm-8">
              <h2>Exercise Grades</h2>
              {grades && (
                <Table
                  th={["No", "grade", "action"]}
                  data={grades}
                  type="exercise"
                ></Table>
              )}
            </div>
          </div>
          <AddNewGrade
            students={students}
            grades={grades}
            selectedStudent={selectedStudent}
          />
        </div>
      ) : (
        <div className="container">
          <h1>Currently you have no students signed for the course</h1>
        </div>
      )}
    </>
  );
};

export default StudentTable;
