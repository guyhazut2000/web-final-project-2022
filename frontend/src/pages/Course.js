import React from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StudentDataService from "../services/Student";
import TeacherDataService from "../services/Teacher";
import CourseItem from "../components/CourseItem";
import StudentTable from "../components/StudentTable";

// func component that display course data
const Course = () => {
  const location = useLocation();
  // get course name from url
  const name = location.pathname.split("/")[2];
  //set user
  const user = useSelector((state) => state.user.currentUser);
  //set course
  const [course, setCourse] = useState({});
  //set grades
  const [grades, setGrades] = useState({});
  // get course grades
  useEffect(() => {
    const getGrades = async () => {
      // console.log("getCourse is rendered");
      // check user type
      switch (user.userType) {
        // if student
        case "student":
          try {
            var res = await StudentDataService.getCourseByNameAndUser(name, {
              username: user.username,
              email: user.email,
              password: user.password,
            });
            if (res.data !== null) {
              // console.log("course data:", res.data);
              setCourse(res.data);
              var gradesRes = await StudentDataService.getStudentGradesByCourse(
                name,
                {
                  username: user.username,
                  email: user.email,
                  password: user.password,
                }
              );
              if (gradesRes.data !== null) {
                // console.log("grades data:", gradesRes.data);
                setGrades(gradesRes.data);
              }
            }
          } catch (error) {
            console.log(error.message);
          }
          break;
        // if teacher
        case "teacher":
          try {
            res = await TeacherDataService.getCourseByNameAndUser(name, {
              username: user.username,
              email: user.email,
              password: user.password,
            });
            if (res.data !== null) {
              // console.log("course data:", res.data);
              setCourse(res.data);
            }
            // display students
            // display grades
            // display add, remove , update grades
          } catch (error) {
            console.log(error.message);
          }
          break;

        default:
          console.log("error user type is undefined");
          break;
      }
    };
    getGrades();
  }, []);

  // console.log(grades);
  // display user or teacher course page
  return (
    <>
      <Navbar />
      {user.userType === "student" ? (
        Object.keys(grades).length !== 0 ? (
          <CourseItem item={grades} />
        ) : (
          <h1>Currently you have no grades at {name}</h1>
        )
      ) : (
        ""
      )}
      {user.userType === "teacher" ? (
        course.students ? (
          <StudentTable students={course.students} course={course} />
        ) : (
          <h1>Currently you have no students signed for course {name}</h1>
        )
      ) : (
        ""
      )}
    </>
  );
};

export default Course;
