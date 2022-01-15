import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Courses from "../components/Courses";
import StudentDataService from "../services/Student";
import TeacherDataService from "../services/Teacher";
import { useDispatch, useSelector } from "react-redux";
import {
  setCoursesListFailure,
  setCoursesListSuccess,
  setCoursesListStart,
} from "../redux/courseRedux";
// func component that render courses list
const CoursesList = () => {
  // console.log("CoursesList is rendered");
  // fetch user data
  const user = useSelector((state) => state.user.currentUser);
  const isFetching = useSelector((state) => state.course.isFetching);
  const dispatch = useDispatch();
  //set courses list
  const [courses, setCoursesList] = useState([]);

  // get courses
  useEffect(() => {
    const getCourses = async () => {
      try {
        // console.log("start fetching courses...");
        var data = {
          username: user.username,
          password: user.password,
          email: user.email,
        };
        // start fetching
        dispatch(setCoursesListStart());
        // check user type (student or teacher)
        switch (user.userType) {
          case "student":
            var res = await StudentDataService.getAllCoursesByID(
              user._id,
              data
            );
            if (res.data !== null) {
              // console.log("courses list= ", res.data);
              // console.log("student courses:", res.data);
              dispatch(setCoursesListSuccess(res.data));
              setCoursesList(res.data);
            } else {
              // console.log("courses list= ", res.data);
              dispatch(setCoursesListSuccess(null));
            }

            break;
          case "teacher":
            // console.log(user._id, data);
            res = await TeacherDataService.getAllCoursesByID(user._id, data);
            if (res.data !== null) {
              // console.log("courses list= ", res.data);
              // console.log("teacher courses:", res.data);
              dispatch(setCoursesListSuccess(res.data));
              setCoursesList(res.data);
            } else {
              // console.log("courses list= ", res.data);
              dispatch(setCoursesListSuccess(null));
            }
            break;

          default:
            // console.log("user type is not exists.");
            dispatch(setCoursesListFailure());
            break;
        }
      } catch (error) {
        dispatch(setCoursesListFailure());
      }
    };
    // fetch courses
    getCourses();
  }, []);
  // dispatch(setCoursesListSuccess(null));

  // if its not empty display courses.
  return courses.length !== 0 ? (
    // display user courses
    <>
      <Navbar />
      {/* {alert(courses.length)} */}
      <div className="course-list">
        <Courses courses={courses} />
      </div>
    </>
  ) : (
    // if user doesn't have courses
    <>
      <Navbar />
      {!isFetching ? <h1>Currently you have no courses.</h1> : ""}
    </>
  );
};

export default CoursesList;
